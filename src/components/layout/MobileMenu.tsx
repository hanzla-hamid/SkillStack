"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { GoldButton } from "@/components/shared/GoldButton";
import { EASE_PREMIUM } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onToggle, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const { lang, t } = useLanguage();

  return (
    <>
      <button
        onClick={onToggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-text-primary)] transition-colors hover:bg-white/5 md:hidden"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE_PREMIUM }}
            className="absolute left-0 right-0 top-full overflow-hidden border-b border-[var(--color-border-default)] glass-strong md:hidden"
          >
            <nav className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link, i) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link key={link.label} href={link.href} onClick={onClose}>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className={cn(
                        "block rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-gold/5 text-gold"
                          : "text-[var(--color-text-primary)]/80 hover:bg-white/5 hover:text-[var(--color-text-primary)]",
                        lang === "ur" && "font-urdu",
                      )}
                    >
                      {t(`nav.${link.label.toLowerCase()}`)}
                    </motion.span>
                  </Link>
                );
              })}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.3 }}
                className="pt-3"
              >
                <GoldButton className="w-full" onClick={onClose}>
                  {t("nav.enroll")}
                </GoldButton>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
