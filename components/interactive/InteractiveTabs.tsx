"use client";

import { useState, type ReactNode } from "react";

type Tab = {
  label: string;
  content: ReactNode;
};

type Props = {
  tabs: Tab[];
  accentClass?: string;
};

export function InteractiveTabs({ tabs, accentClass = "text-slate-950" }: Props) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  const activeTab = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div className="w-full">
      <div className="flex gap-2 overflow-x-auto rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur">
        {tabs.map((tab, index) => {
          const selected = index === active;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(index)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                selected
                  ? `bg-slate-950 text-white shadow-sm ${accentClass === "text-white" ? "bg-white text-slate-950" : ""}`
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-5 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur">
        {activeTab.content}
      </div>
    </div>
  );
}
