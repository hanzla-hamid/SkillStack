"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/shared";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  delay?: number;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
              {label}
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-[var(--color-text-primary)]">
              {value}
            </p>
            {trend && <p className="mt-1 text-xs text-gold">{trend}</p>}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
            <Icon className="h-5 w-5 text-gold" />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
        <Icon className="h-8 w-8 text-gold/50" />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        <p className="mt-1 max-w-sm text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
      </div>
      {action && (
        <a
          href={action.href}
          className="rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-all hover:bg-gold-hover hover:shadow-glow-sm"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
