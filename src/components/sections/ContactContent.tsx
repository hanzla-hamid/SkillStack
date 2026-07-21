"use client";

import { motion } from "framer-motion";
import { MapPin, MessageCircle, Mail, Facebook, Instagram } from "lucide-react";
import { SectionWrapper, GlassCard } from "@/components/shared";
import { ContactForm } from "@/components/sections/ContactForm";
import { BRAND } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";

const CONTACT_METHODS = [
  {
    icon: MapPin,
    label: "Address",
    value: BRAND.address,
    href: null as string | null,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: BRAND.phone1,
    href: BRAND.social.whatsapp,
  },
  { icon: Mail, label: "Email", value: BRAND.email, href: BRAND.social.email },
];

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: BRAND.social.facebook },
  { icon: Instagram, label: "Instagram", href: BRAND.social.instagram },
  { icon: MessageCircle, label: "WhatsApp", href: BRAND.social.whatsapp },
];

export function ContactContent() {
  return (
    <SectionWrapper className="!pt-0">
      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {CONTACT_METHODS.map((method) => (
            <motion.div key={method.label} variants={staggerItem}>
              <GlassCard className="group p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gold/20 bg-gold/5 transition-all duration-500 group-hover:border-gold/40 group-hover:bg-gold/10">
                    <method.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                      {method.label}
                    </p>
                    {method.href ? (
                      <a
                        href={method.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-gold"
                      >
                        {method.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-[var(--color-text-primary)]">
                        {method.value}
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          <motion.div variants={staggerItem}>
            <GlassCard className="p-5">
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                Follow Us
              </p>
              <div className="mt-3 flex gap-3">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-all duration-300 hover:border-gold/40 hover:text-gold hover:shadow-glow-sm"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2"
        >
          <ContactForm />
        </motion.div>
      </div>
    </SectionWrapper>
  );
}