"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionWrapper } from "@/components/shared";
import { STATS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

const STAT_KEYS = [
  "stats.students",
  "stats.programs",
  "stats.resources",
  "stats.satisfaction",
];

function CircularStat({
  value,
  suffix,
  labelKey,
  index,
  t,
}: {
  value: number;
  suffix: string;
  labelKey: string;
  index: number;
  t: (key: string) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    let frameId: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      setRingProgress(eased * 100);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
        setRingProgress(100);
      }
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [inView, value]);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (ringProgress / 100) * circumference;

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="group relative flex flex-col items-center text-center"
    >
      <div className="absolute inset-0 rounded-2xl bg-gold/5 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative h-32 w-32">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="var(--color-border-default)"
            strokeWidth="4"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
          <defs>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#FDE047" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
            {count}
            <span className="gold-gradient-text">{suffix}</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
        {t(labelKey)}
      </p>

      {index < STATS.length - 1 && (
        <div className="absolute right-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-gold/20 to-transparent lg:block" />
      )}
    </motion.div>
  );
}

export function Statistics() {
  const { t } = useLanguage();

  return (
    <SectionWrapper className="py-16 md:py-20">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 gap-8 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-surface)]/50 p-8 backdrop-blur-sm sm:p-12 lg:grid-cols-4 lg:gap-4"
      >
        {STATS.map((stat, index) => (
          <CircularStat
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            labelKey={STAT_KEYS[index]}
            index={index}
            t={t}
          />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}