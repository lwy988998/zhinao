"use client";

import { useEffect, useState, type ReactNode } from "react";

type Props = {
  triggerLabel: string;
  title: string;
  children: ReactNode;
  triggerClassName?: string;
};

export function InteractiveModal({ triggerLabel, title, children, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClassName ?? "inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition active:scale-[0.97] hover:bg-slate-800"}
      >
        {triggerLabel}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭弹层"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-lg font-bold text-slate-950">{title}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="关闭"
              >
                ×
              </button>
            </div>
            <div className="mt-4 text-sm leading-6 text-slate-600">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}
