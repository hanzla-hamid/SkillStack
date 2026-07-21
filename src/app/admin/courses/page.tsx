"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Loader2,
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/shared";
import { supabase, Course, Enrollment } from "@/lib/supabase";

function AdminCoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalEnrollments: 0,
  });
  const [enrollmentCounts, setEnrollmentCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });
    const courseList = (data as Course[]) || [];
    setCourses(courseList);

    const counts: Record<string, number> = {};
    let totalEnrollments = 0;
    for (const course of courseList) {
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", course.id);
      counts[course.id] = count || 0;
      totalEnrollments += count || 0;
    }
    setEnrollmentCounts(counts);

    setStats({
      total: courseList.length,
      published: courseList.filter((c) => c.status === "published").length,
      draft: courseList.filter((c) => c.status === "draft").length,
      totalEnrollments,
    });

    setLoading(false);
  };

  const toggleStatus = async (course: Course) => {
    const newStatus = course.status === "published" ? "draft" : "published";
    await supabase
      .from("courses")
      .update({ status: newStatus })
      .eq("id", course.id);
    fetchCourses();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "Total Courses",
            value: stats.total,
            icon: BookOpen,
            color: "text-gold",
          },
          {
            label: "Published",
            value: stats.published,
            icon: CheckCircle2,
            color: "text-green-400",
          },
          {
            label: "Drafts",
            value: stats.draft,
            icon: XCircle,
            color: "text-[var(--color-text-muted)]",
          },
          {
            label: "Enrollments",
            value: stats.totalEnrollments,
            icon: Users,
            color: "text-gold",
          },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-4" hover={false}>
              <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
              <p className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                {stat.value}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {stat.label}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Course list */}
      {courses.length === 0 ? (
        <GlassCard className="p-8" hover={false}>
          <div className="flex flex-col items-center gap-3 text-center">
            <BookOpen className="h-10 w-10 text-gold/30" />
            <p className="text-sm text-[var(--color-text-secondary)]">
              No courses in the system yet.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <GlassCard className="p-4" hover={false}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                        {course.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                          course.status === "published"
                            ? "border-green-500/20 bg-green-500/5 text-green-400"
                            : "border-gold/20 bg-gold/5 text-gold"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)]">
                      <span className="capitalize">{course.category_type}</span>
                      <span className="capitalize">{course.difficulty}</span>
                      <span>
                        {course.price === 0 ? "Free" : `Rs. ${course.price}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />{" "}
                        {enrollmentCounts[course.id] || 0} enrolled
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-[var(--color-border-default)] p-2 text-[var(--color-text-muted)] transition-colors hover:text-gold"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => toggleStatus(course)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        course.status === "published"
                          ? "border border-red-500/20 text-red-400 hover:bg-red-500/5"
                          : "bg-gold text-black hover:bg-gold-hover"
                      }`}
                    >
                      {course.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin", "super_admin"]}>
      <DashboardLayout title="Course Management">
        <AdminCoursesContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}