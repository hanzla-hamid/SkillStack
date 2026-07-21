'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Play, MessageCircle, MapPin } from 'lucide-react';
import { GoldButton, OutlineButton, TrustBadge } from '@/components/shared';
import { Hero3D } from '@/components/three/Hero3D';
import { HeroDashboard } from './HeroDashboard';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { EASE_PREMIUM, staggerContainer, staggerItem } from '@/lib/animations';
import { BRAND } from '@/lib/constants';

export function Hero() {
  const router = useRouter();
  const { t, lang } = useLanguage();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  };

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16"
    >
      {/* Full-screen 3D background */}
      <div className="absolute inset-0 z-0">
        <Hero3D />
      </div>

      {/* Mouse-following radial glow */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-60 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 30%), rgba(234, 179, 8, 0.08), transparent 70%)",
        }}
      />

      {/* Gradient overlays for readability */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-transparent" />

      {/* Grid texture overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1] grid-texture-fine radial-fade opacity-10" />

      {/* Gold glow orbs */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 z-[1] h-96 w-96 rounded-full bg-gold/10 blur-[120px] animate-glow-pulse" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 z-[1] h-80 w-80 rounded-full bg-gold/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: '2s' }} />

      {/* Content floating above 3D scene */}
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          <motion.div variants={staggerItem}>
            <span className={`inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-gold backdrop-blur-sm ${lang === 'ur' ? 'font-urdu tracking-normal' : ''}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              {t('hero.badge')}
            </span>
          </motion.div>

          <motion.h1
            variants={staggerItem}
            className={`font-display text-4xl font-bold leading-[1.1] tracking-tight text-[var(--color-text-primary)] sm:text-5xl md:text-6xl lg:text-7xl ${lang === 'ur' ? 'font-urdu' : ''}`}
          >
            {t('hero.title1')}
            <br />
            {t('hero.title2')}{' '}
            <span className="gold-gradient-text">{t('hero.title3')}</span>
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className={`font-display text-xl font-semibold text-[var(--color-text-primary)]/90 sm:text-2xl ${lang === 'ur' ? 'font-urdu' : ''}`}
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.p
            variants={staggerItem}
            className={`max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg ${lang === 'ur' ? 'font-urdu' : ''}`}
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
          >
            <GoldButton onClick={() => router.push('/courses')}>
              {t('hero.startLearning')}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </GoldButton>
            <OutlineButton onClick={() => router.push('/courses')}>
              <BookOpen className="h-4 w-4 text-gold" />
              {t('hero.exploreCourses')}
            </OutlineButton>
            <OutlineButton onClick={() => window.open(BRAND.social.whatsapp, '_blank')}>
              <MessageCircle className="h-4 w-4 text-gold" />
              {t('hero.joinCommunity')}
            </OutlineButton>
            <OutlineButton onClick={() => router.push('/contact')}>
              <MapPin className="h-4 w-4 text-gold" />
              {t('hero.bookVisit')}
            </OutlineButton>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            <TrustBadge
              icon={<Users className="h-4 w-4" />}
              label={t('hero.students')}
            />
            <TrustBadge
              icon={<Award className="h-4 w-4" />}
              label={t('hero.certificates')}
            />
            <TrustBadge
              icon={<BookOpen className="h-4 w-4" />}
              label={t('hero.resources')}
            />
          </motion.div>
        </motion.div>

        <div className="relative hidden lg:block">
          <HeroDashboard />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[var(--color-border-default)] p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-1 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}