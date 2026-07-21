"use client";

import { motion } from "framer-motion";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { WHY_CHOOSE_SKILLSTACK } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

export function WhySkillStack() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="why">
      <SectionHeading
        eyebrow={t("why.eyebrow")}
        title={t("why.title")}
        highlight={t("why.highlight")}
        subtitle={t("why.subtitle")}
      />

      <motion.div
        variants={staggerContainer}
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {WHY_CHOOSE_SKILLSTACK.map((item) => (
          <motion.div key={item.title} variants={staggerItem} {...hoverLift}>
            <GlassCard className="group flex h-full flex-col p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {item.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}