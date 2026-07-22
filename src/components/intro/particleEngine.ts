"use client";

import { useRef, useEffect } from "react";

export interface ParticleEngineHandle {
  setPhase: (phase: IntroPhase) => void;
  destroy: () => void;
}

export type IntroPhase = "birth" | "assemble" | "glow" | "reveal" | "fly" | "done";

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  targetOpacity: number;
  hue: number;
  life: number;
  settled: boolean;
}

interface CityParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  twinkle: number;
  twinkleSpeed: number;
}

interface NeuralNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  pulse: number;
  pulseSpeed: number;
}

const GOLD_HUE = 45;

function getLogoPoints(width: number, height: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const cx = width / 2;
  const cy = height / 2;
  const size = Math.min(width, height) * 0.12;

  // Draw "S" shape as a series of arcs
  const sPoints = 80;
  for (let i = 0; i < sPoints; i++) {
    const t = i / sPoints;
    const angle = t * Math.PI * 2;
    // S-curve using two semicircles
    let px: number, py: number;
    if (t < 0.5) {
      const a = angle - Math.PI / 2;
      px = cx - size * 0.35 + Math.cos(a) * size * 0.4;
      py = cy - size * 0.25 + Math.sin(a) * size * 0.4;
    } else {
      const a = angle + Math.PI / 2;
      px = cx + size * 0.35 + Math.cos(a) * size * 0.4;
      py = cy + size * 0.25 + Math.sin(a) * size * 0.4;
    }
    points.push({ x: px, y: py });
  }

  // Draw "S" vertical stem
  for (let i = 0; i < 30; i++) {
    const t = i / 30;
    points.push({
      x: cx + (Math.random() - 0.5) * size * 0.15,
      y: cy - size * 0.6 + t * size * 1.2,
    });
  }

  // Add some scatter points around the logo for depth
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = size * (0.8 + Math.random() * 0.6);
    points.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
    });
  }

  return points;
}

export function useParticleEngine(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  onFlyComplete: () => void,
) {
  const stateRef = useRef<{
    phase: IntroPhase;
    particles: Particle[];
    cityParticles: CityParticle[];
    neuralNodes: NeuralNode[];
    logoPoints: { x: number; y: number }[];
    cameraZ: number;
    cameraTargetZ: number;
    fogOpacity: number;
    glowIntensity: number;
    flyProgress: number;
    frameId: number;
    startTime: number;
    lastPhaseChange: number;
    mouse: { x: number; y: number };
    targetMouse: { x: number; y: number };
    width: number;
    height: number;
  }>({
    phase: "birth",
    particles: [],
    cityParticles: [],
    neuralNodes: [],
    logoPoints: [],
    cameraZ: 0,
    cameraTargetZ: 0,
    fogOpacity: 0,
    glowIntensity: 0,
    flyProgress: 0,
    frameId: 0,
    startTime: 0,
    lastPhaseChange: 0,
    mouse: { x: 0, y: 0 },
    targetMouse: { x: 0, y: 0 },
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const state = stateRef.current;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.width = w;
      state.height = h;
      state.logoPoints = getLogoPoints(w, h);
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize particles
    const PARTICLE_COUNT = 180;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * Math.max(state.width, state.height) * 0.6;
      state.particles.push({
        x: state.width / 2 + Math.cos(angle) * dist,
        y: state.height / 2 + Math.sin(angle) * dist,
        tx: 0,
        ty: 0,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 0.5,
        opacity: 0,
        targetOpacity: 0,
        hue: GOLD_HUE + (Math.random() - 0.5) * 10,
        life: Math.random(),
        settled: false,
      });
    }

    // Initialize city particles (Scene 4 - golden city)
    const CITY_COUNT = 120;
    for (let i = 0; i < CITY_COUNT; i++) {
      state.cityParticles.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 1.5 + 0.3,
        opacity: 0,
        baseOpacity: Math.random() * 0.4 + 0.1,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Initialize neural nodes (Scene 4 - neural connections)
    const NEURAL_COUNT = 25;
    for (let i = 0; i < NEURAL_COUNT; i++) {
      state.neuralNodes.push({
        x: Math.random() * state.width,
        y: Math.random() * state.height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      });
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      state.targetMouse.x = e.clientX;
      state.targetMouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    state.startTime = performance.now();
    state.lastPhaseChange = state.startTime;

    const animate = (now: number) => {
      const elapsed = now - state.startTime;
      const phaseElapsed = now - state.lastPhaseChange;
      const w = state.width;
      const h = state.height;

      // Smooth mouse
      state.mouse.x += (state.targetMouse.x - state.mouse.x) * 0.04;
      state.mouse.y += (state.targetMouse.y - state.mouse.y) * 0.04;

      // Camera parallax offset
      const camX = (state.mouse.x - w / 2) * 0.015;
      const camY = (state.mouse.y - h / 2) * 0.015;

      ctx.clearRect(0, 0, w, h);

      // === SCENE 4: Golden city background (always rendered, opacity varies) ===
      let cityOpacity = 0;
      if (state.phase === "reveal" || state.phase === "fly") {
        cityOpacity = state.phase === "reveal" ? 1 : 1 - state.flyProgress;
      }

      if (cityOpacity > 0) {
        // City silhouette buildings
        ctx.save();
        ctx.translate(camX * 2, camY * 2);

        for (let i = 0; i < 12; i++) {
          const bx = (i / 12) * w + Math.sin(i * 1.7) * 30;
          const bw = w / 14;
          const bh = h * (0.15 + Math.sin(i * 2.3) * 0.08 + 0.1);
          const by = h - bh;

          const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
          grad.addColorStop(0, `rgba(234, 179, 8, ${0.08 * cityOpacity})`);
          grad.addColorStop(0.5, `rgba(234, 179, 8, ${0.03 * cityOpacity})`);
          grad.addColorStop(1, `rgba(234, 179, 8, ${0.01 * cityOpacity})`);
          ctx.fillStyle = grad;
          ctx.fillRect(bx, by, bw, bh);

          // Building edge light
          ctx.strokeStyle = `rgba(234, 179, 8, ${0.12 * cityOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx, by + bh);
          ctx.moveTo(bx + bw, by);
          ctx.lineTo(bx + bw, by + bh);
          ctx.stroke();
        }
        ctx.restore();

        // City floating particles
        ctx.save();
        ctx.translate(camX * 1.5, camY * 1.5);
        for (const cp of state.cityParticles) {
          cp.x += cp.vx;
          cp.y += cp.vy;
          cp.twinkle += cp.twinkleSpeed;
          if (cp.x < 0) cp.x = w;
          if (cp.x > w) cp.x = 0;
          if (cp.y < 0) cp.y = h;
          if (cp.y > h) cp.y = 0;

          const tw = Math.sin(cp.twinkle) * 0.5 + 0.5;
          const op = cp.baseOpacity * tw * cityOpacity;
          if (op > 0.01) {
            ctx.fillStyle = `rgba(234, 179, 8, ${op})`;
            ctx.beginPath();
            ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        // Neural connections
        ctx.save();
        ctx.translate(camX, camY);
        for (let i = 0; i < state.neuralNodes.length; i++) {
          const n = state.neuralNodes[i];
          n.x += n.vx;
          n.y += n.vy;
          n.pulse += n.pulseSpeed;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;

          const pulseVal = Math.sin(n.pulse) * 0.5 + 0.5;

          // Draw connections to nearby nodes
          for (let j = i + 1; j < state.neuralNodes.length; j++) {
            const m = state.neuralNodes[j];
            const dx = n.x - m.x;
            const dy = n.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180) {
              const op = (1 - dist / 180) * 0.15 * cityOpacity * pulseVal;
              if (op > 0.01) {
                ctx.strokeStyle = `rgba(234, 179, 8, ${op})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(n.x, n.y);
                ctx.lineTo(m.x, m.y);
                ctx.stroke();
              }
            }
          }

          // Node glow
          const nodeOp = 0.3 * pulseVal * cityOpacity;
          if (nodeOp > 0.01) {
            const grad = ctx.createRadialGradient(
              n.x, n.y, 0,
              n.x, n.y, 8,
            );
            grad.addColorStop(0, `rgba(234, 179, 8, ${nodeOp})`);
            grad.addColorStop(1, `rgba(234, 179, 8, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // === Fog ===
      if (state.fogOpacity > 0) {
        const fogGrad = ctx.createRadialGradient(
          w / 2 + camX, h / 2 + camY, 0,
          w / 2 + camX, h / 2 + camY, Math.max(w, h) * 0.7,
        );
        fogGrad.addColorStop(0, `rgba(5, 5, 5, 0)`);
        fogGrad.addColorStop(0.6, `rgba(5, 5, 5, ${state.fogOpacity * 0.3})`);
        fogGrad.addColorStop(1, `rgba(5, 5, 5, ${state.fogOpacity * 0.7})`);
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // === Logo glow (Scene 2 - after assembly) ===
      if (state.glowIntensity > 0) {
        const glowR = Math.min(w, h) * 0.25 * state.glowIntensity;
        const glowGrad = ctx.createRadialGradient(
          w / 2 + camX * 0.5, h / 2 + camY * 0.5, 0,
          w / 2 + camX * 0.5, h / 2 + camY * 0.5, glowR,
        );
        glowGrad.addColorStop(0, `rgba(234, 179, 8, ${0.25 * state.glowIntensity})`);
        glowGrad.addColorStop(0.4, `rgba(234, 179, 8, ${0.08 * state.glowIntensity})`);
        glowGrad.addColorStop(1, `rgba(234, 179, 8, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // === Particles ===
      ctx.save();
      ctx.translate(camX * 0.5, camY * 0.5);

      const logoPts = state.logoPoints;
      const flyCam = state.phase === "fly" ? state.flyProgress : 0;

      for (let i = 0; i < state.particles.length; i++) {
        const p = state.particles[i];

        // Phase: birth - particles slowly appear and drift inward
        if (state.phase === "birth") {
          const birthProgress = Math.min(phaseElapsed / 3000, 1);
          p.targetOpacity = birthProgress * 0.7;
          // Gentle drift toward center
          const dx = w / 2 - p.x;
          const dy = h / 2 - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            p.vx += (dx / dist) * 0.008;
            p.vy += (dy / dist) * 0.008;
          }
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        // Phase: assemble - particles move to logo positions
        if (state.phase === "assemble") {
          const targetIdx = i % logoPts.length;
          p.tx = logoPts[targetIdx].x;
          p.ty = logoPts[targetIdx].y;
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx += dx * 0.003;
          p.vy += dy * 0.003;
          p.vx *= 0.92;
          p.vy *= 0.92;
          p.targetOpacity = 0.9;
          if (Math.abs(dx) < 3 && Math.abs(dy) < 3) {
            p.settled = true;
            p.x = p.tx;
            p.y = p.ty;
          }
        }

        // Phase: glow - particles hold position, glow spreads
        if (state.phase === "glow") {
          p.targetOpacity = 1;
          // Subtle breathing
          const breathe = Math.sin(elapsed * 0.001 + i) * 0.5;
          p.x = p.tx + breathe;
          p.y = p.ty + breathe;
        }

        // Phase: reveal - particles start to disperse, city appears
        if (state.phase === "reveal") {
          p.targetOpacity = 0.5;
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
          p.vx *= 0.95;
          p.vy *= 0.95;
        }

        // Phase: fly - camera moves forward, particles disperse outward
        if (state.phase === "fly") {
          const fp = state.flyProgress;
          p.targetOpacity = Math.max(0, 0.5 - fp * 0.6);
          // Push particles outward from center
          const dx = p.x - w / 2;
          const dy = p.y - h / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1) {
            p.vx += (dx / dist) * 0.15 * fp;
            p.vy += (dy / dist) * 0.15 * fp;
          }
          p.vx *= 0.97;
          p.vy *= 0.97;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.opacity += (p.targetOpacity - p.opacity) * 0.05;

        if (p.opacity > 0.01) {
          const scale = state.phase === "fly" ? 1 + flyCam * 0.5 : 1;
          ctx.fillStyle = `hsla(${p.hue}, 93%, 55%, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
          ctx.fill();

          // Glow for brighter particles
          if (p.opacity > 0.5) {
            const glowR = p.size * 3 * scale;
            const grad = ctx.createRadialGradient(
              p.x, p.y, 0,
              p.x, p.y, glowR,
            );
            grad.addColorStop(0, `hsla(${p.hue}, 93%, 55%, ${p.opacity * 0.3})`);
            grad.addColorStop(1, `hsla(${p.hue}, 93%, 55%, 0)`);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      // === Camera fly progress ===
      if (state.phase === "fly") {
        state.flyProgress = Math.min(phaseElapsed / 2000, 1);
        state.fogOpacity = state.flyProgress * 0.8;
        state.glowIntensity = Math.max(0, 1 - state.flyProgress * 1.5);

        if (state.flyProgress >= 1) {
          state.phase = "done";
          onFlyComplete();
        }
      }

      // === Phase auto-progression ===
      if (state.phase === "birth" && phaseElapsed > 3000) {
        state.phase = "assemble";
        state.lastPhaseChange = now;
      }
      if (state.phase === "assemble" && phaseElapsed > 3500) {
        state.phase = "glow";
        state.lastPhaseChange = now;
        state.glowIntensity = 0;
      }
      if (state.phase === "glow") {
        state.glowIntensity = Math.min(phaseElapsed / 1500, 1);
        if (phaseElapsed > 2000) {
          state.phase = "reveal";
          state.lastPhaseChange = now;
        }
      }
      if (state.phase === "reveal" && phaseElapsed > 2000) {
        state.phase = "fly";
        state.lastPhaseChange = now;
      }

      state.frameId = requestAnimationFrame(animate);
    };

    state.frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(state.frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [canvasRef, onFlyComplete]);

  const setPhase = (phase: IntroPhase) => {
    stateRef.current.phase = phase;
    stateRef.current.lastPhaseChange = performance.now();
    if (phase === "fly") {
      stateRef.current.flyProgress = 0;
    }
  };

  const destroy = () => {
    cancelAnimationFrame(stateRef.current.frameId);
  };

  return { setPhase, destroy };
}
