"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BRAND } from "@/lib/constants";

interface LogoProps {
  scrolled?: boolean;
}

export function Logo({ scrolled: _scrolled }: LogoProps) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-3"
      aria-label={BRAND.name}
    >
      <motion.div
        whileHover={{ scale: 1.08, rotate: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
        className="relative flex h-12 w-12 items-center justify-center"
      >
        <Image
          src="/images/ChatGPT_Image_Jul_13,_2026,_11_17_05_AM.png"
          alt={BRAND.name + " logo"}
          width={48}
          height={48}
          className="h-12 w-12 object-contain drop-shadow-[0_0_8px_rgba(234,179,8,0.5)] transition-[drop-shadow] duration-300 group-hover:drop-shadow-[0_0_16px_rgba(234,179,8,0.8)]"
          priority
        />
      </motion.div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)] transition-colors duration-300">
          {BRAND.name}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-gold/70">
          {BRAND.subtitle}
        </span>
      </div>
    </Link>
  );
}
