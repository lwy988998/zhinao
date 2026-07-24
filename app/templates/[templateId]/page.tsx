import Link from "next/link";
import { notFound } from "next/navigation";
import { PageRenderer } from "@/components/PageRenderer";
import { getTemplateById, templatePresets } from "@/lib/templates";

export function generateStaticParams() {
  return templatePresets.map((template) => ({ templateId: template.id }));
}

const templateMeta = {
  liquid_glass_studio: { emoji: "🔮", bgClass: "bg-gradient-to-br from-blue-50 via-fuchsia-50 to-white" },
  cinematic_showcase: { emoji: "🎬", bgClass: "bg-slate-950" },
  restaurant_dark_luxury: { emoji: "🍷", bgClass: "bg-stone-950" },
  ai_agent_dark: { emoji: "🤖", bgClass: "bg-slate-950" },
  warm_brand_story: { emoji: "🌿", bgClass: "bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50" },
  mobile_campaign_card: { emoji: "📱", bgClass: "bg-gradient-to-br from-orange-400 to-amber-400" },
  editorial_portfolio: { emoji: "📰", bgClass: "bg-[#f7f4ef]" },
  dashboard_app_demo: { emoji: "📊", bgClass: "bg-slate-950" },
} as const;

const sectionIcons: Record<string, string> = {
  hero: "🦸",
  features: "✨",
  gallery: "🖼️",
  testimonials: "💬",
  timeline: "📅",
  process: "⚙️",
  pricing: "💰",
  faq: "❓",
  contact: "📞",
  cta: "🚀",
  app_preview: "📱",
  dashboard: "📊",
  solution: "💡",
  pain_points: "⚠️",
};

export default async function TemplateDetailPage({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params;
  const template = getTemplateById(templateId);
  if (!template) notFound();

  const meta = templateMeta[templateId as keyof typeof templateMeta] ?? templateMeta.dashboard_app_demo;
  const isDark = template.backgroundMode === "dark_manifesto" || template.backgroundMode === "particle_flow";

  return (
    <main className={`min-h-screen ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}>
      <header className={`border-b ${isDark ? "border-white/10 bg-white/5 backdrop-blur" : "border-slate-200 bg-white"}`}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/templates" className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-950"}`}>
            智脑模板库
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href={`/generate?templateId=${template.id}&visualMode=1`}
              className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition ${
                isDark
                  ? "bg-white text-slate-950 hover:bg-slate-200"
                  : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              使用此模板
            </Link>
            <Link
              href="/generate"
              className={`transition ${isDark ? "text-white/60 hover:text-white" : "text-slate-600 hover:text-slate-950"}`}
            >
              直接生成
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
        {/* Left: template info */}
        <div className="space-y-5">
          <div className="space-y-3">
            <p className={`text-sm font-medium ${isDark ? "text-white/50" : "text-slate-500"}`}>
              {template.tagline}
            </p>
            <h1 className={`text-3xl font-bold tracking-tight sm:text-4xl ${isDark ? "text-white" : "text-slate-950"}`}>
              <span className="text-2xl">{meta.emoji}</span> {template.name}
            </h1>
            <p className={`text-base leading-7 ${isDark ? "text-white/60" : "text-slate-600"}`}>
              {template.description}
            </p>
          </div>

          {/* Config grid */}
          <div className={`grid gap-2 text-sm sm:grid-cols-2 ${isDark ? "text-white/70" : "text-slate-600"}`}>
            {[
              { label: "布局", value: template.layoutPreset },
              { label: "背景", value: template.backgroundMode },
              { label: "Hero", value: template.heroFramework.layout },
              { label: "交互", value: template.interactionMode },
              { label: "风格", value: template.style },
              { label: "配色", value: template.primaryColor },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-3 ${
                  isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-xs opacity-50">{item.label}</span>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Section workflow */}
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
            <h2 className="text-sm font-semibold mb-3">模块工作流</h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {template.recommendedSections.map((section, i) => (
                <span key={section} className="flex items-center gap-1">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      isDark ? "bg-white/10 text-white/70" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {sectionIcons[section] ?? ""} {section}
                  </span>
                  {i < template.recommendedSections.length - 1 ? (
                    <span className={`text-xs ${isDark ? "text-white/20" : "text-slate-300"}`}>→</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          {/* Visual rules */}
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
            <h2 className="text-sm font-semibold mb-2">视觉规则</h2>
            <ul className="space-y-1.5">
              {template.visualRules.map((rule) => (
                <li key={rule} className={`flex items-start gap-2 text-sm ${isDark ? "text-white/60" : "text-slate-600"}`}>
                  <span className={`mt-0.5 shrink-0 ${isDark ? "text-white/30" : "text-slate-400"}`}>•</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* Image search hints */}
          <div className={`rounded-2xl border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white"}`}>
            <h2 className="text-sm font-semibold mb-2">图片搜索线索</h2>
            <div className="flex flex-wrap gap-1.5">
              {template.imageSearchHints.map((hint) => (
                <span
                  key={hint}
                  className={`rounded-full px-2.5 py-1 text-xs ${
                    isDark ? "bg-white/10 text-white/60" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {hint}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/generate?templateId=${template.id}&visualMode=1`}
              className={`inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold transition active:scale-95 ${
                isDark
                  ? "bg-white text-slate-950 hover:bg-slate-200"
                  : "bg-slate-950 text-white hover:bg-slate-800"
              }`}
            >
              {meta.emoji} 使用此模板生成
            </Link>
            <a
              href="#preview"
              className={`inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition ${
                isDark
                  ? "border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              查看预览 ↓
            </a>
          </div>
        </div>

        {/* Right: live preview */}
        <div id="preview">
          <div className={`overflow-hidden rounded-2xl border shadow-sm ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"}`}>
            <div className={`border-b px-4 py-3 text-sm font-medium ${isDark ? "border-white/10 text-white/60" : "border-slate-200 text-slate-600"}`}>
              {meta.emoji} {template.name} · 实时预览
            </div>
            <div className="max-h-[800px] overflow-auto">
              <PageRenderer content={template.previewData} mode="preview" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
