import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)] px-6">
      <div className="pointer-events-none absolute inset-0 grid-texture-fine opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] animate-glow-pulse" />

      <div className="relative z-10 flex max-w-md flex-col items-center text-center">
        <span className="font-display text-8xl font-bold gold-gradient-text">
          404
        </span>

        <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Page Not Found
        </h1>

        <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <Link
          href="/"
          className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-hover px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:shadow-glow-md"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
