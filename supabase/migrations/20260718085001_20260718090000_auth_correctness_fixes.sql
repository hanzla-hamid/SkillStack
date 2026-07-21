/*
# Auth correctness fixes

## Purpose
Fixes two bugs identified in the Phase 1 audit:
1. Username login is broken for non-admins — the `select_own_profile` RLS policy
   blocks looking up another user's email by username, so every username login
   attempt returns "User not found."
2. The `handle_new_user` trigger only copies `full_name` from signup metadata,
   dropping `phone`, `username`, `gender`, `date_of_birth`, `city`, `country`,
   and `newsletter_opt_in` collected on the register form.

## Changes

### 1. New function: `lookup_email_by_username(p_username text) RETURNS text`
- `SECURITY DEFINER` function that safely resolves an email address from a
  username, bypassing RLS so the lookup works before the user is authenticated.
- Returns the `email` column from `profiles` where `username` matches.
- Returns `NULL` if no match is found (the client treats NULL as "user not found").
- Granted `EXECUTE` to `anon` and `authenticated` so it works during the login
  flow (before a session exists).

### 2. Modified function: `handle_new_user()`
- Extended to copy ALL profile fields from `raw_user_meta_data`:
  `full_name`, `username`, `phone`, `gender`, `date_of_birth`, `city`,
  `country`, `newsletter_opt_in`.
- Uses `COALESCE` for each field so missing metadata doesn't break the insert.
- Remains `SECURITY DEFINER` so it can insert into `profiles` during signup.

## Security
- `lookup_email_by_username` is intentionally minimal — it returns ONLY the
  email, never the full profile row. This prevents username enumeration from
  leaking other user data. The function is callable by `anon` because login
  happens before a session is established.
- `handle_new_user` remains `SECURITY DEFINER` and runs only on
  `AFTER INSERT ON auth.users` — it cannot be called directly by clients.

## Important Notes
1. Both functions use `CREATE OR REPLACE` so the migration is idempotent and
   safe to re-run.
2. The `on_auth_user_created` trigger is dropped and recreated to pick up the
   updated function body.
3. Existing profiles are NOT modified — only new signups are affected.
4. The register page will pass all fields through `signUp({ options: { data } })`
   so the trigger can read them from `raw_user_meta_data`.
*/

-- 1. Username lookup function (SECURITY DEFINER, bypasses RLS)
CREATE OR REPLACE FUNCTION lookup_email_by_username(p_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email
  FROM profiles
  WHERE username = p_username
  LIMIT 1;

  RETURN v_email;
END;
$$;

-- Grant execute to anon (login happens before session) and authenticated
GRANT EXECUTE ON FUNCTION lookup_email_by_username(text) TO anon;
GRANT EXECUTE ON FUNCTION lookup_email_by_username(text) TO authenticated;

-- 2. Extended handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (
    id,
    email,
    full_name,
    username,
    phone,
    gender,
    date_of_birth,
    city,
    country,
    newsletter_opt_in
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'username', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    COALESCE(NEW.raw_user_meta_data->>'gender', NULL),
    COALESCE(NEW.raw_user_meta_data->>'date_of_birth', NULL)::date,
    COALESCE(NEW.raw_user_meta_data->>'city', NULL),
    COALESCE(NEW.raw_user_meta_data->>'country', NULL),
    COALESCE((NEW.raw_user_meta_data->>'newsletter_opt_in')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger to pick up the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
