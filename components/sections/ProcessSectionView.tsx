import type { ProcessSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: ProcessSection;
  theme: ThemeClasses;
};

export function ProcessSectionView({ section, theme }: Props) {
  const steps = section.steps ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <article key={step.title} className={`flex gap-4 rounded-2xl border p-5 ${theme.border} bg-white`.trim()}>
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${theme.bg} text-white`}>
                {index + 1}
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
