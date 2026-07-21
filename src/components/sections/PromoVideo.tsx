"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Youtube } from "lucide-react";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

export function PromoVideo() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SectionWrapper id="promo-video">
      <SectionHeading
        eyebrow={t("video.eyebrow")}
        title={t("video.title")}
        highlight={t("video.highlight")}
        subtitle={t("video.subtitle")}
      />

      <motion.div variants={staggerContainer} className="mt-16">
        <motion.div variants={staggerItem} {...hoverLift}>
          <GlassCard className="group relative aspect-video overflow-hidden rounded-2xl">
            {/* Thumbnail background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)]" />
            <div className="absolute inset-0 grid-texture-fine opacity-10" />

            {/* Gold glow */}
            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[80px] transition-all duration-500 group-hover:bg-gold/20" />

            {/* Play button */}
            <button
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play promotional video"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold/30 bg-gold/10 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 group-hover:border-gold/50 group-hover:bg-gold/20 group-hover:shadow-glow-lg">
                <Play className="h-8 w-8 fill-gold text-gold transition-transform duration-300 group-hover:scale-110" />
              </div>
            </button>

            {/* Label */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  {t("video.placeholder")}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Academy tour, classes, and student projects
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-3 py-1.5 text-xs text-gold">
                <Youtube className="h-4 w-4" />
                YouTube
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Video modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-4xl px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute -top-12 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-gold"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="aspect-video overflow-hidden rounded-2xl border border-gold/20 bg-[var(--color-surface)]">
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                    <Play className="h-7 w-7 fill-gold text-gold" />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {t("video.placeholder")}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      Video content will be available soon. Stay tuned!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}