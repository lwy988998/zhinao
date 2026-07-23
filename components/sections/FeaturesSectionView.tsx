"use client";

import { useState } from "react";
import type { FeaturesSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { InteractiveTabs } from "@/components/interactive/InteractiveTabs";
import type { TabData } from "@/components/interactive/InteractiveTabs";
import { InteractiveAccordion } from "@/components/interactive/InteractiveAccordion";
import type { AccordionItemData } from "@/components/interactive/InteractiveAccordion";
import { InteractiveCarousel } from "@/components/interactive/InteractiveCarousel";
import type { CarouselSlideData } from "@/components/interactive/InteractiveCarousel";

type Props = {
  section: FeaturesSection;
  theme: ThemeClasses;
};

type FeatureItem = {
  title: string;
  description: string;
  icon?: string;
};

function FeatureDetailModal({ item, onClose }: { item: FeatureItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-950">{item.icon ? `${item.icon} ` : ""}{item.title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="关闭"
          >
            ×
          </button>
        </div>
        <p className="mt-4 text-base leading-relaxed text-slate-600">{item.description}</p>
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

function FeatureCard({
  item,
  isHighlight,
  theme,
}: {
  item: FeatureItem;
  isHighlight: boolean;
  theme: ThemeClasses;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
        tabIndex={0}
        role="button"
        aria-label={`查看 ${item.title} 详情`}
        className={`group cursor-pointer rounded-2xl border p-6 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
          isHighlight
            ? `border-slate-300 bg-white shadow-lg ${theme.ring}`
            : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
        }`}
      >
        {item.icon ? (
          <div className="mb-3 text-2xl">{item.icon}</div>
        ) : isHighlight ? (
          <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${theme.softBg}`}>
            <div className={`h-2 w-2 rounded-full ${theme.bg}`} />
          </div>
        ) : null}
        <h3 className={`text-lg font-semibold ${isHighlight ? theme.text : "text-slate-900"}`}>{item.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
      </article>
      {open ? <FeatureDetailModal item={item} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function FeatureCardRow({
  item,
  isHighlight,
  index,
  theme,
}: {
  item: FeatureItem;
  isHighlight: boolean;
  index: number;
  theme: ThemeClasses;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true); } }}
        tabIndex={0}
        role="button"
        aria-label={`查看 ${item.title} 详情`}
        className={`group cursor-pointer flex flex-col gap-5 rounded-2xl border p-6 transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:flex-row sm:items-center ${
          isHighlight
            ? `border-slate-300 bg-white shadow-lg ${theme.ring}`
            : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
        }`}
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isHighlight ? `${theme.bg} text-white` : theme.softBg}`}>
          <span className="text-lg font-semibold">{index + 1}</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
        </div>
      </article>
      {open ? <FeatureDetailModal item={item} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function FeaturesSectionView({ section, theme }: Props) {
  const items = section.items ?? [];
  const subtitle = section.subtitle ?? section.description;
  const layout = section.layout ?? "grid";
  const highlightIdx = section.highlightIndex;
  const interactionType = section.interactionType ?? "none";

  // ── Interactive: Tabs ──
  if (interactionType === "tabs" && section.tabs && section.tabs.length > 0) {
    const tabData: TabData[] = section.tabs.map((t) => ({
      label: t.label,
      title: t.title,
      description: t.description,
      highlights: t.highlights,
      actionLabel: t.actionLabel,
      actionValue: t.actionValue,
      items: (t.items ?? []).map((ti) => ({
        title: ti.title,
        description: ti.description,
      })),
    }));

    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-3xl">
          <InteractiveTabs tabs={tabData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Interactive: Accordion ──
  if (interactionType === "accordion" && section.accordionItems && section.accordionItems.length > 0) {
    const accordionData: AccordionItemData[] = section.accordionItems.map((a) => ({
      title: a.title,
      description: a.description,
      highlights: a.highlights,
      meta: a.meta,
      status: a.status,
      items: (a.items ?? []).map((ai) => ({
        title: ai.title,
        description: ai.description,
      })),
    }));

    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-3xl">
          <InteractiveAccordion items={accordionData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Interactive: Carousel ──
  if (interactionType === "carousel" && section.carouselSlides && section.carouselSlides.length > 0) {
    const slideData: CarouselSlideData[] = section.carouselSlides.map((s) => ({
      title: s.title,
      description: s.description,
      meta: s.meta,
      status: s.status,
      highlights: s.highlights,
      items: (s.items ?? []).map((si) => ({
        title: si.title,
        description: si.description,
      })),
    }));

    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-2xl">
          <InteractiveCarousel slides={slideData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Interactive: Grid Switch (use tabs for switching) ──
  if (interactionType === "grid_switch" && section.tabs && section.tabs.length > 0) {
    const tabData: TabData[] = section.tabs.map((t) => ({
      label: t.label,
      title: t.title,
      description: t.description,
      highlights: t.highlights,
      items: (t.items ?? []).map((ti) => ({
        title: ti.title,
        description: ti.description,
      })),
    }));

    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-3xl">
          <InteractiveTabs tabs={tabData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Numbered layout ──
  if (layout === "numbered") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={item.title} className="flex flex-col gap-3 border-b border-white/10 pb-6 last:border-0 sm:flex-row sm:gap-6">
              <span className="shrink-0 text-4xl font-black tracking-tight text-white/15 sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Collage layout ──
  if (layout === "collage") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {items.map((item, i) => {
            const rotate = (i % 3 === 0 ? -1.5 : i % 3 === 1 ? 0.8 : -0.3);
            const translateY = i % 2 === 0 ? 0 : 8;
            return (
              <article
                key={item.title}
                className="w-60 rounded-2xl border border-stone-300 bg-white p-5 shadow-md transition-shadow hover:shadow-xl"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </article>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  // ── Masonry layout ──
  if (layout === "masonry") {
    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <article
                key={item.title}
                className={`mb-5 break-inside-avoid rounded-2xl border p-5 transition-shadow ${
                  isHighlight
                    ? "border-slate-300 bg-white shadow-lg"
                    : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </article>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  // ── Default: grid / cards / list (non-interactive) ──
  const inner = (
    <>
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {section.title}
        </h2>
        {subtitle ? (
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* Grid layout */}
      {layout === "grid" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <FeatureCard key={item.title} item={item} isHighlight={isHighlight} theme={theme} />
            );
          })}
        </div>
      )}

      {/* Cards layout */}
      {layout === "cards" && (
        <div className="space-y-4">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <FeatureCardRow key={item.title} item={item} isHighlight={isHighlight} index={i} theme={theme} />
            );
          })}
        </div>
      )}

      {/* List layout */}
      {layout === "list" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className={`mt-0.5 shrink-0 text-lg ${theme.text}`}>{item.icon ?? "✦"}</span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-0.5 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  return <SectionShell bg="bg-white">{inner}</SectionShell>;
}
