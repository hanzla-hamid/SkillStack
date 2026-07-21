'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Award, Download, Bookmark, Trophy, Flame, TrendingUp, Bell, Clock, ArrowRight, Zap } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard, EmptyState } from '@/components/dashboard/StatCard';
import { GlassCard } from '@/components/shared';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase, type Course } from '@/lib/supabase';

interface ActiveEnrollment {
  id: string;
  progress_percentage: number;
  course: Course;
}

function DashboardContent() {
  const { profile, user } = useAuth();
  const [courseCount, setCourseCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [activeCourses, setActiveCourses] = useState<ActiveEnrollment[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoadingStats(false);
      return;
    }

    let cancelled = false;
    const uid = user.id;

    async function loadDashboardData() {
      const [enrollmentsRes, certificatesRes] = await Promise.all([
        supabase
          .from('enrollments')
          .select('id, progress_percentage, course:courses(*)')
          .eq('user_id', uid)
          .eq('status', 'active')
          .order('enrolled_at', { ascending: false }),
        supabase
          .from('certificates')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', uid),
      ]);

      if (cancelled) return;

      const enrollments = (enrollmentsRes.data ?? []) as unknown as ActiveEnrollment[];
      setCourseCount(enrollments.length);
      setActiveCourses(enrollments.slice(0, 3));
      setCertificateCount(certificatesRes.count ?? 0);
      setLoadingStats(false);
    }

    loadDashboardData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = [
    { icon: BookOpen, label: 'Current Courses', value: loadingStats ? '—' : courseCount, delay: 0 },
    { icon: Award, label: 'Certificates', value: loadingStats ? '—' : certificateCount, delay: 0 },
    { icon: Download, label: 'Downloads', value: 0, delay: 0 },
    { icon: Bookmark, label: 'Bookmarks', value: 0, delay: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* XP & Level banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <GlassCard className="overflow-hidden p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                <Zap className="h-7 w-7 text-gold" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">Your Progress</p>
                <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                  Level {profile?.level || 1} · {profile?.xp || 0} XP
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gold/20 bg-gold/5 px-4 py-2">
              <Flame className="h-5 w-5 text-gold" />
              <span className="text-sm font-medium text-gold">0 day streak</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
              <span>Level {profile?.level || 1}</span>
              <span>Next: Level {(profile?.level || 1) + 1}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500"
                style={{ width: `${((profile?.xp || 0) % 100)}%` }}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Continue Learning */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Continue Learning</h2>
        {activeCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeCourses.map((enrollment) => (
              <a
                key={enrollment.id}
                href={`/courses/${enrollment.course.slug}/learn`}
                className="group block"
              >
                <GlassCard className="overflow-hidden p-0 transition-all duration-300 hover:border-gold/30">
                  <div className="aspect-video w-full bg-[var(--color-surface)]">
                    {enrollment.course.thumbnail_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={enrollment.course.thumbnail_url}
                        alt={enrollment.course.title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-gold">
                      {enrollment.course.title}
                    </h3>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface)]">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${enrollment.progress_percentage}%` }}
                      />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      {enrollment.progress_percentage}% complete
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </GlassCard>
              </a>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No courses yet"
            description="Enroll in a course to start your learning journey."
            action={{ label: 'Browse Courses', href: '/courses' }}
          />
        )}
      </div>

      {/* Recent Activity + Leaderboard */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={TrendingUp}
              title="No activity yet"
              description="Your learning activity will appear here."
            />
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Leaderboard</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={Trophy}
              title="No rankings yet"
              description="Complete courses and earn XP to climb the leaderboard."
            />
          </GlassCard>
        </div>
      </div>

      {/* Upcoming Events + Notifications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Upcoming Events</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={Clock}
              title="No upcoming events"
              description="Events and workshops will appear here."
            />
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Recent Notifications</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout title="Dashboard Overview">
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}