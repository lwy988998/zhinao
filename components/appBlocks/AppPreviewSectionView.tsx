"use client";

import { useState } from "react";
import type { AppPreviewSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: AppPreviewSection;
  theme: ThemeClasses;
};

type ViewItem = {
  title: string;
  description?: string;
  meta?: string;
  status?: string;
};

type View = {
  id: string;
  label: string;
  title: string;
  description?: string;
  items?: ViewItem[];
  layout?: "kanban" | "list" | "dashboard" | "gallery" | "detail";
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

/** Guess layout from view label if not specified */
function guessLayout(label: string, view: View): "kanban" | "list" | "dashboard" | "gallery" | "detail" {
  if (view.layout) return view.layout;
  const lower = label.toLowerCase();
  if (/看板|kanban|task|任务|进度/.test(lower)) return "kanban";
  if (/统计|概览|dashboard|指标|数据|分析/.test(lower)) return "dashboard";
  if (/列表|项目|list|目录|所有/.test(lower)) return "list";
  if (/图库|作品|gallery|展示|案例/.test(lower)) return "gallery";
  if (/详情|detail|信息|设置/.test(lower)) return "detail";
  return "list";
}

function renderViewContent(view: View) {
  const items = view.items ?? [];
  const layout = guessLayout(view.label, view);
  const hasItems = items.length > 0;

  const header = (
    <div className="mb-4">
      <h4 className="text-base font-bold text-slate-950">{view.title}</h4>
      {view.description ? (
        <p className="mt-1 text-sm text-slate-500">{view.description}</p>
      ) : null}
    </div>
  );

  // ── Kanban layout: 3 columns by status ──
  if (layout === "kanban") {
    const columns = ["pending", "active", "review"];
    const grouped: Record<string, ViewItem[]> = { pending: [], active: [], review: [], other: [] };
    for (const item of items) {
      const col = item.status && columns.includes(item.status) ? item.status : "other";
      grouped[col].push(item);
    }
    const colLabels: Record<string, string> = { pending: "待处理", active: "进行中", review: "审核中", other: "其他" };
    const displayCols = columns.concat("other").filter((c) => grouped[c].length > 0);

    if (displayCols.length === 0) {
      return (
        <div>
          {header}
          <p className="text-sm text-slate-400">暂无任务数据</p>
        </div>
      );
    }

    return (
      <div>
        {header}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayCols.map((col) => (
            <div key={col} className="rounded-xl border border-slate-200/70 bg-slate-50 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{colLabels[col]}</span>
                <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600">{grouped[col].length}</span>
              </div>
              <div className="space-y-2">
                {grouped[col].map((item, i) => (
                  <div key={i} className="rounded-lg border border-slate-200/70 bg-white px-3 py-2.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      <StatusBadge status={item.status} />
                    </div>
                    {item.description ? (
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    ) : null}
                    {item.meta ? (
                      <p className="mt-1.5 text-xs text-slate-400">{item.meta}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Dashboard layout: metrics + cards ──
  if (layout === "dashboard") {
    return (
      <div>
        {header}
        {hasItems ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 mb-4">
              {items.slice(0, 4).map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{item.title}</p>
                  <p className="mt-1 text-xl font-bold text-slate-950">{item.meta ?? "-"}</p>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
            {items.length > 4 ? (
              <div className="space-y-2">
                {items.slice(4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white px-4 py-2.5 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{item.title}</p>
                      {item.description ? (
                        <p className="text-xs text-slate-500">{item.description}</p>
                      ) : null}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm text-slate-400">暂无数据概览</p>
        )}
      </div>
    );
  }

  // ── Gallery layout ──
  if (layout === "gallery") {
    return (
      <div>
        {header}
        {hasItems ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm">
                <div className="flex h-24 items-center justify-center bg-slate-100 text-2xl text-slate-300">
                  {i + 1}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                  ) : null}
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">暂无作品</p>
        )}
      </div>
    );
  }

  // ── Detail layout ──
  if (layout === "detail") {
    return (
      <div>
        {header}
        {hasItems ? (
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-slate-200/70 bg-white px-4 py-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    {item.description ? (
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    ) : null}
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                {item.meta ? (
                  <p className="mt-2 text-xs text-slate-400">{item.meta}</p>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">暂无详情</p>
        )}
      </div>
    );
  }

  // ── Default: list layout ──
  return (
    <div>
      {header}
      {hasItems ? (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-xs text-slate-500">{item.description}</p>
                  ) : null}
                </div>
                <StatusBadge status={item.status} />
              </div>
              {item.meta ? (
                <p className="mt-1.5 text-xs text-slate-400">{item.meta}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">暂无内容项</p>
      )}
    </div>
  );
}

export function AppPreviewSectionView({ section, theme: _theme }: Props) {
  const views = (section.views ?? []) as View[];
  const [active, setActive] = useState(0);
  const layout = section.layout ?? "sidebar_app";
  const current = views[Math.min(active, views.length - 1)];

  if (views.length === 0) return null;

  const viewContent = current ? renderViewContent(current) : null;

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
                  className={`rounded-lg px-4 py-2.5 text-left text-sm font-medium transition sm:px-3 whitespace-nowrap ${
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
    const nav = (
      <div className="flex shrink-0 gap-1 overflow-x-auto">
        {views.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              i === active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    );

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
  const nav = (
    <div className="flex shrink-0 gap-1 overflow-x-auto">
      {views.map((v, i) => (
        <button
          key={v.id}
          type="button"
          onClick={() => setActive(i)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
            i === active ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

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
