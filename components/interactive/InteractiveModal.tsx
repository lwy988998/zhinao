"use client";

import { useEffect, useState, type ReactNode } from "react";

export type ModalContentData = {
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
  triggerLabel: string;
  title: string;
  description?: string;
  highlights?: string[];
  items?: ModalContentData["items"];
  actionLabel?: string;
  actionValue?: string;
  children?: ReactNode;
  triggerClassName?: string;
  onAction?: (label: string, value?: string) => void;
};

export function InteractiveModal({
  triggerLabel,
  title,
  description,
  highlights,
  items,
  actionLabel,
  actionValue,
  children,
  triggerClassName,
  onAction,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const hasContent = description || (highlights && highlights.length > 0) || (items && items.length > 0) || children;

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
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭弹层"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
            {/* Header */}
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

            {/* Content */}
            <div className="mt-4 space-y-4">
              {description ? (
                <p className="text-sm leading-6 text-slate-600">{description}</p>
              ) : null}

              {highlights && highlights.length > 0 ? (
                <ul className="space-y-2">
                  {highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                      <span className="mt-1 shrink-0 text-xs text-slate-950">●</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {items && items.length > 0 ? (
                <div className="space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="rounded-xl border border-slate-200/70 bg-slate-50 px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        {item.status ? (
                          <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                            {item.status}
                          </span>
                        ) : null}
                      </div>
                      {item.description ? (
                        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                      ) : null}
                      {item.value ? (
                        <p className="mt-2 text-lg font-bold text-slate-950">{item.value}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}

              {children}

              {!hasContent ? (
                <p className="text-sm text-slate-400">暂无详细内容</p>
              ) : null}
            </div>

            {/* Action */}
            {actionLabel ? (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (onAction) {
                      onAction(actionLabel, actionValue);
                    } else {
                      const text = actionValue ?? actionLabel;
                      navigator.clipboard.writeText(text).catch(() => {});
                      const toast = document.createElement("div");
                      toast.className =
                        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg";
                      toast.textContent = `已复制: ${actionLabel}`;
                      document.body.appendChild(toast);
                      setTimeout(() => toast.remove(), 2000);
                    }
                  }}
                  className="inline-flex h-10 w-full items-center justify-center rounded-full bg-slate-950 text-sm font-medium text-white transition active:scale-95 hover:bg-slate-800"
                >
                  {actionLabel}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
