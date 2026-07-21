"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

export function EasterEggs() {
  const [achievement, setAchievement] = useState<string | null>(null);
  const [secretAnimation, setSecretAnimation] = useState(false);
  const typedBuffer = useRef("");
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      typedBuffer.current += e.key.toLowerCase();
      if (typedBuffer.current.length > 20) {
        typedBuffer.current = typedBuffer.current.slice(-20);
      }

      if (typedBuffer.current.includes("skillstack")) {
        setSecretAnimation(true);
        typedBuffer.current = "";
        setTimeout(() => setSecretAnimation(false), 3000);
      }
    };

    const handleLogoClick = () => {
      logoClickCount.current += 1;

      if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
      logoClickTimer.current = setTimeout(() => {
        logoClickCount.current = 0;
      }, 2000);

      if (logoClickCount.current >= 5) {
        setAchievement("Achievement Unlocked: SkillStack Explorer!");
        logoClickCount.current = 0;
        setTimeout(() => setAchievement(null), 4000);
      }
    };

    const logo = document.querySelector("[data-logo]") as HTMLElement | null;
    if (logo) {
      logo.addEventListener("click", handleLogoClick);
      logo.style.cursor = "pointer";
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (logo) logo.removeEventListener("click", handleLogoClick);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {achievement && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed left-1/2 top-24 z-[95] -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-xl border border-gold/40 bg-[var(--color-surface-card)] px-6 py-4 shadow-glow-lg backdrop-blur-xl">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <Trophy className="h-6 w-6 text-gold" />
              </motion.div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gold">
                  Achievement
                </p>
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  {achievement}
                </p>
              </div>
              <button
                onClick={() => setAchievement(null)}
                className="ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {secretAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] pointer-events-none"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: "50%",
                  y: "50%",
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  opacity: 0,
                  scale: 1,
                }}
                transition={{
                  duration: 2 + Math.random(),
                  ease: "easeOut",
                  delay: Math.random() * 0.5,
                }}
                className="absolute h-2 w-2 rounded-full bg-gold"
                style={{
                  boxShadow: "0 0 10px rgba(234, 179, 8, 0.8)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
