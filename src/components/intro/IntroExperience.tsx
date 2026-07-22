"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParticleEngine } from "./particleEngine";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE_PREMIUM } from "@/lib/animations";

const PHASE_TIMINGS = {
  birth: 3000,
  assemble: 3500,
  glow: 2000,
  reveal: 2000,
  fly: 2000,
};

export function IntroExperience() {
  const { introActive, completeIntro } = useIntro();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textStage, setTextStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const handleFlyComplete = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => completeIntro(), 600);
  }, [completeIntro]);

  useParticleEngine(canvasRef, handleFlyComplete);

  // Text timing: Scene 3
  useEffect(() => {
    if (!introActive) return;
    // "SKILLSTACK" appears at glow phase start (birth + assemble = 6500ms)
    const t1 = setTimeout(() => setTextStage(1), 6500);
    // "FROM LEARNING" appears 1000ms after
    const t2 = setTimeout(() => setTextStage(2), 7500);
    // "TO EARNING" appears 1800ms after that
    const t3 = setTimeout(() => setTextStage(3), 9300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [introActive]);

  // Skip on key press or click
  useEffect(() => {
    if (!introActive) return;
    const skip = () => {
      setFadeOut(true);
      setTimeout(() => completeIntro(), 300);
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("click", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("click", skip);
    };
  }, [introActive, completeIntro]);

  if (!introActive) return null;

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="fixed inset-0 z-[200] overflow-hidden bg-[#050505]"
        >
          {/* Particle canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ mixBlendMode: "screen" }}
          />

          {/* Vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, rgba(5,5,5,0.6) 80%, rgba(5,5,5,0.95) 100%)",
            }}
          />

          {/* Text overlay - Scene 3 */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            {/* SKILLSTACK */}
            <motion.div
              initial={{ opacity: 0, y: 10, letterSpacing: "0.3em" }}
              animate={
                textStage >= 1
                  ? {
                      opacity: 1,
                      y: 0,
                      letterSpacing: "0.15em",
                    }
                  : {}
              }
              transition={{ duration: 1.2, ease: EASE_PREMIUM }}
              className="font-display text-3xl font-bold tracking-[0.15em] text-white sm:text-5xl md:text-6xl"
              style={{
                textShadow: "0 0 40px rgba(234,179,8,0.3)",
              }}
            >
              SKILLSTACK
            </motion.div>

            {/* FROM LEARNING */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                textStage >= 2
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{ duration: 0.8, ease: EASE_PREMIUM }}
              className="mt-6 font-display text-sm font-light tracking-[0.4em] text-gold/80 uppercase sm:text-lg md:text-xl"
            >
              From Learning
            </motion.div>

            {/* TO EARNING */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                textStage >= 3
                  ? {
                      opacity: 1,
                      y: 0,
                    }
                  : {}
              }
              transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.2 }}
              className="mt-2 font-display text-sm font-light tracking-[0.4em] uppercase sm:text-lg md:text-xl"
            >
              <span className="gold-gradient-text font-medium">To Earning</span>
            </motion.div>
          </div>

          {/* Skip hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 4, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40"
          >
            Press any key to skip
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
