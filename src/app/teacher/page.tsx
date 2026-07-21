'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, ClipboardList, BarChart3, Plus, User } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard, EmptyState } from '@/components/dashboard/StatCard';
import { GlassCard } from '@/components/shared';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase, type Course } from '@/lib/supabase';

function TeacherContent() {
  const { user } = useAuth();
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      return;
    }

    let cancelled = false;
    const uid = user.id;

    async function loadTeacherData() {
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', uid)
        .order('created_at', { ascending: false });

      if (cancelled) return;
      const courseList = courses ?? [];
      const courseIds = courseList.map((c) => c.id);
      setMyCourses(courseList);

      if (courseIds.length === 0) {
        setStudentCount(0);
        setPendingCount(0);
        setCertificateCount(0);
        setLoadingStats(false);
        return;
      }

      const [enrollmentsRes, assignmentsRes, certificatesRes] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id', { count: 'exact', head: true })
          .in('course_id', courseIds),
        supabase.from('assignments').select('id').in('course_id', courseIds),
        supabase
          .from('certificates')
          .select('id', { count: 'exact', head: true })
          .in('course_id', courseIds),
      ]);

      if (cancelled) return;

      const assignmentIds = (assignmentsRes.data ?? []).map((a) => a.id);
      let pending = 0;
      if (assignmentIds.length > 0) {
        const { count } = await supabase
          .from('submissions')
          .select('id', { count: 'exact', head: true })
          .in('assignment_id', assignmentIds)
          .eq('status', 'pending');
        pending = count ?? 0;
      }

      if (cancelled) return;
      setStudentCount(enrollmentsRes.count ?? 0);
      setPendingCount(pending);
      setCertificateCount(certificatesRes.count ?? 0);
      setLoadingStats(false);
    }

    loadTeacherData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = [
    { icon: BookOpen, label: 'My Courses', value: loadingStats ? '—' : myCourses.length, delay: 0 },
    { icon: Users, label: 'Total Students', value: loadingStats ? '—' : studentCount, delay: 0.1 },
    { icon: ClipboardList, label: 'Pending Assignments', value: loadingStats ? '—' : pendingCount, delay: 0.2 },
    { icon: Award, label: 'Certificates Issued', value: loadingStats ? '—' : certificateCount, delay: 0.3 },
  ];

  return (
    <div className="space-y-8">
      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">Welcome back, Teacher!</h2>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage your courses, students, and assignments.</p>
            </div>
            <a
              href="/teacher/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-hover hover:shadow-glow-sm"
            >
              <Plus className="h-4 w-4" />
              Create Course
            </a>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* My Courses */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">My Courses</h2>
        {myCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myCourses.map((course) => (
              <a key={course.id} href={`/teacher/courses`} className="group block">
                <GlassCard className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-gold">
                      {course.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                        course.status === 'published'
                          ? 'bg-gold/10 text-gold'
                          : 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{course.category || 'Uncategorized'}</p>
                </GlassCard>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No courses created"
            description="Create your first course to start teaching."
            action={{ label: 'Create Course', href: '/teacher/courses' }}
          />
        )}
      </div>

      {/* Recent Students + Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Recent Students</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={User}
              title="No students enrolled"
              description="Students will appear here once they enroll in your courses."
            />
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Analytics</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={BarChart3}
              title="No analytics data"
              description="Course analytics will appear here once you have active students."
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['teacher', 'moderator', 'admin', 'super_admin']}>
      <DashboardLayout title="Teacher Dashboard">
        <TeacherContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}