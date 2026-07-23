"use client";

import { useState, type ReactNode } from "react";

type Item = {
  title: string;
  content: ReactNode;
};

type Props = {
  items: Item[];
  multiple?: boolean;
  accentClass?: string;
};

export function InteractiveAccordion({ items, multiple = false, accentClass = "text-slate-950" }: Props) {
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
              <span className="text-base font-semibold text-slate-950">{item.title}</span>
              <span className={`text-xl leading-none transition-transform ${accentClass} ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {isOpen ? <div className="px-5 pb-5 text-sm leading-6 text-slate-600">{item.content}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
