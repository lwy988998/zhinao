import type { CTASection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: CTASection;
  theme: ThemeClasses;
};

export function CTASectionView({ section, theme }: Props) {
  return (
    <SectionShell>
      <div className={`rounded-3xl p-8 text-center text-white shadow-sm sm:p-10 ${theme.bg}`.trim()}>
        <div className="mx-auto max-w-3xl space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
          <p className="text-base leading-7 text-white/90">{section.description}</p>
          <button
            type="button"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
          >
            {section.buttonText}
          </button>
        </div>
      </div>
    </SectionShell>
  );
}
