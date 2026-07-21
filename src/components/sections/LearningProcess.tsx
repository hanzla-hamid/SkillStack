"use client";

import { motion } from "framer-motion";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { LEARNING_PROCESS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function LearningProcess() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="process">
      <SectionHeading
        eyebrow={t("process.eyebrow")}
        title={t("process.title")}
        highlight={t("process.highlight")}
        subtitle={t("process.subtitle")}
      />

      <motion.div
        variants={staggerContainer}
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
      >
        {LEARNING_PROCESS.map((step, index) => (
          <motion.div
            key={step.step}
            variants={staggerItem}
            className="relative"
          >
            <div className="group flex flex-col items-center text-center">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-md">
                <span className="font-display text-xl font-bold text-gold">
                  {step.step}
                </span>
                <div
                  className="absolute inset-0 rounded-2xl border border-gold/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ transform: "scale(1.2)" }}
                />
              </div>
              <h3 className="font-display text-sm font-semibold text-[var(--color-text-primary)]">
                {step.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {step.description}
              </p>
            </div>
            {index < LEARNING_PROCESS.length - 1 && (
              <div
                className="absolute right-0 top-8 hidden h-px w-full bg-gradient-to-r from-gold/20 to-transparent lg:block"
                style={{ left: "50%" }}
              />
            )}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}