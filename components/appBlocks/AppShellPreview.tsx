"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { PageContent, PageSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";

type NavItem = {
  id: string;
  label: string;
  targetSectionId?: string;
  icon?: string;
};

type Props = {
  content: PageContent;
  sections: PageSection[];
  theme: ThemeClasses;
  children: ReactNode;
};

const SECTION_LABELS: Record<PageSection["type"], string> = {
  hero: "概览",
  features: "功能",
  pain_points: "痛点",
  solution: "方案",
  process: "流程",
  pricing: "价格",
  testimonials: "口碑",
  faq: "FAQ",
  contact: "联系",
  cta: "行动",
  app_preview: "Demo",
  dashboard: "仪表盘",
  timeline: "路径",
  gallery: "图库",
};

function buildFallbackNav(sections: PageSection[]): NavItem[] {
  return sections
    .filter((section) => section.type !== "cta")
    .slice(0, 8)
    .map((section, index) => ({
      id: `nav-${section.id ?? section.type}-${index}`,
      label: section.title?.slice(0, 8) || SECTION_LABELS[section.type] || section.type,
      targetSectionId: section.id ?? `${section.type}-${index + 1}`,
    }));
}

export function AppShellPreview({ content, sections, theme, children }: Props) {
  const navType = content.navigation?.type ?? (content.appMode === "dashboard" ? "side" : "hybrid");
  const navItems = useMemo(
    () => (content.navigation?.items?.length ? content.navigation.items : buildFallbackNav(sections)),
    [content.navigation, sections],
  );
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? "");

  function scrollToTarget(item: NavItem) {
    setActiveId(item.id);
    const targetId = item.targetSectionId || item.id;
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const topNav = (
    <div className="flex items-center gap-1 overflow-x-auto px-3 py-2">
      {navItems.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToTarget(item)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
              active ? "bg-slate-950 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {item.icon ? <span className="mr-1">{item.icon}</span> : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );

  const sideNav = (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white/95 p-3 lg:block">
      <div className="mb-4 rounded-2xl bg-slate-950 px-4 py-3 text-white">
        <p className="text-sm font-semibold">{content.pageTitle}</p>
        <p className="mt-1 text-xs text-white/55">v1 prototype</p>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToTarget(item)}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                active ? `${theme.softBg} ${theme.text}` : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${active ? theme.bg : "bg-slate-300"}`} />
              <span className="min-w-0 truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );

  const showSide = navType === "side" || navType === "hybrid";
  const showTop = navType === "top" || navType === "hybrid" || !showSide;

  return (
    <div className="mx-auto max-w-7xl px-3 pb-8 sm:px-5 lg:px-6">
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-xl shadow-slate-950/5">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${theme.bg}`} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-950">{content.pageTitle}</p>
              <p className="text-xs text-slate-400">{content.appMode ?? "app"} · interactive preview</p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500">
            Live demo
          </span>
        </div>

        {showTop ? <div className="border-b border-slate-200 bg-white lg:hidden">{topNav}</div> : null}
        {showTop && navType === "top" ? <div className="hidden border-b border-slate-200 bg-white lg:block">{topNav}</div> : null}

        <div className="flex min-h-screen bg-white">
          {showSide ? sideNav : null}
          <div className="min-w-0 flex-1 bg-white">{children}</div>
        </div>
      </div>
    </div>
  );
}
