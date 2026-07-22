import type { HeroSection } from "@/types/page";
import { SectionShell } from "./SectionShell";
import type { ThemeClasses } from "@/lib/theme";

type Props = {
  section: HeroSection;
  theme: ThemeClasses;
};

export function HeroSectionView({ section, theme }: Props) {
  const primaryText = section.buttonText || section.primaryButtonText;

  return (
    <SectionShell className={`bg-gradient-to-br ${theme.gradient}`}>
      <div className="rounded-3xl border border-white/70 bg-white/75 px-6 py-12 text-center shadow-sm backdrop-blur sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {section.title}
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">{section.subtitle}</p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition ${theme.button} ${theme.buttonHover}`.trim()}
            >
              {primaryText}
            </button>
            {section.secondaryButtonText ? (
              <button
                type="button"
                className={`inline-flex h-12 items-center justify-center rounded-full border px-6 text-sm font-medium text-slate-700 transition ${theme.border} ${theme.softBg}`.trim()}
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
