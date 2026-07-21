"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { GoldButton } from "@/components/shared/GoldButton";
import { staggerContainer, staggerItem } from "@/lib/animations";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    program: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", program: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <GlassCard hover={false} className="p-6 sm:p-8">
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <CheckCircle2 className="h-16 w-16 text-gold" />
          <h3 className="mt-4 font-display text-xl font-bold text-[var(--color-text-primary)]">
            Message Sent!
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-medium text-[var(--color-text-primary)]"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-[var(--color-text-primary)]"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="program"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              Program of Interest
            </label>
            <select
              id="program"
              name="program"
              value={form.program}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
            >
              <option value="">Select a program</option>
              <option value="web">Web Development</option>
              <option value="design">Graphic Designing</option>
              <option value="marketing">Digital Marketing</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="library">Free Learning Library</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="message"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              className="mt-2 w-full resize-none rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 transition-colors"
              placeholder="Tell us about your goals..."
            />
          </div>

          <GoldButton type="submit" className="w-full">
            Send Message
            <Send className="h-4 w-4" />
          </GoldButton>
        </form>
      )}
    </GlassCard>
  );
}