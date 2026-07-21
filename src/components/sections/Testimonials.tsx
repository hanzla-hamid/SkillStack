"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { TESTIMONIALS } from "@/lib/constants";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(TESTIMONIALS.length / itemsPerPage);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, totalPages]);

  if (TESTIMONIALS.length === 0) return null;

  const currentItems = TESTIMONIALS.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage,
  );

  return (
    <SectionWrapper id="testimonials">
      <SectionHeading
        eyebrow="Student Testimonials"
        title="Stories of"
        highlight="Real Success"
        subtitle="Hear from students who transformed their careers through SkillStack."
      />

      <div
        className="relative mt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >
            {currentItems.map((testimonial) => (
              <motion.div
                key={testimonial.name}
                variants={staggerItem}
                {...hoverLift}
              >
                <GlassCard className="group relative flex h-full flex-col overflow-hidden p-6">
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/5 blur-2xl transition-opacity duration-500 group-hover:bg-gold/10" />

                  <Quote className="h-8 w-8 text-gold/30 transition-colors duration-500 group-hover:text-gold/50" />

                  <div className="mt-4 flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                  </div>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    &ldquo;{testimonial.review}&rdquo;
                  </p>

                  <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-border-default)] pt-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 font-display text-sm font-bold text-gold">
                      {getInitials(testimonial.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                        {testimonial.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium text-gold">
                    {testimonial.course}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <>
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-8 bg-gold"
                      : "w-2 bg-[var(--color-border-default)] hover:bg-gold/40"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={prevSlide}
              aria-label="Previous testimonials"
              className="absolute -left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)]/80 text-[var(--color-text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:text-gold md:flex"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next testimonials"
              className="absolute -right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)]/80 text-[var(--color-text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:text-gold md:flex"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
