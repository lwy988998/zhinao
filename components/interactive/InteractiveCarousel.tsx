"use client";

import { useState, type ReactNode } from "react";

type Slide = {
  title?: string;
  content: ReactNode;
};

type Props = {
  slides: Slide[];
  accentClass?: string;
};

export function InteractiveCarousel({ slides, accentClass = "text-slate-950" }: Props) {
  const [active, setActive] = useState(0);
  if (slides.length === 0) return null;

  const current = slides[Math.min(active, slides.length - 1)];
  const previous = () => setActive((index) => (index === 0 ? slides.length - 1 : index - 1));
  const next = () => setActive((index) => (index + 1) % slides.length);

  return (
    <div className="w-full rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="min-h-40">
        {current.title ? <p className={`mb-3 text-sm font-semibold ${accentClass}`}>{current.title}</p> : null}
        {current.content}
      </div>
      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={previous}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-95"
          aria-label="上一项"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`${slide.title ?? "slide"}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-2.5 rounded-full transition-all ${index === active ? "w-6 bg-slate-950" : "w-2.5 bg-slate-300"}`}
              aria-label={`切换到第 ${index + 1} 项`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-50 active:scale-95"
          aria-label="下一项"
        >
          →
        </button>
      </div>
    </div>
  );
}
