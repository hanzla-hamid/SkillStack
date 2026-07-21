'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, Download, BarChart3, Settings, Bell, TrendingUp, Shield, Database } from 'lucide-react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard, EmptyState } from '@/components/dashboard/StatCard';
import { GlassCard } from '@/components/shared';
import { supabase, type Profile } from '@/lib/supabase';

function AdminContent() {
  const [userCount, setUserCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminData() {
      const [usersRes, coursesRes, certificatesRes, enrollmentsRes, recentUsersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('certificates').select('id', { count: 'exact', head: true }),
        supabase.from('enrollments').select('id', { count: 'exact', head: true }),
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (cancelled) return;
      setUserCount(usersRes.count ?? 0);
      setCourseCount(coursesRes.count ?? 0);
      setCertificateCount(certificatesRes.count ?? 0);
      setEnrollmentCount(enrollmentsRes.count ?? 0);
      setRecentUsers((recentUsersRes.data ?? []) as Profile[]);
      setLoadingStats(false);
    }

    loadAdminData();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    { icon: Users, label: 'Registered Users', value: loadingStats ? '—' : userCount, delay: 0 },
    { icon: BookOpen, label: 'Total Courses', value: loadingStats ? '—' : courseCount, delay: 0.1 },
    { icon: Award, label: 'Certificates', value: loadingStats ? '—' : certificateCount, delay: 0.2 },
    { icon: TrendingUp, label: 'Enrollments', value: loadingStats ? '—' : enrollmentCount, delay: 0.3 },
  ];

  return (
    <div className="space-y-8">
      {/* System status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/10">
                <Shield className="h-7 w-7 text-gold" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">System Status</p>
                <p className="font-display text-xl font-bold text-[var(--color-text-primary)]">
                  All Systems Operational
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/5 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-400">Online</span>
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

      {/* User Management + Course Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">User Management</h2>
          <GlassCard className="p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{u.full_name || u.email}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                    </div>
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold">
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="No users yet"
                description="Registered users will appear here for management."
              />
            )}
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Course Management</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={BookOpen}
              title="Manage courses"
              description="Create, edit, and manage all platform courses."
              action={{ label: 'Manage Courses', href: '/admin/courses' }}
            />
          </GlassCard>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Recent Activity</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={BarChart3}
              title="No activity"
              description="System activity logs will appear here."
            />
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">Pending Tasks</h2>
          <GlassCard className="p-6">
            <EmptyState
              icon={Settings}
              title="No pending tasks"
              description="Administrative tasks will appear here."
            />
          </GlassCard>
        </div>
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">System Health</h2>
          <GlassCard className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Database</span>
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Storage</span>
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)]">Auth Service</span>
                <span className="flex items-center gap-1.5 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Healthy
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
      <DashboardLayout title="Admin Dashboard">
        <AdminContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}