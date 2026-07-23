import type { FeaturesSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: FeaturesSection;
  theme: ThemeClasses;
};

export function FeaturesSectionView({ section, theme }: Props) {
  const items = section.items ?? [];
  const subtitle = section.subtitle ?? section.description;
  const layout = section.layout ?? "grid";
  const highlightIdx = section.highlightIndex;

  // ── Numbered layout (01 / 02 / 03 — for manifesto/editorial) ──
  if (layout === "numbered") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/60">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={item.title} className="flex flex-col gap-3 border-b border-white/10 pb-6 last:border-0 sm:flex-row sm:gap-6">
              <span className="shrink-0 text-4xl font-black tracking-tight text-white/15 sm:text-5xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Collage layout (misaligned, rotated cards) ──
  if (layout === "collage") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap justify-center gap-6 px-4">
          {items.map((item, i) => {
            const rotate = (i % 3 === 0 ? -1.5 : i % 3 === 1 ? 0.8 : -0.3);
            const translateY = i % 2 === 0 ? 0 : 8;
            return (
              <article
                key={item.title}
                className="w-60 rounded-2xl border border-stone-300 bg-white p-5 shadow-md transition-shadow hover:shadow-xl"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                }}
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </article>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  // ── Masonry layout ──
  if (layout === "masonry") {
    return (
      <SectionShell bg="bg-white">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {subtitle ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <article
                key={item.title}
                className={`mb-5 break-inside-avoid rounded-2xl border p-5 transition-shadow ${
                  isHighlight
                    ? "border-slate-300 bg-white shadow-lg"
                    : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </article>
            );
          })}
        </div>
      </SectionShell>
    );
  }

  // ── Rest of layouts below ──
  const inner = (
    <>
      {/* Section header */}
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {section.title}
        </h2>
        {subtitle ? (
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>

      {/* ── Grid layout (default) ── */}
      {layout === "grid" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <article
                key={item.title}
                className={`group rounded-2xl border p-6 transition-shadow ${
                  isHighlight
                    ? `border-slate-300 bg-white shadow-lg ${theme.ring}`
                    : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                {item.icon ? (
                  <div className={`mb-3 text-2xl`}>{item.icon}</div>
                ) : isHighlight ? (
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${theme.softBg}`}
                  >
                    <div className={`h-2 w-2 rounded-full ${theme.bg}`} />
                  </div>
                ) : null}
                <h3
                  className={`text-lg font-semibold ${
                    isHighlight ? theme.text : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.description}</p>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Cards layout (larger, more visual) ── */}
      {layout === "cards" && (
        <div className="space-y-4">
          {items.map((item, i) => {
            const isHighlight = highlightIdx === i;
            return (
              <article
                key={item.title}
                className={`group flex flex-col gap-5 rounded-2xl border p-6 transition-shadow sm:flex-row sm:items-center ${
                  isHighlight
                    ? `border-slate-300 bg-white shadow-lg ${theme.ring}`
                    : "border-slate-200/60 bg-white shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    isHighlight ? `${theme.bg} text-white` : `${theme.softBg}`
                  }`}
                >
                  <span className="text-lg font-semibold">{i + 1}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── List layout (compact, icon-led) ── */}
      {layout === "list" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex gap-3">
              <span className={`mt-0.5 shrink-0 text-lg ${theme.text}`}>
                {item.icon ?? "✦"}
              </span>
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-0.5 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  // Wrap in SectionShell if layout is grid; cards/list use their own width
  return <SectionShell bg="bg-white">{inner}</SectionShell>;
}
