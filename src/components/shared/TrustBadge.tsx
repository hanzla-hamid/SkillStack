"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerItem } from "@/lib/animations";

interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function TrustBadge({ icon, label, className }: TrustBadgeProps) {
  return (
    <motion.div
      variants={staggerItem}
      className={cn(
        "flex items-center gap-2 text-sm text-[var(--color-text-secondary)]",
        className,
      )}
    >
      <span className="flex h-5 w-5 items-center justify-center text-gold">
        {icon}
      </span>
      <span>{label}</span>
    </motion.div>
  );
}
