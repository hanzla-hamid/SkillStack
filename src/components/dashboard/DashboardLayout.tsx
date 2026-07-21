"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Download,
  Bookmark,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Trophy,
  Home,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Logo } from "@/components/layout/Logo";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

const STUDENT_NAV: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Continue Learning", icon: BookOpen, href: "/dashboard/continue" },
  { label: "My Courses", icon: BookOpen, href: "/dashboard/courses" },
  { label: "Certificates", icon: Award, href: "/dashboard/certificates" },
  { label: "Downloads", icon: Download, href: "/dashboard/downloads" },
  { label: "Bookmarks", icon: Bookmark, href: "/dashboard/bookmarks" },
  { label: "Achievements", icon: Trophy, href: "/dashboard/achievements" },
  { label: "Notifications", icon: Bell, href: "/dashboard/notifications" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

const TEACHER_NAV: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/teacher" },
  { label: "My Courses", icon: BookOpen, href: "/teacher/courses" },
  { label: "Students", icon: User, href: "/teacher/students" },
  { label: "Assignments", icon: BookOpen, href: "/teacher/assignments" },
  { label: "Certificates", icon: Award, href: "/teacher/certificates" },
  { label: "Profile", icon: User, href: "/teacher/profile" },
  { label: "Settings", icon: Settings, href: "/teacher/settings" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin" },
  { label: "Users", icon: User, href: "/admin/users" },
  { label: "Courses", icon: BookOpen, href: "/admin/courses" },
  { label: "Certificates", icon: Award, href: "/admin/certificates" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

function getNavForRole(role: string): NavItem[] {
  if (role === "admin" || role === "super_admin") return ADMIN_NAV;
  if (role === "teacher" || role === "moderator") return TEACHER_NAV;
  return STUDENT_NAV;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const router = useRouter();
  const { profile, role, signOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = getNavForRole(role);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
          <p className="text-sm text-[var(--color-text-secondary)]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--color-border-default)] bg-[var(--color-surface)]/80 px-4 py-3 backdrop-blur-lg md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:text-gold md:hidden"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <Logo scrolled />
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:text-gold"
            aria-label="Back to home"
          >
            <Home className="h-4 w-4" />
          </Link>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:text-gold"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-bold text-gold">
              {profile?.full_name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {profile?.full_name || "User"}
              </p>
              <p className="text-xs capitalize text-[var(--color-text-muted)]">
                {role}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] transition-colors hover:text-red-400"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
            />
          )}
        </AnimatePresence>

        <aside
          className={`fixed left-0 top-[57px] z-30 h-[calc(100vh-57px)] w-64 border-r border-[var(--color-border-default)] bg-[var(--color-surface)] transition-transform duration-300 md:sticky md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4">
            <div className="mb-2 px-3 py-2">
              <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                {role === "admin" || role === "super_admin"
                  ? "Admin Panel"
                  : role === "teacher" || role === "moderator"
                    ? "Teacher Panel"
                    : "Student Panel"}
              </h2>
            </div>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-all hover:bg-gold/5 hover:text-gold"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                <ChevronRight className="ml-auto h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50" />
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="mb-6 font-display text-2xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h1>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
