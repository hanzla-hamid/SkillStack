"use client";

import { motion } from "framer-motion";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { SUCCESS_TIMELINE } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function SuccessTimeline() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="timeline">
      <SectionHeading
        eyebrow={t("timeline.eyebrow")}
        title={t("timeline.title")}
        highlight={t("timeline.highlight")}
        subtitle={t("timeline.subtitle")}
      />

      <motion.div variants={staggerContainer} className="mt-16 relative">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent sm:left-1/2 sm:-translate-x-1/2" />

        <div className="space-y-12">
          {SUCCESS_TIMELINE.map((item, index) => (
            <motion.div
              key={item.year}
              variants={staggerItem}
              className={`relative flex items-center gap-6 ${
                index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
              }`}
            >
              <div className="absolute left-4 top-1/2 z-10 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-gold bg-[var(--color-bg)] sm:left-1/2">
                <div className="h-1.5 w-1.5 rounded-full bg-gold" />
              </div>

              <div
                className={`ml-12 flex-1 sm:ml-0 sm:w-1/2 ${index % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}
              >
                <span className="inline-flex items-center rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
                  {item.year}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>
              <div className="hidden sm:block sm:w-1/2" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}