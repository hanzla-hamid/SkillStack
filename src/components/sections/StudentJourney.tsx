"use client";

import { motion } from "framer-motion";
import { GraduationCap, Code2, Trophy, Briefcase } from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

const JOURNEY_STEPS = [
  {
    icon: GraduationCap,
    title: "Enroll",
    description: "Choose your path and join SkillStack academy.",
  },
  {
    icon: Code2,
    title: "Learn & Build",
    description: "Master skills through project-based learning and mentorship.",
  },
  {
    icon: Trophy,
    title: "Get Certified",
    description: "Earn a verifiable certificate with a unique ID and QR code.",
  },
  {
    icon: Briefcase,
    title: "Start Earning",
    description:
      "Use your skills to freelance, get a job, or start a business.",
  },
];

export function StudentJourney() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="journey">
      <SectionHeading
        eyebrow={t("journey.eyebrow")}
        title={t("journey.title")}
        highlight={t("journey.highlight")}
        subtitle={t("journey.subtitle")}
      />

      <motion.div variants={staggerContainer} className="mt-16 relative">
        <div className="absolute left-0 top-1/2 hidden h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent lg:block" />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              variants={staggerItem}
              className="relative"
            >
              <div className="group flex flex-col items-center text-center">
                <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gold/20 bg-[var(--color-surface-card)] transition-all duration-500 group-hover:border-gold/40 group-hover:shadow-glow-md">
                  <step.icon className="h-8 w-8 text-gold" />
                  <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border border-gold/30 bg-[var(--color-bg)] font-display text-xs font-bold text-gold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-[200px] text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}