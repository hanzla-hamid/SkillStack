"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Play,
  Lock,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  BookOpen,
  Clock,
  Award,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import {
  supabase,
  Course,
  Module,
  Lesson,
  LessonProgress,
  Enrollment,
} from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";

function LearnContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [slug]);

  const fetchCourseData = async () => {
    setLoading(true);
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!courseData) {
      setLoading(false);
      return;
    }
    setCourse(courseData as Course);

    const { data: moduleData } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseData.id)
      .order("sort_order", { ascending: true });

    let fetchedLessons: Lesson[] = [];
    if (moduleData) {
      setModules(moduleData as Module[]);
      for (const mod of moduleData) {
        const { data: lessonData } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", mod.id)
          .order("sort_order", { ascending: true });
        if (lessonData) fetchedLessons.push(...(lessonData as Lesson[]));
      }
      setAllLessons(fetchedLessons);
      if (fetchedLessons.length > 0) setCurrentLesson(fetchedLessons[0]);
    }

    if (user) {
      const { data: enrollData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseData.id)
        .maybeSingle();
      setEnrollment(enrollData as Enrollment | null);

      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user.id)
        .in(
          "lesson_id",
          fetchedLessons.map((l) => l.id),
        );
      if (progressData) {
        const pMap: Record<string, boolean> = {};
        (progressData as LessonProgress[]).forEach((p) => {
          pMap[p.lesson_id] = p.is_completed;
        });
        setProgress(pMap);
      }
    }

    setLoading(false);
  };

  const markComplete = async (lessonId: string) => {
    if (!user) return;
    const { error } = await supabase.from("lesson_progress").upsert({
      user_id: user.id,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    });

    if (!error) {
      setProgress((prev) => ({ ...prev, [lessonId]: true }));
      updateEnrollmentProgress();
    }
  };

  const updateEnrollmentProgress = async () => {
    if (!user || !course || allLessons.length === 0) return;
    const completedCount = allLessons.filter((l) => progress[l.id]).length + 1;
    const percentage = Math.round((completedCount / allLessons.length) * 100);
    await supabase
      .from("enrollments")
      .update({ progress_percentage: percentage })
      .eq("user_id", user.id)
      .eq("course_id", course.id);
  };

  const goToLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setSidebarOpen(false);
  };

  const goToNextLesson = () => {
    if (!currentLesson) return;
    const idx = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (idx < allLessons.length - 1) {
      setCurrentLesson(allLessons[idx + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (!currentLesson) return;
    const idx = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (idx > 0) {
      setCurrentLesson(allLessons[idx - 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <BookOpen className="h-12 w-12 text-gold/50" />
        <p className="text-sm text-[var(--color-text-secondary)]">
          Course not found.
        </p>
      </div>
    );
  }

  const completedCount = allLessons.filter((l) => progress[l.id]).length;
  const progressPercent =
    allLessons.length > 0
      ? Math.round((completedCount / allLessons.length) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Course header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            {course.title}
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {completedCount} of {allLessons.length} lessons completed ·{" "}
            {progressPercent}%
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] lg:hidden"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Lesson content */}
        <div className="lg:col-span-2">
          {currentLesson ? (
            <GlassCard className="overflow-hidden">
              {/* Video placeholder */}
              <div className="relative aspect-video bg-[var(--color-surface)]">
                {currentLesson.video_url ? (
                  <video
                    src={currentLesson.video_url}
                    controls
                    className="h-full w-full"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                      <Play className="h-8 w-8 fill-gold text-gold" />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Video content coming soon
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  {currentLesson.title}
                </h3>
                {currentLesson.description && (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    {currentLesson.description}
                  </p>
                )}
                {currentLesson.content && (
                  <div className="mt-4 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {currentLesson.content}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-default)] pt-4">
                  <button
                    onClick={goToPrevLesson}
                    disabled={
                      allLessons.findIndex((l) => l.id === currentLesson.id) ===
                      0
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-gold disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" /> Previous
                  </button>

                  <button
                    onClick={() => markComplete(currentLesson.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      progress[currentLesson.id]
                        ? "border border-green-500/20 bg-green-500/5 text-green-400"
                        : "bg-gold text-black hover:bg-gold-hover"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {progress[currentLesson.id] ? "Completed" : "Mark Complete"}
                  </button>

                  <button
                    onClick={goToNextLesson}
                    disabled={
                      allLessons.findIndex((l) => l.id === currentLesson.id) ===
                      allLessons.length - 1
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border-default)] px-4 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-gold disabled:opacity-30"
                  >
                    Next <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8">
              <p className="text-center text-sm text-[var(--color-text-secondary)]">
                No lessons available yet.
              </p>
            </GlassCard>
          )}
        </div>

        {/* Sidebar curriculum */}
        <div className={`${sidebarOpen ? "block" : "hidden"} lg:block`}>
          <GlassCard className="p-4">
            <h3 className="mb-3 font-display text-sm font-semibold text-[var(--color-text-primary)]">
              Course Content
            </h3>
            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {modules.map((mod, mIdx) => (
                <div key={mod.id}>
                  <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                    {mIdx + 1}. {mod.title}
                  </p>
                  {allLessons
                    .filter((l) => l.module_id === mod.id)
                    .map((lesson, lIdx) => (
                      <button
                        key={lesson.id}
                        onClick={() => goToLesson(lesson)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          currentLesson?.id === lesson.id
                            ? "bg-gold/10 text-gold"
                            : "text-[var(--color-text-secondary)] hover:bg-gold/5 hover:text-gold"
                        }`}
                      >
                        {progress[lesson.id] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                        <span className="flex-1 truncate">
                          {lIdx + 1}. {lesson.title}
                        </span>
                        {lesson.duration_minutes > 0 && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {lesson.duration_minutes}m
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Learning">
        <LearnContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
