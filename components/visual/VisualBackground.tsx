"use client";

import { useCallback, useEffect, useRef } from "react";
import type { BackgroundMode } from "@/types/page";

type Props = {
  mode?: BackgroundMode;
  children: React.ReactNode;
};

// ════════════════════════════════════════════════════════════
// Paper Collage — 纸张纹理 + 错位卡片感 + 暖色底
// ════════════════════════════════════════════════════════════

function PaperCollageBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f7f4ef]">
      {/* Paper fiber texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
      {/* Dot grain — denser */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #78350f 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      />
      {/* Subtle diagonal binding lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.012]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(42deg, transparent, transparent 12px, #78350f 12px, #78350f 13px)",
        }}
      />
      {/* Warm paper gradient patches */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 20%, #fef3c7 0%, transparent 50%), radial-gradient(circle at 75% 60%, #fce7f3 0%, transparent 50%), radial-gradient(circle at 50% 80%, #ffedd5 0%, transparent 40%)",
        }}
      />
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Dark Manifesto — 网格 + 光学效果 + 多层次暗部
// ════════════════════════════════════════════════════════════

function DarkManifestoBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      {/* Warm gold accent glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 10%, #fbbf24 0%, transparent 35%), radial-gradient(circle at 85% 70%, #f59e0b 0%, transparent 30%), radial-gradient(circle at 50% 50%, #b45309 0%, transparent 50%)",
        }}
      />
      {/* Fine grid — smaller spacing for tech feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Large grid — structural */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "160px 160px",
        }}
      />
      {/* Top-left optical highlight */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[40rem] w-[40rem] opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, rgba(253,224,71,0.8) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      {/* Bottom-right optical highlight */}
      <div
        className="pointer-events-none absolute -bottom-32 -right-32 h-[36rem] w-[36rem] opacity-[0.025]"
        style={{
          background: "radial-gradient(circle, rgba(191,219,254,0.6) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
      />
      {/* Horizontal scanline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-[32%] h-px opacity-[0.03]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 70%, transparent 100%)",
        }}
      />
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Soft Gradient — 高级多层柔和渐变 + 玻璃质感
// ════════════════════════════════════════════════════════════

function SoftGradientBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Base: gentle layered gradients */}
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(165deg, #f8fafc 0%, #eff6ff 25%, #f5f3ff 50%, #fdf2f8 75%, #faf5ff 100%)",
          }}
        />
        {/* Glassy overlay blobs */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(59,130,246,0.08) 0%, transparent 40%), radial-gradient(circle at 80% 40%, rgba(139,92,246,0.06) 0%, transparent 35%), radial-gradient(circle at 60% 80%, rgba(236,72,153,0.05) 0%, transparent 40%), radial-gradient(circle at 10% 70%, rgba(34,211,238,0.04) 0%, transparent 30%)",
          }}
        />
        {/* Subtle noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #4f46e5 1px, transparent 1px)",
            backgroundSize: "6px 6px",
          }}
        />
      </div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Particle Flow — 科技动感粒子 + 连接线 + 光晕
// ════════════════════════════════════════════════════════════

function ParticleFlowBg({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number; alpha: number; hue: number }>>([]);
  const frameRef = useRef(0);

  const initParticles = useCallback((width: number, height: number) => {
    const count = Math.min(Math.floor((width * height) / 6000), 100);
    const ps: typeof particlesRef.current = [];
    for (let i = 0; i < count; i++) {
      ps.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.35 + 0.08,
        hue: Math.random() < 0.5 ? 220 + Math.random() * 40 : 260 + Math.random() * 30,
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

    if (prefersReduced) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particlesRef.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.alpha})`;
        ctx.fill();
        // Glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.alpha * 0.1})`;
        ctx.fill();
      }
      return () => {
        window.removeEventListener("resize", resize);
        cancelAnimationFrame(animRef.current);
      };
    }

    const animate = () => {
      frameRef.current++;
      const f = frameRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;

      // Draw connections with distance-based opacity
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 170;
          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.12;
            const midHue = (ps[i].hue + ps[j].hue) / 2;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `hsla(${midHue}, 80%, 60%, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles with glow
      for (const p of ps) {
        p.x += p.vx + Math.sin(f * 0.008 + p.y * 0.005) * 0.12;
        p.y += p.vy + Math.cos(f * 0.008 + p.x * 0.005) * 0.12;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // Glow aura
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.alpha * 0.08})`;
        ctx.fill();

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 68%, ${p.alpha * 1.3})`;
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
      {/* Ambient light blobs */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-20" aria-hidden="true">
        <div
          className="absolute -left-32 top-[20%] h-[30rem] w-[30rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 60%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute -right-32 bottom-[20%] h-[28rem] w-[28rem] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 60%)", filter: "blur(60px)" }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Image Fullscreen — page-level paper backdrop only; hero owns the image
// ════════════════════════════════════════════════════════════

function ImageFullscreenBg({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#f6f3ed] text-slate-950">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='180' height='180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.45'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-white/80 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// Main component
// ════════════════════════════════════════════════════════════

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
    case "image_fullscreen":
      return <ImageFullscreenBg>{children}</ImageFullscreenBg>;
    case "plain":
    default:
      return <div className="min-h-screen bg-slate-50">{children}</div>;
  }
}
