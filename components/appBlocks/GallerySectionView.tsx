"use client";

import { useState } from "react";
import type { GallerySection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: GallerySection;
  theme: ThemeClasses;
};

type GalleryItem = {
  title: string;
  description?: string;
  imageUrl?: string;
  tag?: string;
};

/** Abstract placeholder pattern when no imageUrl */
function Placeholder({ index }: { index: number }) {
  const patterns = [
    "radial-gradient(circle at 30% 40%, #e2e8f0 1px, transparent 1px) 0 0 / 20px 20px",
    "repeating-linear-gradient(45deg, #f1f5f9 0, #f1f5f9 3px, transparent 3px, transparent 10px)",
    "repeating-linear-gradient(0deg, #e2e8f0 0, #e2e8f0 1px, transparent 1px, transparent 12px)",
    "conic-gradient(from 90deg at 50% 50%, #f1f5f9 0deg, #e2e8f0 90deg, #f1f5f9 180deg, #e2e8f0 270deg) 0 0 / 30px 30px",
  ];
  return (
    <div
      className="h-44 w-full rounded-t-xl sm:h-48"
      style={{ background: patterns[index % patterns.length] }}
    />
  );
}

function DetailModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        <div className="mt-4">
          {/* Preview area */}
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full rounded-xl object-cover h-48 sm:h-56"
              loading="lazy"
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-100 text-4xl text-slate-300">
              ✦
            </div>
          )}
          {item.description ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
          ) : null}
          {item.tag ? (
            <div className="mt-4">
              <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
                {item.tag}
              </span>
            </div>
          ) : null}
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white transition active:scale-95 hover:bg-slate-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export function GallerySectionView({ section, theme: _theme }: Props) {
  const items = (section.items ?? []) as GalleryItem[];
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const handleClick = (item: GalleryItem) => {
    setSelected(item);
  };

  return (
    <SectionShell bg="bg-white">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-2 text-sm text-slate-500">{section.description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={`${item.title}-${i}`}
            type="button"
            onClick={() => handleClick(item)}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200/70 bg-white text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            {/* Image area */}
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-48"
                loading="lazy"
              />
            ) : (
              <Placeholder index={i} />
            )}

            {/* Meta */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                {item.tag ? (
                  <span className="shrink-0 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    {item.tag}
                  </span>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">{item.description}</p>
              ) : (
                <p className="mt-2 text-sm text-slate-400">点击查看详情</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected ? <DetailModal item={selected} onClose={() => setSelected(null)} /> : null}
    </SectionShell>
  );
}
