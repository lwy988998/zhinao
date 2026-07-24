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
  category?: string;
};

function Placeholder({ index, brandMode = false }: { index: number; brandMode?: boolean }) {
  const patterns = [
    "linear-gradient(135deg,#d7cfc2,#f4efe6 48%,#b8ad9c)",
    "radial-gradient(circle at 30% 30%, #efe7dc 0, transparent 42%), linear-gradient(135deg,#cfc4b4,#f7f3ec)",
    "linear-gradient(120deg,#ece4d7,#bbb09f 48%,#f7f2ea)",
    "radial-gradient(circle at 65% 35%, #f6efe5 0, transparent 45%), linear-gradient(135deg,#b9aa96,#e9dfd1)",
  ];
  return (
    <div
      className={brandMode ? "absolute inset-0" : "h-44 w-full rounded-t-xl sm:h-48"}
      style={{ background: brandMode ? patterns[index % patterns.length] : undefined }}
    >
      {!brandMode ? <div className="h-full w-full" style={{ background: patterns[index % patterns.length] }} /> : null}
    </div>
  );
}

function DetailModal({ item, onClose, brandMode = false }: { item: GalleryItem; onClose: () => void; brandMode?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className={`relative max-h-[85vh] w-full overflow-y-auto border bg-white shadow-2xl ${brandMode ? "max-w-3xl rounded-none border-stone-200 p-4 sm:p-5" : "max-w-lg rounded-3xl border-slate-200 p-6 sm:p-7"}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            {item.category || item.tag ? (
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.22em] text-slate-400">{item.category ?? item.tag}</p>
            ) : null}
            <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="关闭"
          >
            x
          </button>
        </div>
        <div className="mt-4">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className={`${brandMode ? "h-[62vh] rounded-none" : "h-48 rounded-xl sm:h-56"} w-full object-cover`}
              loading="lazy"
            />
          ) : (
            <div className={`${brandMode ? "h-[62vh] rounded-none" : "h-40 rounded-xl"} flex w-full items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 text-4xl text-stone-400`}>
              +
            </div>
          )}
          {item.description ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{item.description}</p>
          ) : null}
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center bg-slate-950 text-sm font-medium text-white transition active:scale-95 hover:bg-slate-800"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

export function GallerySectionView({ section, theme: _theme }: Props) {
  const items = section.items ?? [];
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const isFullBleed = section.layout === "full_bleed_grid";

  const handleClick = (item: GalleryItem) => {
    setSelected(item);
  };

  if (isFullBleed) {
    return (
      <SectionShell bg="bg-[#f6f3ed]" spacing="airy" divider={false}>
        <div className="mb-12 flex flex-col justify-between gap-5 border-b border-stone-300/70 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.28em] text-stone-500">Image Index</p>
            <h2 className="text-3xl font-semibold tracking-normal text-stone-950 sm:text-5xl">{section.title}</h2>
          </div>
          {section.description ? <p className="max-w-md text-sm leading-7 text-stone-600">{section.description}</p> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {items.map((item, i) => (
            <button
              key={`${item.title}-${i}`}
              type="button"
              onClick={() => handleClick(item)}
              className="group relative min-h-[22rem] overflow-hidden bg-stone-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-600 sm:min-h-[28rem]"
            >
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
              ) : (
                <Placeholder index={i} brandMode />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/15 to-transparent opacity-70 transition group-hover:opacity-95" />
              <div className="absolute inset-x-0 bottom-0 translate-y-8 p-6 text-white transition duration-300 group-hover:translate-y-0 sm:p-8">
                <div className="mb-4 flex flex-wrap gap-2">
                  {[item.category, item.tag].filter(Boolean).map((label) => (
                    <span key={label} className="border border-white/35 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75">{label}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-semibold tracking-normal">{item.title}</h3>
                {item.description ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/75 opacity-0 transition group-hover:opacity-100">{item.description}</p> : null}
              </div>
            </button>
          ))}
        </div>

        {selected ? <DetailModal item={selected} onClose={() => setSelected(null)} brandMode /> : null}
      </SectionShell>
    );
  }

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

      {selected ? <DetailModal item={selected} onClose={() => setSelected(null)} /> : null}
    </SectionShell>
  );
}
