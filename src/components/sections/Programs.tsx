"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Gauge,
  FolderGit2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { SectionHeading, SectionWrapper } from "@/components/shared";
import { PROGRAMS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

function TiltCard({
  program,
  t,
  router,
}: {
  program: (typeof PROGRAMS)[0];
  t: (key: string) => string;
  router: ReturnType<typeof useRouter>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
    setGlare({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50 });
  };

  return (
    <motion.div variants={staggerItem} className="[perspective:1000px]">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full overflow-hidden rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:shadow-glow-md"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.1s ease-out",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(234, 179, 8, 0.08), transparent 50%)`,
          }}
        />

        {program.status === "Coming Soon" && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-gold/20 bg-gold/10 px-2.5 py-1 text-[10px] font-medium text-gold">
            <Sparkles className="h-3 w-3" />
            {t("courses.comingSoon")}
          </div>
        )}

        <div style={{ transform: "translateZ(40px)" }}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
            <program.icon className="h-7 w-7 text-gold" />
          </div>

          <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            {program.title}
          </h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {program.description}
          </p>

          <div className="mt-5 space-y-2.5 border-t border-[var(--color-border-default)] pt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Clock className="h-3.5 w-3.5 text-gold/70" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <Gauge className="h-3.5 w-3.5 text-gold/70" />
              <span>{program.difficulty}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <FolderGit2 className="h-3.5 w-3.5 text-gold/70" />
              <span>{program.projects}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {program.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-1 rounded-md border border-[var(--color-border-default)] bg-[var(--color-surface)] px-2 py-0.5 text-[10px] text-[var(--color-text-secondary)]"
              >
                <CheckCircle2 className="h-2.5 w-2.5 text-gold/60" />
                {feature}
              </span>
            ))}
          </div>

          <button
            onClick={() => router.push(`/courses/${program.slug}`)}
            className="mt-5 flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] transition-colors group-hover:text-gold"
          >
            {t("courses.learnMore")}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function Programs() {
  const router = useRouter();
  const { t } = useLanguage();

  const physicalCourses = PROGRAMS.filter((p) => p.category === "Physical");
  const onlineCourses = PROGRAMS.filter((p) => p.category === "Online");

  return (
    <SectionWrapper id="programs">
      <SectionHeading
        eyebrow={t("courses.eyebrow")}
        title={t("courses.title")}
        highlight={t("courses.highlight")}
        subtitle={t("courses.subtitle")}
      />

      <div className="mt-16 space-y-12">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
            <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
              {t("courses.physicalAcademy")}
            </h3>
          </div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {physicalCourses.map((program) => (
              <TiltCard
                key={program.slug}
                program={program}
                t={t}
                router={router}
              />
            ))}
          </motion.div>
        </div>

        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold/20 bg-gold/5">
              <Sparkles className="h-4 w-4 text-gold" />
            </span>
            <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
              {t("courses.onlineCourses")}
            </h3>
          </div>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {onlineCourses.slice(0, 4).map((program) => (
              <TiltCard
                key={program.slug}
                program={program}
                t={t}
                router={router}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}