"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Medal, Trophy, Lock } from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface Badge {
  icon: typeof Award;
  title: string;
  description: string;
  color: string;
  delay: number;
}

const BADGES: Badge[] = [
  {
    icon: Medal,
    title: "Beginner",
    description:
      "Complete your first module and take the first step on your journey.",
    color: "#A3A3A3",
    delay: 0,
  },
  {
    icon: Award,
    title: "Intermediate",
    description:
      "Build real-world projects and develop a professional portfolio.",
    color: "#EAB308",
    delay: 0.2,
  },
  {
    icon: Trophy,
    title: "Professional",
    description:
      "Earn industry-recognized certificates and launch your career.",
    color: "#FDE047",
    delay: 0.4,
  },
];

function AchievementBadge({ badge, index }: { badge: Badge; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(
        () => setUnlocked(true),
        badge.delay * 1000 + 300,
      );
      return () => clearTimeout(timer);
    }
  }, [inView, badge.delay]);

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      className="group relative flex flex-col items-center text-center"
    >
      <div className="relative">
        <motion.div
          animate={unlocked ? { rotate: [0, -5, 5, 0] } : {}}
          transition={{ duration: 0.5, delay: badge.delay + 0.3 }}
          className={`relative flex h-28 w-28 items-center justify-center rounded-full border-2 transition-all duration-700 ${
            unlocked
              ? "border-gold/40 bg-gold/10 shadow-glow-lg"
              : "border-[var(--color-border-default)] bg-[var(--color-surface)] opacity-50"
          }`}
        >
          {unlocked ? (
            <badge.icon
              className="h-12 w-12 text-gold"
              style={{ color: badge.color }}
            />
          ) : (
            <Lock className="h-10 w-10 text-[var(--color-text-muted)]" />
          )}

          {unlocked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1, delay: badge.delay + 0.5 }}
              className="absolute inset-0 rounded-full border-2 border-gold/40"
            />
          )}
        </motion.div>

        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: badge.delay + 0.6 }}
            className="absolute -inset-4 rounded-full bg-gold/5 blur-2xl"
          />
        )}
      </div>

      <h3
        className={`mt-5 font-display text-lg font-bold transition-colors duration-500 ${unlocked ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)]"}`}
      >
        {badge.title}
      </h3>
      <p
        className={`mt-2 max-w-[200px] text-xs leading-relaxed transition-colors duration-500 ${unlocked ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-muted)]"}`}
      >
        {badge.description}
      </p>

      {index < BADGES.length - 1 && (
        <div className="absolute right-[-30px] top-14 hidden h-px w-[60px] bg-gradient-to-r from-gold/30 to-transparent lg:block" />
      )}
    </motion.div>
  );
}

export function AchievementSection() {
  return (
    <SectionWrapper id="achievements">
      <SectionHeading
        eyebrow="Achievement Path"
        title="Unlock Your"
        highlight="Potential"
        subtitle="Progress through SkillStack and unlock badges as you master new skills and reach career milestones."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 flex flex-col items-center gap-12 lg:flex-row lg:justify-center lg:gap-20"
      >
        {BADGES.map((badge, index) => (
          <AchievementBadge key={badge.title} badge={badge} index={index} />
        ))}
      </motion.div>
    </SectionWrapper>
  );
}