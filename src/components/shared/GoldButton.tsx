"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
}

export const GoldButton = React.forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, children, onMouseEnter, ...props }, ref) => {
    const [bursts, setBursts] = React.useState<BurstParticle[]>([]);
    const particleId = useRef(0);

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      const newParticles: BurstParticle[] = Array.from(
        { length: 10 },
        (_, i) => ({
          id: particleId.current++,
          angle: (i / 10) * Math.PI * 2,
          distance: 30 + Math.random() * 20,
        }),
      );
      setBursts(newParticles);
      setTimeout(() => setBursts([]), 600);
      onMouseEnter?.(e);
    };

    return (
      <button
        ref={ref}
        onMouseEnter={handleMouseEnter}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-visible rounded-lg bg-gold px-7 py-3 text-sm font-semibold text-black transition-all duration-300",
          "hover:bg-gold-hover hover:shadow-glow-md active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]",
          className,
        )}
        {...props}
      >
        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        <AnimatePresence>
          {bursts.map((p) => {
            const x = Math.cos(p.angle) * p.distance;
            const y = Math.sin(p.angle) * p.distance;
            return (
              <motion.span
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
                animate={{ x, y, opacity: 0, scale: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold"
                style={{ marginLeft: "-3px", marginTop: "-3px" }}
              />
            );
          })}
        </AnimatePresence>
      </button>
    );
  },
);
GoldButton.displayName = "GoldButton";
