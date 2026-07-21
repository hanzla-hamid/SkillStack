import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  phone: string | null;
  bio: string | null;
  gender: string | null;
  date_of_birth: string | null;
  city: string | null;
  country: string | null;
  role: string;
  xp: number;
  level: number;
  newsletter_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  category: string | null;
  category_type: string;
  difficulty: string;
  duration: string | null;
  price: number;
  thumbnail_url: string | null;
  preview_video_url: string | null;
  status: string;
  teacher_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  duration_minutes: number;
  sort_order: number;
  is_preview: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: string;
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  time_spent_seconds: number;
}

export interface Assignment {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  max_score: number;
  due_date: string | null;
  file_url: string | null;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  content: string | null;
  file_url: string | null;
  score: number | null;
  feedback: string | null;
  status: string;
  submitted_at: string;
  graded_at: string | null;
}

export interface Quiz {
  id: string;
  course_id: string;
  module_id: string | null;
  title: string;
  description: string | null;
  difficulty: string;
  passing_score: number;
  max_attempts: number;
  time_limit_minutes: number | null;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_type: string;
  question: string;
  options: string[] | null;
  correct_answer: string | null;
  correct_answers: string[] | null;
  explanation: string | null;
  points: number;
  sort_order: number;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  answers: Record<string, string> | null;
  score: number | null;
  passed: boolean | null;
  started_at: string;
  completed_at: string | null;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_number: string;
  student_name: string;
  course_title: string;
  teacher_name: string | null;
  issued_at: string;
  status: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}