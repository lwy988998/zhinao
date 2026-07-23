import type { CTASection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: CTASection;
  theme: ThemeClasses;
};

export function CTASectionView({ section, theme }: Props) {
  const layout = section.layout ?? "banner";

  // ── Banner layout (full-width, solid color bar) ──
  if (layout === "banner" || !layout) {
    return (
      <SectionShell bg={theme.bg} className="text-white">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
            {section.description}
          </p>
          <button
            type="button"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-slate-100 hover:shadow-lg"
          >
            {section.buttonText}
          </button>
        </div>
      </SectionShell>
    );
  }

  // ── Panel layout (card-like, softer, with border) ──
  return (
    <SectionShell bg="bg-white">
      <div className={`rounded-2xl border p-8 text-center sm:p-10 ${theme.border} bg-gradient-to-br ${theme.gradient}`}>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {section.title}
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-base leading-relaxed text-slate-500">
          {section.description}
        </p>
        <button
          type="button"
          className={`mt-6 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white transition-all active:scale-[0.97] ${theme.bg} ${theme.buttonHover} shadow-sm hover:shadow-md`}
        >
          {section.buttonText}
        </button>
      </div>
    </SectionShell>
  );
}
