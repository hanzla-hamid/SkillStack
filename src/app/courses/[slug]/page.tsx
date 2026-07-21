"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Clock,
  Gauge,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Loader2,
  Award,
  Download,
  Users,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  SectionWrapper,
  GlassCard,
  GoldButton,
  OutlineButton,
} from "@/components/shared";
import { supabase, Course, Module, Lesson, Enrollment } from "@/lib/supabase";
import { useAuth } from "@/components/providers/AuthProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (user && course) {
      fetchEnrollment();
    }
  }, [user, course]);

  const fetchCourse = async () => {
    setLoading(true);
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (courseError || !courseData) {
      setLoading(false);
      return;
    }

    setCourse(courseData as Course);

    const { data: moduleData } = await supabase
      .from("modules")
      .select("*")
      .eq("course_id", courseData.id)
      .order("sort_order", { ascending: true });

    if (moduleData) {
      setModules(moduleData as Module[]);
      const lessonMap: Record<string, Lesson[]> = {};
      for (const mod of moduleData) {
        const { data: lessonData } = await supabase
          .from("lessons")
          .select("*")
          .eq("module_id", mod.id)
          .order("sort_order", { ascending: true });
        lessonMap[mod.id] = (lessonData as Lesson[]) || [];
      }
      setLessons(lessonMap);
      if (moduleData.length > 0) setExpandedModule(moduleData[0].id);
    }

    setLoading(false);
  };

  const fetchEnrollment = async () => {
    if (!user || !course) return;
    const { data } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();
    setEnrollment(data as Enrollment | null);
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!course) return;

    setEnrolling(true);
    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: course.id,
        status: "active",
      })
      .select()
      .single();

    if (!error && data) {
      setEnrollment(data as Enrollment);
    }
    setEnrolling(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <BookOpen className="h-12 w-12 text-gold/50" />
        <h1 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
          Course not found
        </h1>
        <a href="/courses" className="text-sm text-gold hover:text-gold-hover">
          Browse all courses
        </a>
      </div>
    );
  }

  const totalLessons = Object.values(lessons).reduce(
    (sum, ls) => sum + ls.length,
    0,
  );

  return (
    <div className="relative min-h-screen">
      <Navbar />

      {/* Hero section */}
      <section className="relative overflow-hidden pt-32 pb-12">
        <div className="absolute inset-0 grid-texture-fine radial-fade opacity-10" />
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-gold/8 blur-[100px]" />

        <SectionWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
          >
            <div className="lg:col-span-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium capitalize text-gold">
                <Sparkles className="h-3 w-3" />
                {course.category_type} · {course.difficulty}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold text-[var(--color-text-primary)] sm:text-4xl">
                {course.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">
                {course.long_description || course.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                {course.duration && (
                  <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                    <Clock className="h-4 w-4 text-gold" /> {course.duration}
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <BookOpen className="h-4 w-4 text-gold" /> {modules.length}{" "}
                  modules · {totalLessons} lessons
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <Gauge className="h-4 w-4 text-gold" /> {course.difficulty}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <Award className="h-4 w-4 text-gold" /> Certificate included
                </span>
              </div>
            </div>

            {/* Enrollment card */}
            <div>
              <GlassCard className="p-6">
                {course.thumbnail_url ? (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="mb-4 flex aspect-video items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)]">
                    <BookOpen className="h-12 w-12 text-gold/30" />
                  </div>
                )}

                {enrollment ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-sm text-green-400">
                      <CheckCircle2 className="h-4 w-4" /> Enrolled
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                    <p className="text-center text-xs text-[var(--color-text-secondary)]">
                      {enrollment.progress_percentage}% complete
                    </p>
                    <GoldButton
                      className="w-full"
                      onClick={() =>
                        router.push(`/courses/${course.slug}/learn`)
                      }
                    >
                      Continue Learning <ArrowRight className="h-4 w-4" />
                    </GoldButton>
                  </div>
                ) : (
                  <>
                    <p className="mb-1 font-display text-2xl font-bold text-[var(--color-text-primary)]">
                      {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                    </p>
                    <p className="mb-4 text-xs text-[var(--color-text-muted)]">
                      Full access · Certificate included
                    </p>
                    <GoldButton
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Enroll Now"
                      )}
                    </GoldButton>
                    {!user && (
                      <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">
                        Sign in to enroll
                      </p>
                    )}
                  </>
                )}
              </GlassCard>
            </div>
          </motion.div>
        </SectionWrapper>
      </section>

      {/* Curriculum */}
      <SectionWrapper className="pb-20">
        <h2 className="mb-6 font-display text-xl font-semibold text-[var(--color-text-primary)]">
          Course Curriculum
        </h2>

        {modules.length === 0 ? (
          <GlassCard className="p-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <BookOpen className="h-10 w-10 text-gold/30" />
              <p className="text-sm text-[var(--color-text-secondary)]">
                Curriculum details will be available soon.
              </p>
            </div>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {modules.map((mod, index) => (
              <div
                key={mod.id}
                className="overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/50"
              >
                <button
                  onClick={() =>
                    setExpandedModule(expandedModule === mod.id ? null : mod.id)
                  }
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-gold/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 bg-gold/5 font-display text-sm font-bold text-gold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {lessons[mod.id]?.length || 0} lessons
                      </p>
                    </div>
                  </div>
                  {expandedModule === mod.id ? (
                    <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-[var(--color-text-muted)]" />
                  )}
                </button>
                {expandedModule === mod.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-[var(--color-border-default)]"
                  >
                    {(lessons[mod.id] || []).map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gold/5"
                      >
                        {lesson.is_preview || enrollment ? (
                          <Play className="h-4 w-4 text-gold" />
                        ) : (
                          <Lock className="h-4 w-4 text-[var(--color-text-muted)]" />
                        )}
                        <span className="text-sm text-[var(--color-text-secondary)]">
                          {lIdx + 1}.
                        </span>
                        <span className="flex-1 text-sm text-[var(--color-text-primary)]">
                          {lesson.title}
                        </span>
                        {lesson.duration_minutes > 0 && (
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {lesson.duration_minutes} min
                          </span>
                        )}
                        {lesson.is_preview && !enrollment && (
                          <span className="rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[10px] text-gold">
                            Preview
                          </span>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        )}
      </SectionWrapper>

      <Footer />
    </div>
  );
}
