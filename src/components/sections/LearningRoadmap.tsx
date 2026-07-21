"use client";

import { motion } from "framer-motion";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { LEARNING_ROADMAP } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function LearningRoadmap() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="roadmap">
      <SectionHeading
        eyebrow={t("roadmap.eyebrow")}
        title={t("roadmap.title")}
        highlight={t("roadmap.highlight")}
        subtitle={t("roadmap.subtitle")}
      />

      <motion.div
        variants={staggerContainer}
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {LEARNING_ROADMAP.map((item, index) => (
          <motion.div key={item.phase} variants={staggerItem}>
            <GlassCard className="group relative flex h-full flex-col p-6">
              <div className="absolute right-4 top-4 font-display text-3xl font-bold text-gold/10 transition-all duration-500 group-hover:text-gold/20">
                0{index + 1}
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-gold">
                {item.phase}
              </span>
              <h3 className="mt-2 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.description}
              </p>
              {index < LEARNING_ROADMAP.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-gold/20 to-transparent lg:block" />
              )}
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}