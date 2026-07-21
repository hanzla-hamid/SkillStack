"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  opacity: number;
  speed: number;
}

interface FloatingLight {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
}

export function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    const stars: Star[] = [];
    const starCount = 60;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random(),
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.3 + 0.05,
      });
    }

    const lights: FloatingLight[] = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.3,
        vx: 0.15,
        vy: 0.08,
        radius: 200,
        hue: 45,
      },
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.6,
        vx: -0.12,
        vy: 0.1,
        radius: 180,
        hue: 45,
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.8,
        vx: 0.08,
        vy: -0.06,
        radius: 150,
        hue: 50,
      },
    ];

    let frameId: number;
    let time = 0;

    const animate = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const light of lights) {
        light.x += light.vx;
        light.y += light.vy;
        if (light.x < -light.radius || light.x > canvas.width + light.radius)
          light.vx *= -1;
        if (light.y < -light.radius || light.y > canvas.height + light.radius)
          light.vy *= -1;

        const gradient = ctx.createRadialGradient(
          light.x,
          light.y,
          0,
          light.x,
          light.y,
          light.radius,
        );
        gradient.addColorStop(0, `hsla(${light.hue}, 93%, 47%, 0.06)`);
        gradient.addColorStop(0.5, `hsla(${light.hue}, 93%, 47%, 0.02)`);
        gradient.addColorStop(1, `hsla(${light.hue}, 93%, 47%, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const star of stars) {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = -10;
          star.x = Math.random() * canvas.width;
        }
        const twinkle = Math.sin(time * star.z * 10 + star.x) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(234, 179, 8, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" />
  );
}
