"use client";

import { useState } from "react";

export type CarouselSlideData = {
  title: string;
  description?: string;
  meta?: string;
  status?: string;
  highlights?: string[];
  items?: Array<{
    title: string;
    description?: string;
    value?: string;
    meta?: string;
    status?: string;
  }>;
};

type Props = {
  slides: CarouselSlideData[];
  accentClass?: string;
};

export function InteractiveCarousel({ slides, accentClass = "text-slate-950" }: Props) {
  const [active, setActive] = useState(0);
  if (slides.length === 0) return null;

  const current = slides[Math.min(active, slides.length - 1)];
  const previous = () => setActive((index) => (index === 0 ? slides.length - 1 : index - 1));
  const next = () => setActive((index) => (index + 1) % slides.length);

  return (
    <div className="w-full rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
      <div className="min-h-36">
        {/* Header row: title + meta/status */}
        <div className="flex items-start justify-between gap-3">
          <h4 className={`text-base font-bold ${accentClass}`}>{current.title}</h4>
          <div className="flex shrink-0 items-center gap-2">
            {current.status ? (
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                {current.status}
              </span>
            ) : null}
            {current.meta ? (
              <span className="text-xs text-slate-400">{current.meta}</span>
            ) : null}
          </div>
        </div>

        {current.description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{current.description}</p>
        ) : null}

        {/* Highlights */}
        {current.highlights && current.highlights.length > 0 ? (
          <ul className="mt-4 space-y-1.5">
            {current.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className={`mt-1 shrink-0 text-xs ${accentClass}`}>●</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Items grid */}
        {current.items && current.items.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {current.items.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className="rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                {item.description ? (
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                ) : null}
                {item.value ? (
                  <p className="mt-2 text-lg font-bold text-slate-950">{item.value}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* Fallback */}
        {!current.description && (!current.highlights || current.highlights.length === 0) && (!current.items || current.items.length === 0) ? (
          <p className="mt-4 text-sm text-slate-400">暂无更多内容</p>
        ) : null}
      </div>

      {/* Controls */}
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
              key={index}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-full transition-all ${
                index === active ? "h-2.5 w-6 bg-slate-950" : "h-2.5 w-2.5 bg-slate-300"
              }`}
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

      {/* Page indicator */}
      <p className="mt-3 text-center text-xs text-slate-400">
        {active + 1} / {slides.length}
      </p>
    </div>
  );
}
