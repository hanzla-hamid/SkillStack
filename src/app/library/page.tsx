import type { Metadata } from "next";
import { PageHero, SectionWrapper } from "@/components/shared";
import { LearningLibraryGrid } from "@/components/sections/LearningLibraryGrid";

export const metadata: Metadata = {
  title: "Learning Library — SkillStack",
  description:
    "Explore our free learning library with curated resources on Python, Video Editing, AI, Excel, Freelancing, Content Creation, Social Media, Canva, CapCut, and Prompt Engineering.",
};

export default function LibraryPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Free Learning Library"
        title="Curated Resources for"
        highlight="Self-Paced Learning"
        subtitle="Explore our free collection of curated learning resources. Filter by category and start learning today with no commitment required."
      />
      <SectionWrapper className="!pt-0">
        <LearningLibraryGrid />
      </SectionWrapper>
    </div>
  );
}