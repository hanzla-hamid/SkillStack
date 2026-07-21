/*
# Create profiles and notifications tables

## Purpose
Sets up the core authentication infrastructure for SkillStack:
- A `profiles` table that extends Supabase's built-in `auth.users` with public profile data, roles, XP, and level.
- A `notifications` table for the in-app notification system.

## New Tables

### 1. `profiles`
- `id` (uuid, PK, FK to auth.users.id) — links to the auth user
- `email` (text, not null) — copied from auth email
- `full_name` (text, nullable) — user's full name
- `username` (text, unique, nullable) — optional username for login
- `avatar_url` (text, nullable) — profile picture URL
- `cover_url` (text, nullable) — cover image URL
- `phone` (text, nullable) — phone number
- `bio` (text, nullable) — user bio
- `gender` (text, nullable) — gender (optional)
- `date_of_birth` (date, nullable) — DOB (optional)
- `city` (text, nullable) — city
- `country` (text, nullable) — country
- `role` (text, not null, default 'student') — one of: student, teacher, moderator, admin, super_admin
- `xp` (integer, not null, default 0) — experience points for gamification
- `level` (integer, not null, default 1) — user level
- `newsletter_opt_in` (boolean, default false) — newsletter subscription
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

### 2. `notifications`
- `id` (uuid, PK, default gen_random_uuid)
- `user_id` (uuid, FK to auth.users.id, NOT NULL, DEFAULT auth.uid())
- `title` (text, not null)
- `message` (text, not null)
- `type` (text, not null) — category: course_update, quiz_result, assignment_deadline, certificate_ready, reward_unlocked, community_reply, admin_announcement, newsletter
- `read` (boolean, default false)
- `created_at` (timestamptz, default now())

## Security (RLS)

### profiles
- SELECT: users can read their own profile; admins/moderators can read all
- INSERT: users can insert their own profile (via trigger on signup)
- UPDATE: users can update their own profile; admins can update any

### notifications
- SELECT: users can read their own notifications
- INSERT: users can insert notifications for themselves; system inserts via service role
- UPDATE: users can mark their own notifications as read
- DELETE: users can delete their own notifications

## Triggers
- `handle_new_user`: automatically creates a profile row when a new auth user signs up
- `update_updated_at`: automatically updates the `updated_at` column on profile changes

## Important Notes
1. The `handle_new_user` trigger copies the email from auth.users into profiles on signup.
2. Role defaults to 'student' for all new users.
3. Admin roles (admin, super_admin) must be set manually via SQL or admin panel.
4. The `notifications.user_id` column has `DEFAULT auth.uid()` so inserts from authenticated clients work without explicitly passing the user ID.
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  cover_url text,
  phone text,
  bio text,
  gender text,
  date_of_birth date,
  city text,
  country text,
  role text NOT NULL DEFAULT 'student',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  newsletter_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles: SELECT — users can read own profile, admins can read all
DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin', 'moderator')
    )
  );

-- Profiles: INSERT — only via trigger (service role), but allow self-insert
DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Profiles: UPDATE — users can update own profile, admins can update any
DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications: SELECT — users can read their own
DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications: INSERT — users can insert for themselves
DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications: UPDATE — users can update their own (mark as read)
DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Notifications: DELETE — users can delete their own
DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create handle_new_user trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply handle_new_user trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
