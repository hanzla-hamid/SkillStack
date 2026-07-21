"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  color?: "gold" | "white";
}

const sizeMap = {
  sm: "h-40 w-40",
  md: "h-64 w-64",
  lg: "h-96 w-96",
  xl: "h-[500px] w-[500px]",
};

export function GlowOrb({
  className,
  size = "lg",
  color = "gold",
}: GlowOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.15, 0.3, 0.15],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn(
        "pointer-events-none absolute rounded-full blur-[100px]",
        sizeMap[size],
        color === "gold" ? "bg-gold/20" : "bg-white/5",
        className,
      )}
    />
  );
}
