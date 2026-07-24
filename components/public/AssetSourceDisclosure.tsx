"use client";

import { useMemo, useState } from "react";
import type { AssetSource } from "@/types/page";

type Props = {
  sources?: AssetSource[];
};

function typeLabel(type: AssetSource["type"]): string {
  if (type === "hero") return "Hero";
  if (type === "gallery") return "Gallery";
  if (type === "cover") return "Cover";
  if (type === "icon") return "Icon";
  return "图片";
}

export function AssetSourceDisclosure({ sources }: Props) {
  const [open, setOpen] = useState(false);
  const visibleSources = useMemo(
    () => (sources ?? []).filter((source) => !source.disabled && (source.url || source.imageUrl)),
    [sources],
  );

  if (visibleSources.length === 0) return null;

  return (
    <div className="mx-auto mt-3 max-w-3xl px-4 text-left">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="mx-auto flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-500 transition hover:text-slate-900"
      >
        图片来源
        <span className="text-slate-300">{open ? "收起" : "展开"}</span>
      </button>

      {open ? (
        <div className="mt-3 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-2">
          {visibleSources.map((source, index) => (
            <a
              key={source.id ?? `${source.url}-${index}`}
              href={source.url ?? source.imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 rounded-xl border border-slate-100 bg-slate-50 p-2 transition hover:border-slate-200"
            >
              {source.imageUrl ? <img src={source.imageUrl} alt={source.title ?? "图片来源"} className="h-12 w-14 shrink-0 rounded-md object-cover" /> : null}
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1">
                  <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] text-white">{typeLabel(source.type)}</span>
                  {source.provider ? <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-500">{source.provider}</span> : null}
                </span>
                <span className="mt-1 block truncate text-xs font-medium text-slate-700">{source.title ?? "未命名图片"}</span>
                <span className="block truncate text-[11px] text-slate-400">{source.licenseHint ?? source.source ?? "未提供 licenseHint"}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
