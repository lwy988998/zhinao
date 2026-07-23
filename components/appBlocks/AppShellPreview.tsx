"use client";

import { useState } from "react";
import type { PageContent } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";

type Props = {
  content: PageContent;
  theme: ThemeClasses;
};

export function AppShellPreview({ content, theme: _theme }: Props) {
  const nav = content.navigation;
  const views = content.views ?? [];
  const [activeView, setActiveView] = useState(0);
  const currentView = views[Math.min(activeView, views.length - 1)];

  if (!nav && views.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
      {/* Navigation bar */}
      {nav ? (
        <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4 py-2.5">
          <span className="mr-3 text-sm font-semibold text-slate-900">{content.pageTitle}</span>
          <div className="flex gap-1 overflow-x-auto">
            {nav.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {item.icon ? `${item.icon} ` : ""}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* Views */}
      {views.length > 0 ? (
        <div>
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2">
            {views.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveView(i)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  i === activeView
                    ? "bg-slate-950 text-white"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          {currentView ? (
            <div className="p-5">
              <h4 className="text-base font-semibold text-slate-900">{currentView.title}</h4>
              {currentView.description ? (
                <p className="mt-1 text-sm text-slate-500">{currentView.description}</p>
              ) : null}
              {currentView.items && currentView.items.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {currentView.items.map((item, i) => (
                    <div
                      key={`${item.title}-${i}`}
                      className="rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm"
                    >
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
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
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
