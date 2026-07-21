import type { Metadata } from "next";
import { PageHero } from "@/components/shared";
import { ContactContent } from "@/components/sections/ContactContent";

export const metadata: Metadata = {
  title: "Contact — SkillStack",
  description:
    "Get in touch with SkillStack. Reach us via WhatsApp, email, or social media. Enroll in a program or ask us anything.",
};

export default function ContactPage() {
  return (
    <div className="relative">
      <PageHero
        eyebrow="Contact Us"
        title="Let's Start Your"
        highlight="Journey"
        subtitle="Have questions about our programs? Want to enroll? Reach out and we'll get back to you within 24 hours."
      />
      <ContactContent />
    </div>
  );
}