"use client";

import { useCallback, useEffect, useRef } from "react";
import type { BackgroundMode } from "@/types/page";

type Props = {
  mode?: BackgroundMode;
  children: React.ReactNode;
};

// ── Paper texture pattern (CSS-only, no image) ──

function PaperCollageBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f7f4ef]">
      {/* Dot grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* Subtle diagonal lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 8px, #000 8px, #000 9px)",
        }}
      />
      {children}
    </div>
  );
}

// ── Dark manifesto bg ──

function DarkManifestoBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Noise grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.05) 0%, transparent 50%)",
        }}
      />
      {children}
    </div>
  );
}

// ── Soft gradient bg ──

function SoftGradientBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {children}
    </div>
  );
}

// ── Particle flow (Canvas) ──

function ParticleFlowBg({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number }>>([]);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 8000), 80);
    const ps: typeof particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.3 + 0.1,
      });
    }
    particlesRef.current = ps;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reduceMotion = prefersReduced;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      initParticles(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      // Draw static particles only
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * 0.15})`;
        ctx.fill();
      }
      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animRef.current);
      };
    }

    // Animate
    let frame = 0;
    const animate = () => {
      frame++;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      const ps = particlesRef.current;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.06)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of ps) {
        p.x += p.vx + Math.sin(frame * 0.01 + p.y * 0.01) * 0.08;
        p.y += p.vy + Math.cos(frame * 0.01 + p.x * 0.01) * 0.08;

        // Wrap around
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${p.alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * 0.12})`;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [initParticles]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Main component ──

export function VisualBackground({ mode, children }: Props) {
  switch (mode) {
    case "dark_manifesto":
      return <DarkManifestoBg>{children}</DarkManifestoBg>;
    case "paper_collage":
      return <PaperCollageBg>{children}</PaperCollageBg>;
    case "particle_flow":
      return <ParticleFlowBg>{children}</ParticleFlowBg>;
    case "soft_gradient":
      return <SoftGradientBg>{children}</SoftGradientBg>;
    case "plain":
    default:
      return <div className="min-h-screen bg-slate-50">{children}</div>;
  }
}
