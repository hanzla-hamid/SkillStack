"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { LEARNING_LIBRARY } from "@/lib/constants";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Programming",
  "Creative",
  "Technology",
  "Business",
  "Career",
  "Marketing",
];

export function LearningLibraryGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return LEARNING_LIBRARY;
    return LEARNING_LIBRARY.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
              activeCategory === cat
                ? "bg-gold text-black"
                : "border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] hover:border-gold/30 hover:text-[var(--color-text-primary)]",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((resource) => (
            <motion.div
              key={resource.title}
              layout
              variants={staggerItem}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              {...hoverLift}
            >
              <GlassCard className="group flex h-full flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                    <resource.icon className="h-5 w-5 text-gold" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[var(--color-text-secondary)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-gold" />
                </div>

                <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                  {resource.title}
                </h3>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {resource.description}
                </p>

                <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {resource.category}
                </span>
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-center">
        <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-6 py-3 text-sm text-[var(--color-text-secondary)]">
          <BookOpen className="h-4 w-4 text-gold" />
          <span>All resources are 100% free. No sign-up required.</span>
        </div>
      </div>
    </div>
  );
}