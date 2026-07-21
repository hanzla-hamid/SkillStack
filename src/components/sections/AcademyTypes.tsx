"use client";

import { motion } from "framer-motion";
import { MapPin, Monitor, Wifi, Users, Building2 } from "lucide-react";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { BRAND } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

export function AcademyTypes() {
  const { t } = useLanguage();

  return (
    <SectionWrapper id="academies">
      <SectionHeading
        eyebrow=""
        title="Physical Academy &"
        highlight="Online Platform"
        subtitle="Two ways to learn. One destination for career-ready skills."
      />

      <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={staggerContainer}>
          <motion.div variants={staggerItem} {...hoverLift}>
            <GlassCard className="group flex h-full flex-col p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                <Building2 className="h-7 w-7 text-gold" />
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-gold">
                {t("physical.eyebrow")}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[var(--color-text-primary)]">
                {t("physical.title")}{" "}
                <span className="gold-gradient-text">
                  {t("physical.highlight")}
                </span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("physical.subtitle")}
              </p>
              <div className="mt-6 space-y-3 border-t border-[var(--color-border-default)] pt-6">
                <div className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>{BRAND.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Users className="h-4 w-4 shrink-0 text-gold" />
                  <span>In-person mentorship and collaboration</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Building2 className="h-4 w-4 shrink-0 text-gold" />
                  <span>Modern classroom environment</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer}>
          <motion.div variants={staggerItem} {...hoverLift}>
            <GlassCard className="group flex h-full flex-col p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                <Monitor className="h-7 w-7 text-gold" />
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-gold">
                {t("online.eyebrow")}
              </span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[var(--color-text-primary)]">
                {t("online.title")}{" "}
                <span className="gold-gradient-text">
                  {t("online.highlight")}
                </span>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {t("online.subtitle")}
              </p>
              <div className="mt-6 space-y-3 border-t border-[var(--color-border-default)] pt-6">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Wifi className="h-4 w-4 shrink-0 text-gold" />
                  <span>Learn at your own pace, anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Monitor className="h-4 w-4 shrink-0 text-gold" />
                  <span>Structured online resources</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Users className="h-4 w-4 shrink-0 text-gold" />
                  <span>Community support and discussions</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}