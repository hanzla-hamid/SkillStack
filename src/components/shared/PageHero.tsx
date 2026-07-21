"use client";

import { motion } from "framer-motion";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}

export function PageHero({
  eyebrow,
  title,
  highlight,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden pt-28 pb-16">
      <div className="absolute inset-0 grid-texture-fine radial-fade opacity-20" />
      <GlowOrb size="lg" className="left-1/4 top-1/4" />
      <GlowOrb size="md" className="right-1/4 bottom-1/4" color="white" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center sm:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-5"
        >
          <motion.span
            variants={staggerItem}
            className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            {eyebrow}
          </motion.span>

          <motion.h1
            variants={staggerItem}
            className="font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl"
          >
            {title}{" "}
            {highlight && (
              <span className="gold-gradient-text">{highlight}</span>
            )}
          </motion.h1>

          {subtitle && (
            <motion.p
              variants={staggerItem}
              className="max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg"
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
