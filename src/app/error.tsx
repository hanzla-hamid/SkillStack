'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)] px-6">
      <div className="pointer-events-none absolute inset-0 grid-texture-fine opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] animate-glow-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex max-w-md flex-col items-center text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10">
          <AlertTriangle className="h-8 w-8 text-gold" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Something went wrong
        </h1>

        <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
          An unexpected error occurred while rendering this page. You can try
          again or return to the homepage.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-hover px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:shadow-glow-md"
          >
            <RefreshCw className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface)] px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:border-gold/30"
          >
            Go Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
