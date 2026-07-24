"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { templatePresets, type TemplateCategory, type TemplatePreviewStyle } from "@/lib/templates";

const categories: Array<{ key: "all" | TemplateCategory; label: string }> = [
  { key: "all", label: "全部" },
  { key: "featured", label: "精选" },
  { key: "business", label: "商业" },
  { key: "personal", label: "个人" },
  { key: "product", label: "产品" },
  { key: "event", label: "活动" },
  { key: "portfolio", label: "作品集" },
  { key: "app", label: "应用" },
];

const categoryLabels: Record<TemplateCategory, string> = {
  featured: "精选",
  business: "商业",
  personal: "个人",
  product: "产品",
  event: "活动",
  portfolio: "作品集",
  app: "应用",
};

function TemplatePreview({ style }: { style: TemplatePreviewStyle }) {
  const base = "relative h-44 overflow-hidden rounded-t-2xl border-b border-white/30";

  if (style === "liquid_glass") {
    return (
      <div className={`${base} bg-[radial-gradient(circle_at_20%_20%,#dbeafe,transparent_28%),radial-gradient(circle_at_78%_32%,#f0abfc,transparent_25%),linear-gradient(135deg,#f8fafc,#dbeafe)]`}>
        <div className="absolute left-6 top-6 h-24 w-24 rounded-[2rem] border border-white/70 bg-white/45 shadow-xl backdrop-blur" />
        <div className="absolute bottom-6 right-6 h-20 w-32 rounded-3xl border border-white/60 bg-white/35 shadow-lg backdrop-blur" />
        <div className="absolute left-24 top-16 h-12 w-36 rounded-full bg-slate-950/10 blur-sm" />
      </div>
    );
  }

  if (style === "cinematic") {
    return (
      <div className={`${base} bg-[linear-gradient(135deg,#020617,#312e81_55%,#111827)]`}>
        <div className="absolute inset-x-0 top-8 h-px bg-white/20" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80" />
        <div className="absolute bottom-7 left-7 h-16 w-28 rounded-sm bg-white/10 shadow-2xl ring-1 ring-white/15" />
        <div className="absolute right-8 top-7 h-28 w-20 rounded-full bg-amber-200/20 blur-xl" />
      </div>
    );
  }

  if (style === "restaurant_dark") {
    return (
      <div className={`${base} bg-[radial-gradient(circle_at_50%_0%,#92400e,transparent_32%),linear-gradient(135deg,#030712,#1c1917)]`}>
        <div className="absolute left-8 top-8 h-20 w-20 rounded-full border border-amber-200/30 bg-amber-100/10" />
        <div className="absolute bottom-8 right-8 h-12 w-32 rounded-full border border-amber-300/25 bg-black/30" />
        <div className="absolute bottom-6 left-8 h-px w-28 bg-amber-200/50" />
      </div>
    );
  }

  if (style === "agent_dark") {
    return (
      <div className={`${base} bg-[linear-gradient(135deg,#020617,#0f172a)]`}>
        <div className="absolute left-5 top-5 h-32 w-40 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-3">
          <div className="h-2 w-16 rounded bg-cyan-200/40" />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="h-10 rounded bg-white/10" />
            <div className="h-10 rounded bg-cyan-400/20" />
            <div className="h-10 rounded bg-blue-400/15" />
            <div className="h-10 rounded bg-white/10" />
          </div>
        </div>
        <div className="absolute right-8 top-9 h-24 w-24 rounded-full border border-blue-300/20 bg-blue-400/10 blur-sm" />
      </div>
    );
  }

  if (style === "brand_warm") {
    return (
      <div className={`${base} bg-[linear-gradient(135deg,#fff7ed,#fce7f3)]`}>
        <div className="absolute left-8 top-7 h-28 w-24 rotate-[-8deg] rounded-lg bg-white shadow-md" />
        <div className="absolute left-24 top-12 h-24 w-28 rotate-[7deg] rounded-lg bg-orange-100 shadow-md" />
        <div className="absolute bottom-7 right-8 h-12 w-28 rounded-full bg-rose-200/70" />
      </div>
    );
  }

  if (style === "mobile_poster") {
    return (
      <div className={`${base} bg-[linear-gradient(135deg,#fb923c,#facc15)]`}>
        <div className="absolute left-1/2 top-5 h-[8.5rem] w-24 -translate-x-1/2 rounded-3xl border-4 border-white/80 bg-white/30 shadow-xl" />
        <div className="absolute left-8 top-9 h-9 w-24 rounded-full bg-white/70" />
        <div className="absolute bottom-8 right-6 h-12 w-20 rounded-2xl bg-slate-950/80" />
      </div>
    );
  }

  if (style === "editorial_collage") {
    return (
      <div className={`${base} bg-[linear-gradient(135deg,#f8fafc,#e7e5e4)]`}>
        <div className="absolute left-7 top-6 h-28 w-22 rotate-[-10deg] rounded-sm bg-white shadow-md" />
        <div className="absolute left-24 top-10 h-20 w-32 rotate-[5deg] rounded-sm bg-slate-900 shadow-lg" />
        <div className="absolute bottom-7 right-8 h-24 w-20 rotate-[12deg] rounded-sm bg-amber-100 shadow-md" />
        <div className="absolute left-10 bottom-8 h-2 w-32 bg-slate-400/40" />
      </div>
    );
  }

  return (
    <div className={`${base} bg-[radial-gradient(circle_at_30%_25%,#8b5cf6,transparent_25%),radial-gradient(circle_at_70%_55%,#06b6d4,transparent_28%),linear-gradient(135deg,#020617,#111827)]`}>
      <div className="absolute inset-x-10 top-12 h-px bg-cyan-300/40" />
      <div className="absolute left-8 top-8 h-24 w-24 rounded-full border border-cyan-200/20" />
      <div className="absolute bottom-8 right-8 grid h-20 w-32 grid-cols-3 gap-2">
        <div className="rounded bg-white/10" />
        <div className="rounded bg-cyan-300/20" />
        <div className="rounded bg-purple-300/20" />
      </div>
    </div>
  );
}

export function TemplatesClient() {
  const [activeCategory, setActiveCategory] = useState<"all" | TemplateCategory>("all");
  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") return templatePresets;
    return templatePresets.filter((template) => template.categories.includes(activeCategory));
  }, [activeCategory]);

  return (
    <>
      <div className="mt-7 flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const active = category.key === activeCategory;
          return (
            <button
              key={category.key}
              type="button"
              onClick={() => setActiveCategory(category.key)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"}`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <article key={template.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <TemplatePreview style={template.previewStyle} />
            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {template.categories.map((category) => (
                    <span key={category} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">{categoryLabels[category]}</span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold text-slate-950">{template.name}</h2>
                <p className="min-h-12 text-sm leading-6 text-slate-600">{template.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                {template.recommendedSections.slice(0, 4).map((section) => (
                  <span key={section} className="rounded-md border border-slate-200 px-2 py-1">{section}</span>
                ))}
              </div>
              <Link
                href={`/generate?templateId=${template.id}&visualMode=1`}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                使用此模板
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
