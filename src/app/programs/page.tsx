import type { Metadata } from "next";
import { PageHero, SectionWrapper } from "@/components/shared";
import { ProgramsDetailed } from "@/components/sections/ProgramsDetailed";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "Programs — SkillStack",
  description:
    "Explore SkillStack premium programs: Web Development, Graphic Designing, Digital Marketing, and E-Commerce. Project-based learning with industry mentors.",
};

export default function ProgramsPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="SkillStack Academy"
        title="Premium Programs for"
        highlight="Career-Ready Skills"
        subtitle="Four industry-focused programs designed to take you from beginner to professional. Explore detailed curricula and enroll in the track that fits your goals."
      />
      <SectionWrapper className="!pt-0">
        <ProgramsDetailed />
      </SectionWrapper>
      <FinalCTA />
    </div>
  );
}