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

const templateMeta = {
  liquid_glass_studio: { accent: "from-blue-100 to-fuchsia-100", chip: "bg-blue-50 text-blue-700", emoji: "🔮" },
  cinematic_showcase: { accent: "from-slate-950 to-indigo-950", chip: "bg-amber-50 text-amber-700", emoji: "🎬" },
  restaurant_dark_luxury: { accent: "from-stone-950 to-neutral-900", chip: "bg-amber-100 text-amber-800", emoji: "🍷" },
  ai_agent_dark: { accent: "from-slate-950 to-cyan-950", chip: "bg-cyan-100 text-cyan-700", emoji: "🤖" },
  warm_brand_story: { accent: "from-orange-50 to-rose-100", chip: "bg-rose-100 text-rose-700", emoji: "🌿" },
  mobile_campaign_card: { accent: "from-orange-400 to-amber-300", chip: "bg-orange-100 text-orange-700", emoji: "📱" },
  editorial_portfolio: { accent: "from-stone-100 to-stone-200", chip: "bg-stone-200 text-stone-700", emoji: "📰" },
  full_image_brand: { accent: "from-stone-950 to-stone-200", chip: "bg-stone-100 text-stone-700", emoji: "▣" },
  dashboard_app_demo: { accent: "from-slate-950 to-purple-950", chip: "bg-purple-100 text-purple-700", emoji: "📊" },
} as const;

function TemplatePreview({ style }: { style: TemplatePreviewStyle }) {
  const base = "relative h-48 overflow-hidden rounded-t-2xl border-b";

  if (style === "liquid_glass") {
    return (
      <div className={`${base} border-white/30 bg-gradient-to-br from-blue-100 via-fuchsia-50 to-white`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_70%_55%,rgba(236,72,153,0.08),transparent_30%)]" />
        <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-[2.5rem] border border-white/80 bg-white/50 shadow-2xl backdrop-blur-xl">
          <div className="flex h-full items-center justify-center">
            <div className="h-3 w-12 rounded-full bg-blue-200/60" />
          </div>
        </div>
        <div className="absolute bottom-6 left-8 h-3 w-20 rounded-full bg-slate-300/30" />
        <div className="absolute bottom-6 right-8 h-3 w-28 rounded-full bg-fuchsia-300/20" />
      </div>
    );
  }

  if (style === "cinematic") {
    return (
      <div className={`${base} border-white/5 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(251,191,36,0.1),transparent_40%)]" />
        <div className="absolute inset-x-0 top-[30%] h-px bg-gradient-to-r from-transparent via-amber-300/40 to-transparent" />
        <div className="absolute inset-x-0 top-[70%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute left-10 top-10 text-4xl font-black tracking-[0.3em] text-white/15">FRAME</div>
        <div className="absolute bottom-6 left-10 h-2 w-32 bg-amber-200/30" />
      </div>
    );
  }

  if (style === "restaurant_dark") {
    return (
      <div className={`${base} border-white/5 bg-gradient-to-br from-stone-950 via-neutral-900 to-stone-900`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(251,191,36,0.1),transparent_45%),radial-gradient(circle_at_30%_60%,rgba(217,119,6,0.06),transparent_30%)]" />
        <div className="absolute left-8 top-8 h-16 w-16 rounded-full border border-amber-400/25 bg-amber-200/8" />
        <div className="absolute right-8 top-8 h-2 w-24 bg-amber-300/30" />
        <div className="absolute bottom-8 left-8 space-y-2">
          <div className="h-1.5 w-20 rounded bg-amber-200/20" />
          <div className="h-1.5 w-16 rounded bg-amber-200/15" />
          <div className="h-1.5 w-24 rounded bg-amber-200/10" />
        </div>
        <div className="absolute bottom-6 right-8 h-10 w-24 rounded-full border border-amber-400/20 bg-amber-300/10" />
      </div>
    );
  }

  if (style === "agent_dark") {
    return (
      <div className={`${base} border-cyan-500/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.08),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.06),transparent_35%)]" />
        <div className="absolute left-6 top-6 rounded-2xl border border-cyan-400/15 bg-cyan-400/5 p-3 backdrop-blur">
          <div className="h-2 w-14 rounded bg-cyan-300/30" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="h-8 rounded bg-white/8" />
            <div className="h-8 rounded bg-cyan-400/15" />
            <div className="h-8 rounded bg-blue-400/10" />
            <div className="h-8 rounded bg-white/8" />
          </div>
        </div>
        <div className="absolute right-8 top-10 h-20 w-20 rounded-full border border-cyan-300/10 bg-cyan-400/5 blur-sm" />
        <div className="absolute bottom-6 left-8 text-xs font-mono tracking-wider text-cyan-300/20">AGENT_ACTIVE</div>
      </div>
    );
  }

  if (style === "brand_warm") {
    return (
      <div className={`${base} border-rose-200/40 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(244,114,182,0.08),transparent_35%),radial-gradient(circle_at_75%_60%,rgba(251,146,60,0.06),transparent_30%)]" />
        <div className="absolute left-10 top-8 h-24 w-18 rotate-[-6deg] rounded-lg bg-white/80 shadow-lg" />
        <div className="absolute left-24 top-10 h-20 w-24 rotate-[8deg] rounded-lg bg-amber-100/80 shadow-md" />
        <div className="absolute right-10 bottom-8 h-3 w-28 rounded-full bg-rose-200/60" />
        <div className="absolute left-12 bottom-8 h-1.5 w-16 rounded bg-amber-300/30" />
      </div>
    );
  }

  if (style === "mobile_poster") {
    return (
      <div className={`${base} border-orange-300/60 bg-gradient-to-br from-orange-400 via-orange-500 to-amber-400`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,0.2),transparent_35%)]" />
        <div className="absolute left-1/2 top-6 h-[7.5rem] w-20 -translate-x-1/2 rounded-[1.5rem] border-[3px] border-white/80 bg-white/25 shadow-xl" />
        <div className="absolute right-6 top-8 h-8 w-20 rounded-full bg-white/70" />
        <div className="absolute bottom-7 left-6 h-10 w-16 rounded-2xl bg-slate-950/80" />
        <div className="absolute bottom-8 right-5 h-8 w-8 rounded-full bg-white/60" />
      </div>
    );
  }

  if (style === "full_image_brand") {
    return (
      <div className={`${base} border-stone-300/50 bg-stone-950`}>
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.28)_48%,rgba(246,243,237,0.2)_100%),radial-gradient(circle_at_72%_35%,rgba(245,245,244,0.22),transparent_34%)]" />
        <div className="absolute left-0 right-0 top-0 flex items-center justify-between border-b border-white/15 px-7 py-4 text-white/70">
          <div className="h-2 w-20 bg-white/55" />
          <div className="flex gap-3">
            <div className="h-1.5 w-8 bg-white/35" />
            <div className="h-1.5 w-8 bg-white/25" />
            <div className="h-1.5 w-8 bg-white/25" />
          </div>
        </div>
        <div className="absolute left-8 top-20 max-w-[9rem] space-y-3">
          <div className="h-2 w-14 bg-white/35" />
          <div className="h-7 w-32 bg-white/75" />
          <div className="h-7 w-24 bg-white/55" />
          <div className="h-2 w-28 bg-white/28" />
          <div className="h-8 w-20 border border-white/60 bg-white/80" />
        </div>
        <div className="absolute bottom-5 right-5 grid h-16 w-28 grid-cols-3 gap-1.5">
          <div className="bg-stone-200/65" />
          <div className="bg-stone-400/65" />
          <div className="bg-stone-100/65" />
        </div>
      </div>
    );
  }

  if (style === "editorial_collage") {
    return (
      <div className={`${base} border-stone-300/50 bg-gradient-to-br from-stone-100 via-amber-50 to-stone-100`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(120,53,15,0.03),transparent_30%),radial-gradient(circle_at_80%_65%,rgba(231,229,228,0.04),transparent_30%)]" />
        <div className="absolute left-7 top-6 h-26 w-20 rotate-[-10deg] rounded border border-stone-300 bg-white shadow-md" />
        <div className="absolute left-24 top-8 h-18 w-28 rotate-[7deg] rounded border border-stone-400 bg-slate-900 shadow-lg" />
        <div className="absolute right-8 top-6 h-22 w-16 rotate-[14deg] rounded border border-stone-300 bg-amber-100 shadow-md" />
        <div className="absolute bottom-7 left-8 h-2 w-28 bg-stone-300/40" />
        <div className="absolute left-14 bottom-10 text-[10px] font-mono text-stone-400">ISSUE 24</div>
      </div>
    );
  }

  // dynamic_visual (dashboard_app_demo fallback)
  return (
    <div className={`${base} border-purple-500/10 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(139,92,246,0.1),transparent_30%),radial-gradient(circle_at_65%_55%,rgba(59,130,246,0.08),transparent_30%)]" />
      <div className="absolute left-6 top-6 flex gap-2">
        <div className="h-2 w-2 rounded-full bg-purple-400/60" />
        <div className="h-2 w-2 rounded-full bg-blue-400/40" />
        <div className="h-2 w-2 rounded-full bg-white/20" />
      </div>
      <div className="absolute inset-x-8 top-14 h-px bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
      <div className="absolute bottom-6 right-8 grid h-18 w-28 grid-cols-2 gap-2">
        <div className="rounded bg-white/8" />
        <div className="rounded bg-purple-400/15" />
        <div className="rounded bg-blue-400/10" />
        <div className="rounded bg-white/6" />
      </div>
      <div className="absolute bottom-6 left-8 text-xs font-mono tracking-wider text-purple-300/20">DASHBOARD</div>
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
        {filteredTemplates.map((template) => {
          const meta = templateMeta[template.id as keyof typeof templateMeta] ?? templateMeta.dashboard_app_demo;
          return (
            <article key={template.id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
              <TemplatePreview style={template.previewStyle} />
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{meta.emoji}</span>
                  <h2 className="text-lg font-semibold text-slate-950">{template.name}</h2>
                </div>
                <p className="text-xs font-medium text-slate-500">{template.tagline}</p>
                <p className="min-h-[2.5rem] text-sm leading-6 text-slate-600">{template.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500">
                  {template.recommendedSections.slice(0, 4).map((section) => (
                    <span key={section} className="rounded-md border border-slate-200 px-2 py-1">{section}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.categories.map((category) => (
                    <span key={category} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">{categoryLabels[category]}</span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href={`/templates/${template.id}`}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    预览
                  </Link>
                  <Link
                    href={`/generate?templateId=${template.id}&visualMode=1`}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-95"
                  >
                    使用模板
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
