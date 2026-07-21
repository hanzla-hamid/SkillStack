"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, X, ZoomIn } from "lucide-react";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { GALLERY_ITEMS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

const CATEGORIES = [
  "All",
  "Academy",
  "Classes",
  "Workshops",
  "Projects",
  "Events",
];

export function GalleryPreview() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <SectionWrapper id="gallery">
      <SectionHeading
        eyebrow={t("gallery.eyebrow")}
        title={t("gallery.title")}
        highlight={t("gallery.highlight")}
        subtitle={t("gallery.subtitle")}
      />

      {/* Category filters */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300 ${
              activeCategory === category
                ? "border-gold/40 bg-gold/10 text-gold"
                : "border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-gold/20 hover:text-gold"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.title}
            variants={staggerItem}
            {...hoverLift}
            onClick={() => setLightboxIndex(index)}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)]">
              <ImageIcon className="h-8 w-8 text-gold/30 transition-all duration-500 group-hover:scale-110 group-hover:text-gold/50" />
              <span className="px-2 text-center text-xs text-[var(--color-text-muted)]">
                {item.title}
              </span>
            </div>
            <div className="absolute inset-0 bg-gold/0 transition-all duration-300 group-hover:bg-gold/5" />
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg border border-gold/20 bg-[var(--color-bg)]/80 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
              <ZoomIn className="h-3.5 w-3.5 text-gold" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxIndex(null)}
                className="absolute -top-12 right-6 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition-colors hover:text-gold"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5" />
              </button>
              <GlassCard className="flex aspect-video flex-col items-center justify-center gap-4 p-8">
                <ImageIcon className="h-12 w-12 text-gold/30" />
                <div className="text-center">
                  <p className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                    {filteredItems[lightboxIndex].title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Photos will be available soon.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  );
}