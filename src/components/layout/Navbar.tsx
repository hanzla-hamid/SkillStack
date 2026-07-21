'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, User, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { useScrollPosition } from '@/hooks/use-scroll-position';
import { NAV_LINKS } from '@/lib/constants';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { GoldButton } from '@/components/shared/GoldButton';
import { Logo } from './Logo';
import { NavLinkItem } from './NavLinkItem';
import { MobileMenu } from './MobileMenu';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

function MegaMenu({ links }: { links: NonNullable<typeof NAV_LINKS[0]['children']> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute left-1/2 top-full mt-2 w-[480px] -translate-x-1/2"
    >
      <div className="glass-strong rounded-2xl border border-gold/10 p-2 shadow-card">
        <div className="grid grid-cols-2 gap-1">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex flex-col gap-1 rounded-xl p-3 transition-all duration-300 hover:bg-gold/5"
            >
              <span className="font-display text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-gold">
                {link.label}
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                {link.description}
              </span>
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/50 text-[var(--color-text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:text-gold"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-80"
            >
              <div className="glass-strong rounded-2xl border border-gold/10 p-4 shadow-card">
                <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface)] px-3 py-2">
                  <Search className="h-4 w-4 text-gold/50" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search courses, resources..."
                    className="flex-1 bg-transparent text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-[var(--color-text-muted)]">
                  Search functionality coming soon
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function NotificationIcon() {
  return (
    <button
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-card)]/50 text-[var(--color-text-secondary)] backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:text-gold"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" />
      <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
    </button>
  );
}

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold transition-all duration-300 hover:border-gold/40 hover:shadow-glow-sm"
        aria-label="Profile"
      >
        <User className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full z-50 mt-2 w-56"
            >
              <div className="glass-strong rounded-2xl border border-gold/10 p-2 shadow-card">
                <div className="border-b border-[var(--color-border-default)] px-3 py-2">
                  <p className="text-xs text-[var(--color-text-muted)]">Guest User</p>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">Sign in to access your dashboard</p>
                </div>
                <button
                  onClick={() => { router.push('/login'); setIsOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-gold/5 hover:text-gold"
                >
                  <User className="h-4 w-4" />
                  Login
                </button>
                <button
                  onClick={() => { router.push('/register'); setIsOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-gold/5 hover:text-gold"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Register
                </button>
                <button
                  onClick={() => { router.push('/dashboard'); setIsOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:bg-gold/5 hover:text-gold"
                >
                  <Settings className="h-4 w-4" />
                  Dashboard
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const isScrolled = useScrollPosition(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredMega, setHoveredMega] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 right-0 top-0 z-50"
    >
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isScrolled
            ? 'glass-strong border-b border-[var(--color-border-default)]/80'
            : 'border-b border-transparent'
        }`}
      />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <Logo scrolled={isScrolled} />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setHoveredMega(link.label)}
              onMouseLeave={() => setHoveredMega(null)}
            >
              <NavLinkItem
                label={link.label}
                href={link.href}
              />
              {link.children && (
                <span className="ml-0.5 inline-block">
                  <ChevronDown className="h-3 w-3 text-[var(--color-text-muted)]" />
                </span>
              )}
              <AnimatePresence>
                {link.children && hoveredMega === link.label && (
                  <MegaMenu links={link.children} />
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="hidden md:block">
            <SearchButton />
          </div>
          <LanguageToggle />
          <div className="hidden md:block">
            <NotificationIcon />
          </div>
          <div className="hidden md:block">
            <ProfileDropdown />
          </div>
          <div className="hidden md:block">
            <GoldButton onClick={() => router.push('/#enroll')}>
              {t('nav.enroll')}
            </GoldButton>
          </div>
        </div>

        <MobileMenu
          isOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          onClose={() => setMobileMenuOpen(false)}
        />
      </nav>
    </motion.header>
  );
}