import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses — Browse Premium Programs",
  description:
    "Browse all available courses at SkillStack. Filter by category, difficulty, or search by name. Enroll in Web Development, Graphic Designing, Digital Marketing, and E-Commerce programs.",
  alternates: { canonical: "/courses" },
  openGraph: {
    title: "Courses — Browse Premium Programs | SkillStack",
    description:
      "Browse all available courses at SkillStack. Filter by category or difficulty.",
    url: "/courses",
  },
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
