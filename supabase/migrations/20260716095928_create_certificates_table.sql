/*
# Create certificates table

## Purpose
Stores course completion certificates with unique verification IDs and QR-code-friendly URLs.

## New Tables

### 1. `certificates`
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users.id)
- `course_id` (uuid, FK to courses.id)
- `certificate_number` (text, unique, not null) — human-readable cert ID (e.g. SS-2026-00001)
- `student_name` (text, not null) — name at time of issue
- `course_title` (text, not null) — course title at time of issue
- `teacher_name` (text, nullable) — teacher name at time of issue
- `issued_at` (timestamptz, default now())
- `status` (text, default 'active') — active, revoked

## Security (RLS)
- SELECT: users can read their own certificates; teachers can read certs for their courses; admins all
- INSERT: teachers/admins can issue certificates
- UPDATE: admins can update (e.g. revoke)
- DELETE: admins only

## Important Notes
1. Certificate numbers are auto-generated as SS-YYYY-XXXXX format.
2. The certificate captures student/course/teacher names at issue time so it remains valid even if names change later.
3. Verification is done via the certificate_number column (unique).
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  certificate_number text UNIQUE NOT NULL,
  student_name text NOT NULL,
  course_title text NOT NULL,
  teacher_name text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active'
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_certificates" ON certificates;
CREATE POLICY "select_certificates"
  ON certificates FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = certificates.course_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "insert_certificates" ON certificates;
CREATE POLICY "insert_certificates"
  ON certificates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = certificates.course_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "update_certificates" ON certificates;
CREATE POLICY "update_certificates"
  ON certificates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "delete_certificates" ON certificates;
CREATE POLICY "delete_certificates"
  ON certificates FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

CREATE INDEX IF NOT EXISTS idx_certificates_user ON certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_course ON certificates(course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_number ON certificates(certificate_number);
