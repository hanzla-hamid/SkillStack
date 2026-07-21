/*
# Create course management tables (Part 2: assignments, submissions, quizzes, quiz_questions, quiz_attempts)

## Purpose
Sets up the assessment infrastructure — assignments with student submissions,
quizzes with questions and attempt tracking.

## New Tables

### 1. `assignments`
- `id` (uuid, PK)
- `course_id` (uuid, FK to courses.id ON DELETE CASCADE)
- `module_id` (uuid, FK to modules.id, nullable) — optional link to a specific module
- `title` (text, not null)
- `description` (text, nullable) — assignment instructions
- `max_score` (integer, default 100)
- `due_date` (timestamptz, nullable)
- `file_url` (text, nullable) — attachment
- `created_at` (timestamptz)

### 2. `submissions`
- `id` (uuid, PK)
- `assignment_id` (uuid, FK to assignments.id ON DELETE CASCADE)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users.id)
- `content` (text, nullable) — text submission
- `file_url` (text, nullable) — file submission
- `score` (integer, nullable) — graded score
- `feedback` (text, nullable) — teacher feedback
- `status` (text, default 'pending') — pending, graded, returned
- `submitted_at` (timestamptz, default now())
- `graded_at` (timestamptz, nullable)
- UNIQUE (assignment_id, user_id)

### 3. `quizzes`
- `id` (uuid, PK)
- `course_id` (uuid, FK to courses.id ON DELETE CASCADE)
- `module_id` (uuid, FK to modules.id, nullable)
- `title` (text, not null)
- `description` (text, nullable)
- `difficulty` (text, default 'medium') — easy, medium, hard
- `passing_score` (integer, default 70) — percentage to pass
- `max_attempts` (integer, default 3)
- `time_limit_minutes` (integer, nullable)
- `created_at` (timestamptz)

### 4. `quiz_questions`
- `id` (uuid, PK)
- `quiz_id` (uuid, FK to quizzes.id ON DELETE CASCADE)
- `question_type` (text, not null) — mcq, true_false, fill_blank, short_answer, coding
- `question` (text, not null)
- `options` (jsonb, nullable) — for MCQ: array of options
- `correct_answer` (text, nullable) — the correct answer
- `correct_answers` (jsonb, nullable) — for multiple correct answers
- `explanation` (text, nullable)
- `points` (integer, default 1)
- `sort_order` (integer, default 0)

### 5. `quiz_attempts`
- `id` (uuid, PK)
- `quiz_id` (uuid, FK to quizzes.id ON DELETE CASCADE)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users.id)
- `answers` (jsonb, nullable) — student's answers
- `score` (integer, nullable) — percentage score
- `passed` (boolean, nullable)
- `started_at` (timestamptz, default now())
- `completed_at` (timestamptz, nullable)

## Security (RLS)

### assignments
- SELECT: enrolled students can read; teacher/admin can read all
- INSERT/UPDATE/DELETE: course teacher or admin

### submissions
- SELECT: students can read their own; teachers can read submissions for their courses; admins all
- INSERT: students can submit their own
- UPDATE: teachers/admins can grade (update score, feedback, status)
- DELETE: students can delete their own

### quizzes
- SELECT: enrolled students can read; teacher/admin can read all
- INSERT/UPDATE/DELETE: course teacher or admin

### quiz_questions
- SELECT: enrolled students can read; teacher/admin can read all
- INSERT/UPDATE/DELETE: course teacher or admin

### quiz_attempts
- SELECT: students can read their own; teachers can read for their courses; admins all
- INSERT: students can create their own attempts
- UPDATE: students can update their own attempts (submit answers)
- DELETE: students can delete their own attempts
*/

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  max_score integer DEFAULT 100,
  due_date timestamptz,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_assignments" ON assignments;
CREATE POLICY "select_assignments"
  ON assignments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = assignments.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
    OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = assignments.course_id AND e.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_assignments" ON assignments;
CREATE POLICY "insert_assignments"
  ON assignments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = assignments.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "update_assignments" ON assignments;
CREATE POLICY "update_assignments"
  ON assignments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = assignments.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = assignments.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "delete_assignments" ON assignments;
CREATE POLICY "delete_assignments"
  ON assignments FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = assignments.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  content text,
  file_url text,
  score integer,
  feedback text,
  status text NOT NULL DEFAULT 'pending',
  submitted_at timestamptz NOT NULL DEFAULT now(),
  graded_at timestamptz,
  UNIQUE (assignment_id, user_id)
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_submissions" ON submissions;
CREATE POLICY "select_submissions"
  ON submissions FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "insert_submissions" ON submissions;
CREATE POLICY "insert_submissions"
  ON submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "update_submissions" ON submissions;
CREATE POLICY "update_submissions"
  ON submissions FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM assignments a
      JOIN courses c ON c.id = a.course_id
      WHERE a.id = submissions.assignment_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "delete_submissions" ON submissions;
CREATE POLICY "delete_submissions"
  ON submissions FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  module_id uuid REFERENCES modules(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  difficulty text NOT NULL DEFAULT 'medium',
  passing_score integer DEFAULT 70,
  max_attempts integer DEFAULT 3,
  time_limit_minutes integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quizzes" ON quizzes;
CREATE POLICY "select_quizzes"
  ON quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
    OR EXISTS (SELECT 1 FROM enrollments e WHERE e.course_id = quizzes.course_id AND e.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_quizzes" ON quizzes;
CREATE POLICY "insert_quizzes"
  ON quizzes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "update_quizzes" ON quizzes;
CREATE POLICY "update_quizzes"
  ON quizzes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "delete_quizzes" ON quizzes;
CREATE POLICY "delete_quizzes"
  ON quizzes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM courses c WHERE c.id = quizzes.course_id AND c.teacher_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_type text NOT NULL,
  question text NOT NULL,
  options jsonb,
  correct_answer text,
  correct_answers jsonb,
  explanation text,
  points integer DEFAULT 1,
  sort_order integer DEFAULT 0
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quiz_questions" ON quiz_questions;
CREATE POLICY "select_quiz_questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
    OR EXISTS (
      SELECT 1 FROM quizzes q
      JOIN enrollments e ON e.course_id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND e.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "insert_quiz_questions" ON quiz_questions;
CREATE POLICY "insert_quiz_questions"
  ON quiz_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "update_quiz_questions" ON quiz_questions;
CREATE POLICY "update_quiz_questions"
  ON quiz_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "delete_quiz_questions" ON quiz_questions;
CREATE POLICY "delete_quiz_questions"
  ON quiz_questions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_questions.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  answers jsonb,
  score integer,
  passed boolean,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_quiz_attempts" ON quiz_attempts;
CREATE POLICY "select_quiz_attempts"
  ON quiz_attempts FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM quizzes q
      JOIN courses c ON c.id = q.course_id
      WHERE q.id = quiz_attempts.quiz_id AND c.teacher_id = auth.uid()
    )
    OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin'))
  );

DROP POLICY IF EXISTS "insert_quiz_attempts" ON quiz_attempts;
CREATE POLICY "insert_quiz_attempts"
  ON quiz_attempts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "update_quiz_attempts" ON quiz_attempts;
CREATE POLICY "update_quiz_attempts"
  ON quiz_attempts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "delete_quiz_attempts" ON quiz_attempts;
CREATE POLICY "delete_quiz_attempts"
  ON quiz_attempts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_assignments_course ON assignments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_course ON quizzes(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
