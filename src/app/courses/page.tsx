"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Gauge,
  FolderGit2,
  Sparkles,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { supabase, Course } from "@/lib/supabase";
import { PROGRAMS } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

const CATEGORIES = ["All", "Physical", "Online"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setCourses(data as Course[]);
    }
    setLoading(false);
  };

  const filteredCourses = courses.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All" || c.category_type === category.toLowerCase();
    const matchDifficulty =
      difficulty === "All" || c.difficulty === difficulty.toLowerCase();
    return matchSearch && matchCategory && matchDifficulty;
  });

  return (
    <div className="relative min-h-screen">
      <Navbar />
      <SectionWrapper className="pt-32">
        <SectionHeading
          eyebrow="All Courses"
          title="Explore Our"
          highlight="Premium Programs"
          subtitle="Browse all available courses at SkillStack. Filter by category, difficulty, or search by name."
        />
{/* Featured Program */}

<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}
  className="relative mt-12 overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-[var(--color-surface-card)] via-[var(--color-surface)] to-[var(--color-bg)] p-10"
>

  {/* Glow */}
  <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-gold/20 blur-[120px]" />
  <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-gold/10 blur-[120px]" />

  <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">

    <div>

      <span className="rounded-full bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold">
        ⭐ Featured Program
      </span>

      <h2 className="mt-6 font-display text-5xl font-black text-[var(--color-text-primary)]">
        Full Stack
        <span className="gold-gradient-text"> Web Development</span>
      </h2>

      <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--color-text-secondary)]">
        Learn HTML, CSS, JavaScript, React, Next.js, Node.js, Express,
        MongoDB, Git, APIs, deployment, freelancing and real-world
        projects inside one complete premium roadmap.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">

        <span className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gold">
          ✓ Physical Classes
        </span>

        <span className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gold">
          ✓ Live Projects
        </span>

        <span className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gold">
          ✓ Certificate
        </span>

        <span className="rounded-full border border-gold/20 px-4 py-2 text-sm text-gold">
          ✓ Career Guidance
        </span>

      </div>

      <div className="mt-8 flex gap-4">

        <button className="rounded-xl bg-gold px-8 py-4 font-bold text-black transition hover:scale-105">
          Enroll Now
        </button>

        <button className="rounded-xl border border-gold/20 px-8 py-4 text-[var(--color-text-primary)] transition hover:border-gold">
          View Curriculum
        </button>

      </div>

    </div>

    <div className="relative flex justify-center">

      <div className="relative h-[340px] w-[340px] rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/20 to-transparent backdrop-blur-xl">

        <div className="absolute inset-5 rounded-2xl border border-gold/20 bg-[var(--color-surface)]/40" />

        <div className="absolute left-8 top-8 text-gold">

          <p className="text-sm uppercase tracking-[0.3em]">
            Premium
          </p>

          <h3 className="mt-2 text-3xl font-black">
            6 Months
          </h3>

        </div>

        <div className="absolute bottom-8 left-8">

          <p className="text-[var(--color-text-muted)]">
            Real Projects
          </p>

          <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
            Build Your Career
          </p>

        </div>

      </div>

    </div>

  </div>

</motion.div>
        {/* Filters */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/40 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  category === cat
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-gold"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                  difficulty === diff
                    ? "border-gold/40 bg-gold/10 text-gold"
                    : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:text-gold"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Courses grid */}
        <div className="mt-12">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                <BookOpen className="h-8 w-8 text-gold/50" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  No published courses match your filters yet. Check back soon!
                </p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filteredCourses.map((course) => (
                <motion.div key={course.id} variants={staggerItem}>
                  <a href={`/courses/${course.slug}`}>
                    <GlassCard className="group flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all group-hover:border-gold/40 group-hover:bg-gold/10">
                        <BookOpen className="h-6 w-6 text-gold" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                        {course.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {course.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3 border-t border-[var(--color-border-default)] pt-4 text-xs text-[var(--color-text-secondary)]">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-gold/70" />
                            {course.duration}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Gauge className="h-3.5 w-3.5 text-gold/70" />
                          {course.difficulty}
                        </span>
                        <span className="flex items-center gap-1 capitalize">
                          <Sparkles className="h-3.5 w-3.5 text-gold/70" />
                          {course.category_type}
                        </span>
                      </div>
                    </GlassCard>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Featured programs from constants (always shown as a reference) */}
        <div className="mt-16">
          <h2 className="mb-6 font-display text-lg font-semibold text-[var(--color-text-primary)]">
            Programs We Offer
          </h2>
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PROGRAMS.slice(0, 4).map((program) => (
              <motion.div key={program.slug} variants={staggerItem}>
                <GlassCard className="group flex h-full flex-col p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all group-hover:border-gold/40">
                    <program.icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
                    {program.title}
                  </h3>
                  <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                    {program.duration} · {program.difficulty}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>
      <Footer />
    </div>
  );
}
