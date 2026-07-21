"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export function PremiumCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let mouseX = -100;
    let mouseY = -100;
    let glowX = -100;
    let glowY = -100;
    const particles: Particle[] = [];

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement;
      const isButton = target.closest(
        'button, a, [role="button"], input, select, textarea',
      );
      setHovering(!!isButton);

      if (Math.random() > 0.5) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 6,
          y: mouseY + (Math.random() - 0.5) * 6,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5 - 0.3,
          life: 1,
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      setClicking(true);
      setTimeout(() => setClicking(false), 300);
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * 2,
          vy: Math.sin(angle) * 2,
          life: 1,
        });
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    let frameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;

      const glowRadius = clicking ? 30 : hovering ? 20 : 14;
      const gradient = ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        glowRadius,
      );
      gradient.addColorStop(0, "rgba(234, 179, 8, 0.4)");
      gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.1)");
      gradient.addColorStop(1, "rgba(234, 179, 8, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(glowX, glowY, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(234, 179, 8, ${p.life * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * p.life, 0, Math.PI * 2);
        ctx.fill();
      }

      if (clicking) {
        ctx.strokeStyle = "rgba(234, 179, 8, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(glowX, glowY, 25, 0, Math.PI * 2);
        ctx.stroke();
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
    };
  }, [hovering, clicking]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[90]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
