"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { GoldButton, OutlineButton } from "@/components/shared";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function FinalCTA() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <section
      id="enroll"
      className="relative w-full overflow-hidden px-6 py-28 sm:px-8 md:py-36 lg:px-12"
    >
      <div className="absolute inset-0 grid-texture-fine radial-fade opacity-20" />
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[120px] animate-glow-pulse" />
      <div
        className="absolute left-1/4 top-1/3 h-64 w-64 rounded-full bg-gold/5 blur-[80px] animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-gold/5 blur-[80px] animate-glow-pulse"
        style={{ animationDelay: "4s" }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.span
          variants={staggerItem}
          className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          {t("cta.badge")}
        </motion.span>

        <motion.h2
          variants={staggerItem}
          className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl"
        >
          {t("cta.title")}{" "}
          <span className="gold-gradient-text">{t("cta.highlight")}</span>
        </motion.h2>

        <motion.p
          variants={staggerItem}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg"
        >
          {t("cta.description")}
        </motion.p>

        <motion.div
          variants={staggerItem}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <GoldButton onClick={() => router.push("/contact")}>
            {t("cta.enroll")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </GoldButton>
          <OutlineButton onClick={() => router.push("/courses")}>
            <BookOpen className="h-4 w-4 text-gold" />
            {t("cta.explore")}
          </OutlineButton>
        </motion.div>
      </motion.div>
    </section>
  );
}