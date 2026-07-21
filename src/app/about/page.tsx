import type { Metadata } from "next";
import { PageHero } from "@/components/shared";
import { AboutContent } from "@/components/sections/AboutContent";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata: Metadata = {
  title: "About — SkillStack",
  description:
    "Learn about SkillStack, a premium online learning platform by The Prudents. Our mission, values, and commitment to career-ready digital skills education.",
};

export default function AboutPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="About SkillStack"
        title="Building Careers,"
        highlight="Not Just Skills"
        subtitle="SkillStack is a premium online learning platform by The Prudents, designed to help students go from learning to earning."
      />
      <AboutContent />
      <FinalCTA />
    </div>
  );
}