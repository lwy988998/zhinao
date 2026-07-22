import type { PainPointsSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: PainPointsSection;
  theme: ThemeClasses;
};

export function PainPointsSectionView({ section, theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
        </div>
        <div className="space-y-3">
          {items.map((item) => (
            <article key={item.title} className={`rounded-2xl border px-5 py-4 ${theme.border} bg-rose-50`.trim()}>
              <h3 className="text-base font-semibold text-rose-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
