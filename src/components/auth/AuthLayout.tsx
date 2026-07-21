"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { BRAND } from "@/lib/constants";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  backHref?: string;
  backLabel?: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Back to home",
}: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 grid-texture-fine radial-fade opacity-10" />
      <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 rounded-full bg-gold/8 blur-[120px] animate-glow-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-gold/5 blur-[80px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <Logo />
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl border border-[var(--color-border-default)] p-8 shadow-card">
          {children}
        </div>

        {/* Back link */}
        <div className="mt-6 flex justify-center">
          <Link
            href={backHref}
            className="group inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {backLabel}
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[var(--color-text-muted)]">
            {BRAND.organization}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {BRAND.developer}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
