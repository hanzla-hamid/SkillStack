"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  UserPlus,
  BookOpen,
  Hammer,
  BadgeCheck,
  DollarSign,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface TimelineStep {
  icon: LucideIcon;
  title: string;
  description: string;
  step: string;
}

const STEPS: TimelineStep[] = [
  {
    icon: UserPlus,
    title: "Enroll",
    description:
      "Choose your program and begin your journey with a personalized learning path.",
    step: "01",
  },
  {
    icon: BookOpen,
    title: "Learn",
    description:
      "Master fundamental and advanced concepts through structured, self-paced modules.",
    step: "02",
  },
  {
    icon: Hammer,
    title: "Build Projects",
    description:
      "Apply your skills to real-world projects that build your professional portfolio.",
    step: "03",
  },
  {
    icon: BadgeCheck,
    title: "Get Certified",
    description:
      "Earn industry-recognized certificates that validate your skills and expertise.",
    step: "04",
  },
  {
    icon: DollarSign,
    title: "Start Earning",
    description:
      "Launch your career with job-ready skills, a portfolio, and mentor guidance.",
    step: "05",
  },
];

function TimelineStepCard({
  step,
  index,
  progressValue,
}: {
  step: TimelineStep;
  index: number;
  progressValue: number;
}) {
  const stepStart = index / STEPS.length;
  const stepEnd = (index + 1) / STEPS.length;
  const lit = progressValue >= stepStart * 0.8;

  return (
    <motion.div
      variants={staggerItem}
      className="relative flex flex-col items-center"
    >
      <motion.div
        animate={{
          scale: lit ? 1 : 0.85,
          opacity: lit ? 1 : 0.4,
        }}
        transition={{ duration: 0.4 }}
        className={`relative z-10 flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-500 ${
          lit
            ? "border-gold/50 bg-gold/10 shadow-glow-md"
            : "border-[var(--color-border-default)] bg-[var(--color-surface)]"
        }`}
      >
        <step.icon
          className={`h-7 w-7 transition-colors duration-500 ${lit ? "text-gold" : "text-[var(--color-text-muted)]"}`}
        />

        {lit && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 rounded-full border border-gold/30"
            style={{ boxShadow: "0 0 30px rgba(234, 179, 8, 0.2)" }}
          />
        )}

        <span
          className={`absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500 ${
            lit
              ? "bg-gold text-[var(--color-bg)]"
              : "bg-[var(--color-border-default)] text-[var(--color-text-muted)]"
          }`}
        >
          {step.step}
        </span>
      </motion.div>

      <h3
        className={`mt-5 font-display text-base font-bold transition-colors duration-500 ${lit ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}
      >
        {step.title}
      </h3>
      <p
        className={`mt-2 max-w-[180px] text-center text-xs leading-relaxed transition-colors duration-500 ${lit ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-muted)]"}`}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

export function LearningJourney() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 60%"],
  });
  const lineWidth = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => setProgressValue(v));
  }, [scrollYProgress]);

  return (
    <SectionWrapper id="journey" className="!pb-32">
      <SectionHeading
        eyebrow={t("journey.eyebrow")}
        title={t("journey.title")}
        highlight={t("journey.highlight")}
        subtitle={t("journey.subtitle")}
      />

      <div ref={containerRef} className="relative mt-20">
        <div className="absolute left-0 right-0 top-10 h-px bg-gradient-to-r from-transparent via-[var(--color-border-default)] to-transparent" />

        <motion.div
          className="absolute left-0 top-10 h-px bg-gradient-to-r from-gold to-gold-hover"
          style={{ width: lineWidth }}
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {STEPS.map((step, index) => (
            <TimelineStepCard
              key={step.title}
              step={step}
              index={index}
              progressValue={progressValue}
            />
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}