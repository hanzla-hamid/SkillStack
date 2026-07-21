"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  MessageCircle,
  Rocket,
  Star,
} from "lucide-react";
import {
  SectionHeading,
  SectionWrapper,
  GlassCard,
  GoldButton,
  OutlineButton,
} from "@/components/shared";
import { BRAND } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

const PERKS = [
  {
    icon: Rocket,
    title: "Be First",
    description:
      "Join as a founding learner and be part of the first generation of SkillStack.",
  },
  {
    icon: Star,
    title: "Shape the Future",
    description:
      "Your feedback and journey will help shape SkillStack for future students.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Access",
    description:
      "Get early access to new courses, resources, and community features.",
  },
];

export function FoundingLearners() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="founding-learners">
      <SectionHeading
        eyebrow={t("founding.eyebrow")}
        title={t("founding.title")}
        highlight={t("founding.highlight")}
        subtitle={t("founding.subtitle")}
      />

      <motion.div
        variants={staggerContainer}
        className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
      >
        {PERKS.map((perk) => (
          <motion.div key={perk.title} variants={staggerItem} {...hoverLift}>
            <GlassCard className="group flex h-full flex-col items-center p-8 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                <perk.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                {perk.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {perk.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={staggerContainer}
        className="mt-12 flex flex-col items-center justify-center gap-4"
      >
        <motion.div
          variants={staggerItem}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <GoldButton
            onClick={() =>
              window.open("https://skillstack.com/register", "_self")
            }
          >
            {t("founding.cta")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </GoldButton>
          <OutlineButton
            onClick={() => window.open(BRAND.social.whatsapp, "_blank")}
          >
            <MessageCircle className="h-4 w-4 text-gold" />
            {t("founding.whatsapp")}
          </OutlineButton>
        </motion.div>
      </motion.div>
    </SectionWrapper>
  );
}