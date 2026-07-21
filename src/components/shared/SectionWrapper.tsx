"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer } from "@/lib/animations";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SectionWrapper({
  children,
  className,
  id,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(
        "relative w-full px-6 py-20 sm:px-8 md:py-28 lg:px-12",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">{children}</div>
    </motion.section>
  );
}
