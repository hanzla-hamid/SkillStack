'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useIntro } from '@/components/providers/IntroProvider';

const Hero3DScene = dynamic(
  () => import('./Hero3DScene').then((m) => m.Hero3DScene),
  { ssr: false }
);

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { introComplete } = useIntro();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [tier, setTier] = useState<'high' | 'low'>('high');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebglAvailable(!!gl);
    } catch {
      setWebglAvailable(false);
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const isSmallScreen = window.innerWidth < 768;
    setTier(isSmallScreen || cores <= 4 ? 'low' : 'high');

    return () => motionQuery.removeEventListener('change', onMotionChange);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || !webglAvailable) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 h-full w-full bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(234,179,8,0.12),transparent_70%)]"
      />
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full">
      <Hero3DScene tier={tier} paused={!visible || !introComplete} />
    </div>
  );
}
