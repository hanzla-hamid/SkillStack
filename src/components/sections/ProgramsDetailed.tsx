"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Gauge, FolderGit2, Check } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GoldButton } from "@/components/shared/GoldButton";
import { PROGRAMS, type Program } from "@/lib/constants";
import {
  staggerContainer,
  staggerItem,
  hoverLift,
  EASE_PREMIUM,
} from "@/lib/animations";

export function ProgramsDetailed() {
  const [selected, setSelected] = useState<Program>(PROGRAMS[0]);
  const router = useRouter();

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROGRAMS.map((program) => (
          <button
            key={program.title}
            onClick={() => setSelected(program)}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                selected.title === program.title
                  ? "border-gold/40 bg-gold/5 shadow-glow-sm"
                  : "border-[var(--color-border-default)] bg-[var(--color-surface-card)]/40 hover:border-gold/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/5">
                  <program.icon className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                    {program.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {program.duration}
                  </p>
                </div>
              </div>
            </motion.div>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM }}
        >
          <GlassCard hover={false} className="overflow-hidden p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5">
                    <selected.icon className="h-8 w-8 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                      {selected.title}
                    </h2>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {selected.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] p-3">
                    <Clock className="h-4 w-4 text-gold" />
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      Duration
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {selected.duration}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] p-3">
                    <Gauge className="h-4 w-4 text-gold" />
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      Level
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {selected.difficulty}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] p-3">
                    <FolderGit2 className="h-4 w-4 text-gold" />
                    <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                      Projects
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {selected.projects}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
                    What You&apos;ll Learn
                  </h4>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {selected.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]/80"
                      >
                        <Check className="h-4 w-4 text-gold" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <GoldButton onClick={() => router.push("/contact")}>
                    Enroll in {selected.title}
                    <ArrowRight className="h-4 w-4" />
                  </GoldButton>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gold">
                  Curriculum
                </h4>
                <div className="mt-4 space-y-3">
                  {selected.curriculum.map((mod, i) => (
                    <motion.div
                      key={mod.module}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)] p-4"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                          {i + 1}
                        </span>
                        <h5 className="text-sm font-semibold text-[var(--color-text-primary)]">
                          {mod.module}
                        </h5>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {mod.topics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-full border border-[var(--color-border-default)] bg-[var(--color-bg)]/30 px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}