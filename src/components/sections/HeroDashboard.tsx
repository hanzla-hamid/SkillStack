"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  BarChart3,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { supabase, type Course } from "@/lib/supabase";

interface Enrollment {
  id: string;
  progress_percentage: number;
  course: Course;
}

function DashboardCard({
  children,
  className,
  delay = 0,
  depth,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  depth: MotionValue<number>;
}) {
  const rotateX = useTransform(depth, [0, 1], [4, -4]);
  const rotateY = useTransform(depth, [0, 1], [-6, 6]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="glass-card rounded-2xl p-4"
    >
      {children}
    </motion.div>
  );
}

export function HeroDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("id, progress_percentage, course:courses(*)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .order("enrolled_at", { ascending: false })
        .limit(2);
      if (!cancelled && data) {
        setEnrollments(data as unknown as Enrollment[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [0, 1], [8, -8]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const weeklyActivity = user
    ? enrollments.length > 0
      ? [40, 65, 50, 80, 60, 90]
      : [0, 0, 0, 0, 0, 0]
    : [0, 0, 0, 0, 0, 0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      <div className="absolute -inset-8 rounded-full bg-gold/8 blur-[80px] animate-glow-pulse" />

      <motion.div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative grid grid-cols-2 gap-3"
      >
        <DashboardCard depth={springX} className="col-span-2" delay={0.05}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                My Courses
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-[var(--color-text-secondary)]" />
          </div>
          <div className="mt-4 space-y-3">
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <div key={enrollment.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--color-text-primary)]/80">
                      {enrollment.course.title}
                    </span>
                    <span className="font-medium text-gold">
                      {enrollment.progress_percentage}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-border-default)]">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2 text-center">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {user
                    ? "Not enrolled in any course yet"
                    : "Sign in to track your progress"}
                </p>
                <div className="mt-2 space-y-2">
                  {[0, 0].map((_, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--color-text-muted)]">
                          —
                        </span>
                        <span className="font-medium text-[var(--color-text-muted)]">
                          0%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--color-border-default)]">
                        <div className="h-full w-0 rounded-full bg-gold" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard depth={springX} delay={0.1}>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              Learning Progress
            </span>
          </div>
          <div className="mt-3 flex items-end gap-1.5">
            {weeklyActivity.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-gold/40 to-gold"
                style={{ height: `${h}%`, minHeight: "2px" }}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
            Weekly Activity
          </p>
        </DashboardCard>

        <DashboardCard depth={springX} delay={0.15}>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              Certificates
            </span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-2 py-1.5">
              <Award className="h-3 w-3 text-gold" />
              <span className="text-xs text-[var(--color-text-muted)]">
                No certificates yet
              </span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard depth={springX} className="col-span-2" delay={0.2}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                Upcoming Classes
              </span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-center rounded-lg bg-[var(--color-surface-card)] px-3 py-3">
              <p className="text-xs text-[var(--color-text-muted)]">
                No upcoming classes
              </p>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard depth={springX} className="col-span-2" delay={0.25}>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-gold" />
            <span className="text-xs font-semibold text-[var(--color-text-primary)]">
              Recent Achievements
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-3 py-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gold/10">
                <Trophy className="h-3.5 w-3.5 text-gold/50" />
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                No achievements yet
              </span>
            </div>
          </div>
        </DashboardCard>
      </motion.div>
    </motion.div>
  );
}
