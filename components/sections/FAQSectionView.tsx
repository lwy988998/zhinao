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
    <SectionShell bg="bg-slate-50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {section.description ? (
            <p className="text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-slate-200/60 bg-white shadow-sm transition-shadow open:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 text-base font-semibold text-slate-900 group-open:text-slate-950 list-none">
                <span>{item.question}</span>
                <span className={`shrink-0 text-lg transition-transform group-open:rotate-45 ${theme.text}`}>
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm leading-6 text-slate-600">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
