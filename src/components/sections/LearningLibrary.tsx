"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { LEARNING_LIBRARY } from "@/lib/constants";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

export function LearningLibrary() {
  return (
    <SectionWrapper id="library">
      <SectionHeading
        eyebrow="Free Learning Library"
        title="Curated Resources for"
        highlight="Self-Paced Learning"
        subtitle="Explore our free collection of curated learning resources. Start learning today with no commitment required."
      />

      <motion.div
        variants={staggerContainer}
        className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
      >
        {LEARNING_LIBRARY.map((resource) => (
          <motion.div
            key={resource.title}
            variants={staggerItem}
            {...hoverLift}
          >
            <GlassCard className="group flex h-full flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                  <resource.icon className="h-5 w-5 text-gold" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--color-text-secondary)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-gold" />
              </div>

              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                {resource.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {resource.description}
              </p>

              <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                {resource.category}
              </span>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={staggerItem} className="mt-12 flex justify-center">
        <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-6 py-3 text-sm text-[var(--color-text-secondary)]">
          <Sparkles className="h-4 w-4 text-gold" />
          <span>All resources are 100% free. No sign-up required.</span>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}