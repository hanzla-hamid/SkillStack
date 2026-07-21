/*
# Create course management tables (Part 1: courses, modules, lessons, enrollments, progress)

## Purpose
Sets up the core LMS infrastructure for SkillStack — courses, their modules and lessons,
student enrollments, and per-lesson progress tracking.

## New Tables

### 1. `courses`
- `id` (uuid, PK) — unique course identifier
- `title` (text, not null) — course name
- `slug` (text, unique, not null) — URL-friendly identifier
- `description` (text, nullable) — short description
- `long_description` (text, nullable) — detailed description for course page
- `category` (text, nullable) — e.g. "Web Development", "Graphic Designing"
- `category_type` (text, default 'physical') — 'physical' or 'online'
- `difficulty` (text, default 'beginner') — beginner, intermediate, advanced
- `duration` (text, nullable) — human-readable duration (e.g. "6 Months")
- `price` (numeric, default 0) — course price (0 = free)
- `thumbnail_url` (text, nullable) — course thumbnail image
- `preview_video_url` (text, nullable) — intro/preview video
- `status` (text, default 'draft') — draft, published, archived
- `teacher_id` (uuid, FK to profiles.id) — course instructor
- `sort_order` (integer, default 0) — display ordering
- `created_at`, `updated_at` (timestamptz)

### 2. `modules`
- `id` (uuid, PK)
- `course_id` (uuid, FK to courses.id ON DELETE CASCADE)
- `title` (text, not null)
- `description` (text, nullable)
- `sort_order` (integer, default 0)
- `created_at` (timestamptz)

### 3. `lessons`
- `id` (uuid, PK)
- `module_id` (uuid, FK to modules.id ON DELETE CASCADE)
- `title` (text, not null)
- `description` (text, nullable)
- `content` (text, nullable) — rich text / markdown content
- `video_url` (text, nullable) — lesson video
- `duration_minutes` (integer, default 0) — estimated duration
- `sort_order` (integer, default 0)
- `is_preview` (boolean, default false) — can be viewed without enrollment
- `created_at` (timestamptz)

### 4. `enrollments`
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users.id)
- `course_id` (uuid, FK to courses.id)
- `status` (text, default 'active') — active, completed, cancelled
- `progress_percentage` (integer, default 0)
- `enrolled_at` (timestamptz, default now())
- `completed_at` (timestamptz, nullable)
- UNIQUE constraint on (user_id, course_id)

### 5. `lesson_progress`
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL DEFAULT auth.uid(), FK to auth.users.id)
- `lesson_id` (uuid, FK to lessons.id ON DELETE CASCADE)
- `is_completed` (boolean, default false)
- `completed_at` (timestamptz, nullable)
- `time_spent_seconds` (integer, default 0)
- UNIQUE constraint on (user_id, lesson_id)

## Security (RLS)

### courses
- SELECT: public can read published courses; teachers/admins can read all their courses
- INSERT/UPDATE/DELETE: teachers can manage their own courses; admins can manage all

### modules & lessons
- SELECT: public can read modules/lessons of published courses; anyone can read preview lessons
- INSERT/UPDATE/DELETE: course teacher or admin

### enrollments
- SELECT: users can read their own enrollments; teachers can read enrollments in their courses; admins can read all
- INSERT: users can enroll themselves
- UPDATE: users can update their own enrollment progress
- DELETE: users can unenroll themselves

### lesson_progress
- SELECT: users can read their own progress
- INSERT/UPDATE: users can manage their own progress
- DELETE: users can delete their own progress

## Important Notes
1. Published courses are publicly readable (no auth needed) so visitors can browse.
2. Teachers can only manage courses where they are the assigned teacher_id.
3. Admins (via profiles.role check) can manage all courses.
4. Enrollment is self-service — users enroll themselves.
5. Lesson progress is self-managed by the enrolled user.
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  long_description text,
  category text,
  category_type text NOT NULL DEFAULT 'physical',
  difficulty text NOT NULL DEFAULT 'beginner',
  duration text,
  price numeric DEFAULT 0,
  thumbnail_url text,
  preview_video_url text,
  status text NOT NULL DEFAULT 'draft',
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Courses: SELECT — public can read published; teachers/admins can read all
DROP POLICY IF EXISTS "select_courses" ON courses;
CREATE POLICY "select_courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    OR teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Courses: INSERT — teachers and admins
DROP POLICY IF EXISTS "insert_courses" ON courses;
CREATE POLICY "insert_courses"
  ON courses FOR INSERT
  TO authenticated
  WITH CHECK (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin', 'teacher')
    )
  );

-- Courses: UPDATE — course teacher or admin
DROP POLICY IF EXISTS "update_courses" ON courses;
CREATE POLICY "update_courses"
  ON courses FOR UPDATE
  TO authenticated
  USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Courses: DELETE — course teacher or admin
DROP POLICY IF EXISTS "delete_courses" ON courses;
CREATE POLICY "delete_courses"
  ON courses FOR DELETE
  TO authenticated
  USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Modules: SELECT — public for published courses; teacher/admin for all
DROP POLICY IF EXISTS "select_modules" ON modules;
CREATE POLICY "select_modules"
  ON modules FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM courses WHERE courses.id = modules.course_id AND courses.status = 'published')
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Modules: INSERT — course teacher or admin
DROP POLICY IF EXISTS "insert_modules" ON modules;
CREATE POLICY "insert_modules"
  ON modules FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Modules: UPDATE — course teacher or admin
DROP POLICY IF EXISTS "update_modules" ON modules;
CREATE POLICY "update_modules"
  ON modules FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Modules: DELETE — course teacher or admin
DROP POLICY IF EXISTS "delete_modules" ON modules;
CREATE POLICY "delete_modules"
  ON modules FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = modules.course_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text,
  video_url text,
  duration_minutes integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_preview boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Lessons: SELECT — public for published course lessons or preview lessons; teacher/admin for all
DROP POLICY IF EXISTS "select_lessons" ON lessons;
CREATE POLICY "select_lessons"
  ON lessons FOR SELECT
  TO anon, authenticated
  USING (
    lessons.is_preview = true
    OR EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND c.status = 'published'
    )
    OR EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Lessons: INSERT — course teacher or admin
DROP POLICY IF EXISTS "insert_lessons" ON lessons;
CREATE POLICY "insert_lessons"
  ON lessons FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Lessons: UPDATE — course teacher or admin
DROP POLICY IF EXISTS "update_lessons" ON lessons;
CREATE POLICY "update_lessons"
  ON lessons FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Lessons: DELETE — course teacher or admin
DROP POLICY IF EXISTS "delete_lessons" ON lessons;
CREATE POLICY "delete_lessons"
  ON lessons FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM modules m
      JOIN courses c ON c.id = m.course_id
      WHERE m.id = lessons.module_id
      AND (c.teacher_id = auth.uid() OR EXISTS (
        SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
      ))
    )
  );

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  progress_percentage integer NOT NULL DEFAULT 0,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE (user_id, course_id)
);

ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Enrollments: SELECT — own enrollments, or teacher sees their course enrollments, admin sees all
DROP POLICY IF EXISTS "select_enrollments" ON enrollments;
CREATE POLICY "select_enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id
      AND c.teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Enrollments: INSERT — users can enroll themselves
DROP POLICY IF EXISTS "insert_enrollments" ON enrollments;
CREATE POLICY "insert_enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Enrollments: UPDATE — users can update their own progress; teachers/admins can update
DROP POLICY IF EXISTS "update_enrollments" ON enrollments;
CREATE POLICY "update_enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id
      AND c.teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  )
  WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM courses c
      WHERE c.id = enrollments.course_id
      AND c.teacher_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'super_admin')
    )
  );

-- Enrollments: DELETE — users can unenroll themselves
DROP POLICY IF EXISTS "delete_enrollments" ON enrollments;
CREATE POLICY "delete_enrollments"
  ON enrollments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  time_spent_seconds integer DEFAULT 0,
  UNIQUE (user_id, lesson_id)
);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

-- Lesson progress: SELECT — own progress only
DROP POLICY IF EXISTS "select_lesson_progress" ON lesson_progress;
CREATE POLICY "select_lesson_progress"
  ON lesson_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Lesson progress: INSERT — own progress
DROP POLICY IF EXISTS "insert_lesson_progress" ON lesson_progress;
CREATE POLICY "insert_lesson_progress"
  ON lesson_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Lesson progress: UPDATE — own progress
DROP POLICY IF EXISTS "update_lesson_progress" ON lesson_progress;
CREATE POLICY "update_lesson_progress"
  ON lesson_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Lesson progress: DELETE — own progress
DROP POLICY IF EXISTS "delete_lesson_progress" ON lesson_progress;
CREATE POLICY "delete_lesson_progress"
  ON lesson_progress FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_modules_course ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);

-- Updated_at trigger for courses
DROP TRIGGER IF EXISTS trigger_courses_updated_at ON courses;
CREATE TRIGGER trigger_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
