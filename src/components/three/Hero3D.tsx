'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const Hero3DScene = dynamic(
  () => import('./Hero3DScene').then((m) => m.Hero3DScene),
  { ssr: false }
);

/**
 * Wraps the Three.js hero scene with the checks a "just render it" import skips:
 * - Skip entirely for prefers-reduced-motion (accessibility + battery)
 * - Drop to a lighter scene tier on small/low-power devices
 * - Pause the render loop the moment the hero scrolls out of view, instead of
 *   animating in the background for the rest of the session
 */
export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [tier, setTier] = useState<'high' | 'low'>('high');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const onMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', onMotionChange);

    // Detect WebGL availability before attempting to render the Canvas
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
      <Hero3DScene tier={tier} paused={!visible} />
    </div>
  );
}
