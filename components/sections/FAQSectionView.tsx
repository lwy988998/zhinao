import type { FAQSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: FAQSection;
  theme: ThemeClasses;
};

export function FAQSectionView({ section, theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
        </div>
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.question} className={`rounded-2xl border p-5 ${theme.border} bg-white`.trim()}>
              <h3 className="text-base font-semibold text-slate-950">{item.question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
