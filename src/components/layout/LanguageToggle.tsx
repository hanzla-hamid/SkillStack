"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="relative flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-3 text-xs font-semibold text-[var(--color-text-secondary)] transition-all duration-300 hover:border-gold/40 hover:text-gold"
      aria-label="Toggle language"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={lang}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.2 }}
          className={lang === "ur" ? "font-urdu" : ""}
        >
          {lang === "en" ? "EN" : "اردو"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
