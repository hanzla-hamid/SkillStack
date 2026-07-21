import type { Metadata } from "next";
import { PROGRAMS } from "@/lib/constants";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const program = PROGRAMS.find((p) => p.slug === params.slug);

  if (!program) {
    return {
      title: "Course Not Found",
      description: "The requested course could not be found.",
    };
  }

  return {
    title: `${program.title} — ${program.duration} | SkillStack`,
    description: program.description,
    alternates: { canonical: `/courses/${program.slug}` },
    openGraph: {
      title: `${program.title} | SkillStack`,
      description: program.description,
      url: `/courses/${program.slug}`,
      type: "website",
    },
  };
}

export default function CourseSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
