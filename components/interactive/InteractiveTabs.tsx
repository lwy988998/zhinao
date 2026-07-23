"use client";

import { useState } from "react";

export type TabData = {
  label: string;
  title: string;
  description?: string;
  highlights?: string[];
  items?: Array<{
    title: string;
    description?: string;
    value?: string;
    meta?: string;
    status?: string;
  }>;
  actionLabel?: string;
  actionValue?: string;
};

type Props = {
  tabs: TabData[];
  accentClass?: string;
  onAction?: (label: string, value?: string) => void;
};

function StatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  const map: Record<string, string> = {
    done: "bg-green-100 text-green-700",
    active: "bg-blue-100 text-blue-700",
    pending: "bg-amber-100 text-amber-700",
    review: "bg-purple-100 text-purple-700",
    blocked: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

/** Default action: copy value to clipboard, show brief toast */
function handleDefaultAction(label: string, value?: string) {
  const text = value ?? label;
  navigator.clipboard.writeText(text).catch(() => {});
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg";
  toast.textContent = `已复制: ${label}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

export function InteractiveTabs({ tabs, accentClass = "text-slate-950", onAction }: Props) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const activeTab = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div className="w-full">
      {/* Tab buttons — horizontal scroll on mobile */}
      <div className="flex gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur sm:gap-2">
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition whitespace-nowrap sm:px-4 ${
                selected
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur sm:p-6">
        <h4 className="text-lg font-bold text-slate-950">{activeTab.title}</h4>
        {activeTab.description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{activeTab.description}</p>
        ) : null}

        {/* Highlights */}
        {activeTab.highlights && activeTab.highlights.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {activeTab.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className={`mt-1 shrink-0 text-xs ${accentClass}`}>●</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {/* Items as cards */}
        {activeTab.items && activeTab.items.length > 0 ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {activeTab.items.map((item, i) => (
              <div
                key={`${item.title}-${i}`}
                className="rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                {item.value ? (
                  <p className="mt-2 text-lg font-bold text-slate-950">{item.value}</p>
                ) : null}
                {item.meta ? (
                  <p className="mt-1 text-xs text-slate-400">{item.meta}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* Action button */}
        {activeTab.actionLabel ? (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => {
                if (onAction) {
                  onAction(activeTab.actionLabel!, activeTab.actionValue);
                } else {
                  handleDefaultAction(activeTab.actionLabel!, activeTab.actionValue);
                }
              }}
              className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition active:scale-95 hover:bg-slate-800"
            >
              {activeTab.actionLabel}
            </button>
          </div>
        ) : null}

        {/* Fallback: if no content at all, show a gentle prompt */}
        {!activeTab.description && (!activeTab.highlights || activeTab.highlights.length === 0) && (!activeTab.items || activeTab.items.length === 0) ? (
          <p className="mt-4 text-sm text-slate-400">暂无更多内容</p>
        ) : null}
      </div>
    </div>
  );
}
