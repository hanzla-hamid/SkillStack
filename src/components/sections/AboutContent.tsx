"use client";

import { motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Zap,
  Users,
  Award,
  type LucideIcon,
} from "lucide-react";
import { SectionWrapper, GlassCard, SectionHeading } from "@/components/shared";
import { BRAND } from "@/lib/constants";
import { staggerContainer, staggerItem, hoverLift } from "@/lib/animations";

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

const VALUES: Value[] = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We exist to bridge the gap between learning and earning. Every program is built around real career outcomes.",
  },
  {
    icon: Zap,
    title: "Quality First",
    description:
      "We never compromise on content quality. Every module is crafted by industry professionals who have been there.",
  },
  {
    icon: Heart,
    title: "Student-Centric",
    description:
      "Our students come first. From mentorship to community, we provide the support you need to succeed.",
  },
  {
    icon: Eye,
    title: "Future-Ready",
    description:
      "We continuously update our curriculum to stay ahead of industry trends and emerging technologies.",
  },
];

const STATS = [
  { icon: Users, value: "500+", label: "Students Enrolled" },
  { icon: Award, value: "4", label: "Premium Programs" },
  { icon: Target, value: "100+", label: "Learning Resources" },
  { icon: Heart, value: "95%", label: "Satisfaction Rate" },
];

export function AboutContent() {
  return (
    <>
      <SectionWrapper className="!pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
              Our Story
            </h2>
            <div className="mt-4 space-y-4 text-base leading-relaxed text-[var(--color-text-secondary)]">
              <p>
                SkillStack was born from a simple observation: traditional
                education doesn&apos;t prepare students for the real world.
                While universities teach theory, the industry demands practical,
                job-ready skills.
              </p>
              <p>
                {BRAND.organization}, we set out to build a platform that
                bridges this gap. A place where students learn by building real
                projects, get mentored by industry professionals, and graduate
                with portfolios that get them hired.
              </p>
              <p>
                Today, SkillStack serves hundreds of students across four
                premium programs and a growing free learning library. Our
                graduates work as developers, designers, marketers, and
                entrepreneurs.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat) => (
              <GlassCard key={stat.label} className="p-6 text-center">
                <stat.icon className="mx-auto h-8 w-8 text-gold" />
                <p className="mt-3 font-display text-3xl font-bold text-[var(--color-text-primary)]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {stat.label}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      <SectionWrapper id="values" className="!pt-0">
        <SectionHeading
          eyebrow="Our Values"
          title="What We"
          highlight="Stand For"
          subtitle="The principles that guide everything we do at SkillStack."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2"
        >
          {VALUES.map((value) => (
            <motion.div key={value.title} variants={staggerItem} {...hoverLift}>
              <GlassCard className="group h-full p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10 group-hover:shadow-glow-sm">
                    <value.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {value.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      <SectionWrapper className="!pt-0">
        <GlassCard hover={false} className="p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {BRAND.organization}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base leading-relaxed text-[var(--color-text-secondary)]">
            The Prudents is dedicated to empowering the next generation with
            practical, career-ready digital skills. SkillStack is our flagship
            initiative to make quality education accessible to all.
          </p>
          <p className="mt-6 text-sm text-[var(--color-text-muted)]">
            {BRAND.developer}
          </p>
        </GlassCard>
      </SectionWrapper>
    </>
  );
}