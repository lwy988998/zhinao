"use client";

import { useState } from "react";

export type AccordionItemData = {
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
  meta?: string;
  status?: string;
  actionLabel?: string;
  actionValue?: string;
};

type Props = {
  items: AccordionItemData[];
  multiple?: boolean;
  accentClass?: string;
  onAction?: (label: string, value?: string) => void;
};

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

export function InteractiveAccordion({ items, multiple = false, accentClass = "text-slate-950", onAction }: Props) {
  const [open, setOpen] = useState<number[]>([]);
  if (items.length === 0) return null;

  function toggle(index: number) {
    setOpen((current) => {
      const isOpen = current.includes(index);
      if (multiple) {
        return isOpen ? current.filter((i) => i !== index) : [...current, index];
      }
      return isOpen ? [] : [index];
    });
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = open.includes(index);
        return (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow"
          >
            <button
              type="button"
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <span className="text-base font-semibold text-slate-950 truncate">{item.title}</span>
                {item.status ? (
                  <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                    {item.status}
                  </span>
                ) : null}
                {item.meta ? (
                  <span className="shrink-0 text-xs text-slate-400 hidden sm:inline">{item.meta}</span>
                ) : null}
              </div>
              <span className={`shrink-0 text-xl leading-none transition-transform ${accentClass} ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {isOpen ? (
              <div className="px-5 pb-5 text-sm leading-6 text-slate-600 space-y-4">
                {item.description ? <p>{item.description}</p> : null}

                {/* Highlights */}
                {item.highlights && item.highlights.length > 0 ? (
                  <ul className="space-y-1.5">
                    {item.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1 shrink-0 text-xs ${accentClass}`}>●</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Sub-items */}
                {item.items && item.items.length > 0 ? (
                  <div className="space-y-2 pt-1">
                    {item.items.map((sub, i) => (
                      <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-slate-900">{sub.title}</p>
                          {sub.status ? (
                            <span className="shrink-0 rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">
                              {sub.status}
                            </span>
                          ) : null}
                        </div>
                        {sub.description ? (
                          <p className="mt-0.5 text-xs text-slate-500">{sub.description}</p>
                        ) : null}
                        {sub.value ? (
                          <p className="mt-1 text-sm font-bold text-slate-950">{sub.value}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Action button */}
                {item.actionLabel ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onAction) {
                        onAction(item.actionLabel!, item.actionValue);
                      } else {
                        handleDefaultAction(item.actionLabel!, item.actionValue);
                      }
                    }}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-xs font-medium text-white transition active:scale-95 hover:bg-slate-800"
                  >
                    {item.actionLabel}
                  </button>
                ) : null}

                {/* Fallback */}
                {!item.description && (!item.highlights || item.highlights.length === 0) && (!item.items || item.items.length === 0) ? (
                  <p className="text-slate-400">暂无更多说明</p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
