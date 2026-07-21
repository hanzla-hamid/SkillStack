"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavLinkItemProps {
  label: string;
  href: string;
  onClick?: () => void;
  className?: string;
}

export function NavLinkItem({
  label,
  href,
  onClick,
  className,
}: NavLinkItemProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  const navKey = NAV_LINKS.find((l) => l.href === href);
  const translatedLabel = navKey
    ? t(`nav.${navKey.label.toLowerCase()}`)
    : label;

  const isActive =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative px-1 py-2 text-sm font-medium transition-colors duration-300",
        isActive
          ? "text-[var(--color-text-primary)]"
          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] rounded-md",
        lang === "ur" && "font-urdu",
        className,
      )}
    >
      {translatedLabel}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-0.5 bg-gold transition-all duration-300"
        initial={false}
        animate={{ width: isActive ? "100%" : "0%" }}
        whileHover={{ width: "100%" }}
      />
    </Link>
  );
}
