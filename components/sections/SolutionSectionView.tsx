import type { SolutionSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: SolutionSection;
  theme: ThemeClasses;
};

export function SolutionSectionView({ section, theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          <p className="text-base leading-7 text-slate-600">{section.description}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.title} className={`rounded-2xl border p-5 shadow-sm ${theme.border} bg-white`.trim()}>
              <h3 className={`text-lg font-semibold ${theme.text}`.trim()}>{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
