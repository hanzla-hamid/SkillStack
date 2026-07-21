"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  ArrowUpRight,
  Phone,
  Youtube,
  Twitter,
} from "lucide-react";
import { BRAND, FOOTER_COLUMNS } from "@/lib/constants";
import { Logo } from "./Logo";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { staggerContainer, staggerItem } from "@/lib/animations";

const SOCIAL_ICONS = [
  { label: "WhatsApp", icon: MessageCircle, href: BRAND.social.whatsapp },
  { label: "Facebook", icon: Facebook, href: BRAND.social.facebook },
  { label: "Instagram", icon: Instagram, href: BRAND.social.instagram },
  { label: "X", icon: Twitter, href: BRAND.social.x },
  { label: "YouTube", icon: Youtube, href: BRAND.social.youtube },
  { label: "Email", icon: Mail, href: BRAND.social.email },
];

function FooterParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.3 - 0.1,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let frameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.fillStyle = `rgba(234, 179, 8, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

export function Footer() {
  const { t, lang } = useLanguage();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border-default)] bg-gradient-to-b from-[var(--color-bg)] to-[var(--color-surface)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-gold/8 blur-[100px]" />
      <FooterParticles />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <motion.div variants={staggerItem} className="lg:col-span-4">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo />
            </motion.div>
            <p
              className={`mt-4 max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)] ${lang === "ur" ? "font-urdu" : ""}`}
            >
              {t("footer.tagline")} {t("footer.description")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIAL_ICONS.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)] text-[var(--color-text-secondary)] transition-all duration-300 hover:border-gold/40 hover:text-gold hover:shadow-glow-sm"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6">
            {FOOTER_COLUMNS.map((col) => (
              <motion.div key={col.title} variants={staggerItem}>
                <h3
                  className={`font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)] ${lang === "ur" ? "font-urdu tracking-normal" : ""}`}
                >
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-gold"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div variants={staggerItem} className="lg:col-span-2">
            <h3
              className={`font-display text-sm font-semibold uppercase tracking-wider text-[var(--color-text-primary)] ${lang === "ur" ? "font-urdu tracking-normal" : ""}`}
            >
              {t("footer.contact")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2 text-sm text-[var(--color-text-secondary)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span>{BRAND.phone1}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span>{BRAND.phone2}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span className="break-all">{BRAND.email}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={staggerItem}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-default)] pt-8 text-center sm:flex-row sm:text-left"
        >
          <p
            className={`text-sm text-[var(--color-text-secondary)] ${lang === "ur" ? "font-urdu" : ""}`}
          >
            © {new Date().getFullYear()} {BRAND.name}. {t("footer.rights")}
          </p>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="text-sm text-[var(--color-text-secondary)]">
              {BRAND.organization}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {BRAND.developer}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
