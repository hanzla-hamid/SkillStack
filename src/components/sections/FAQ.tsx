"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SectionHeading, SectionWrapper, GlassCard } from "@/components/shared";
import { FAQS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { t } = useLanguage();
  return (
    <SectionWrapper id="faq">
      <SectionHeading
        eyebrow={t("faq.eyebrow")}
        title={t("faq.title")}
        highlight={t("faq.highlight")}
        subtitle={t("faq.subtitle")}
      />

      <motion.div
        variants={staggerContainer}
        className="mx-auto mt-16 max-w-3xl"
      >
        <GlassCard hover={false} className="overflow-hidden p-2">
          <Accordion type="single" collapsible defaultValue="item-0">
            {FAQS.map((faq, index) => (
              <motion.div key={index} variants={staggerItem}>
                <AccordionItem
                  value={`item-${index}`}
                  className={cn(
                    "border-[var(--color-border-default)] px-4",
                    index !== FAQS.length - 1 && "border-b",
                  )}
                >
                  <AccordionTrigger className="group text-left text-base font-semibold text-[var(--color-text-primary)] hover:no-underline">
                    <span className="pr-4 transition-colors duration-300 group-hover:text-gold">
                      {faq.question}
                    </span>
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:border-gold/40">
                      <Plus className="h-3.5 w-3.5 text-gold" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </GlassCard>
      </motion.div>
    </SectionWrapper>
  );
}