import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)]">
      <div className="pointer-events-none absolute inset-0 grid-texture-fine opacity-10" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px] animate-glow-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10">
          <span className="font-display text-xl font-bold text-gold">S</span>
        </div>
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    </div>
  );
}
