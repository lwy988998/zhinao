"use client";

import { useState } from "react";
import type { AppPreviewSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: AppPreviewSection;
  theme: ThemeClasses;
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const colorMap: Record<string, string> = {
    done: "bg-green-100 text-green-700",
    active: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    review: "bg-purple-100 text-purple-700",
    blocked: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export function AppPreviewSectionView({ section, theme: _theme }: Props) {
  const views = section.views ?? [];
  const [active, setActive] = useState(0);
  const layout = section.layout ?? "sidebar_app";
  const current = views[Math.min(active, views.length - 1)];

  if (views.length === 0) return null;

  const nav = (
    <div className="flex shrink-0 gap-1 overflow-x-auto">
      {views.map((v, i) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setActive(i)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            i === active
              ? "bg-slate-950 text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

  const viewContent = current ? (
    <div className="mt-4 space-y-3">
      <h4 className="text-base font-semibold text-slate-900">{current.title}</h4>
      {current.description ? (
        <p className="text-sm text-slate-500">{current.description}</p>
      ) : null}
      {current.items && current.items.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {current.items.map((item, i) => (
            <div
              key={`${item.title}-${i}`}
              className="rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-slate-900">{item.title}</p>
                <StatusBadge status={item.status} />
              </div>
              {item.description ? (
                <p className="mt-1 text-xs text-slate-500">{item.description}</p>
              ) : null}
              {item.meta ? (
                <p className="mt-2 text-xs text-slate-400">{item.meta}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  ) : null;

  // ── sidebar_app layout ──
  if (layout === "sidebar_app") {
    return (
      <SectionShell bg="bg-white">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mt-2 text-sm text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row">
            {/* Side nav */}
            <div className="flex shrink-0 flex-row gap-1 border-b border-slate-200 bg-white px-3 py-3 sm:w-44 sm:flex-col sm:gap-0 sm:border-b-0 sm:border-r">
              {views.map((v, i) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition sm:px-3 ${
                    i === active
                      ? "bg-slate-950 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            {/* Content */}
            <div className="flex-1 p-5">{viewContent}</div>
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── topbar_app layout ──
  if (layout === "topbar_app") {
    return (
      <SectionShell bg="bg-white">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mt-2 text-sm text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 bg-white px-4 py-3">{nav}</div>
          <div className="p-5">{viewContent}</div>
        </div>
      </SectionShell>
    );
  }

  // ── split_demo layout ──
  return (
    <SectionShell bg="bg-white">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-2 text-sm text-slate-500">{section.description}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Left: explanation */}
        <div className="flex-1 space-y-4">
          <p className="text-base leading-relaxed text-slate-600">{section.description}</p>
          <div className="flex flex-wrap gap-2">{nav}</div>
        </div>
        {/* Right: app preview */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          {viewContent}
        </div>
      </div>
    </SectionShell>
  );
}
