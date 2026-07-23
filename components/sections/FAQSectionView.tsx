import type { FAQSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { InteractiveAccordion } from "@/components/interactive/InteractiveAccordion";
import type { AccordionItemData } from "@/components/interactive/InteractiveAccordion";

type Props = {
  section: FAQSection;
  theme: ThemeClasses;
};

export function FAQSectionView({ section, theme }: Props) {
  const items = section.items ?? [];
  const interactionType = section.interactionType ?? "static";

  // ── Interactive Accordion (data-driven) ──
  if (interactionType === "accordion" && section.accordionItems && section.accordionItems.length > 0) {
    const accData: AccordionItemData[] = section.accordionItems.map((a) => ({
      title: a.question,
      description: a.answer,
      highlights: a.highlights,
      items: a.details?.items?.map((di) => ({
        title: di.title,
        description: di.description,
        value: di.value,
        meta: di.meta,
        status: di.status,
      })),
    }));

    return (
      <SectionShell bg="bg-slate-50">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 space-y-3 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
            {section.description ? (
              <p className="text-base leading-relaxed text-slate-500">{section.description}</p>
            ) : null}
          </div>
          <InteractiveAccordion items={accData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Also render with InteractiveAccordion if items exist (even without explicit accordionItems) ──
  if (interactionType === "accordion" && items.length > 0) {
    const accData: AccordionItemData[] = items.map((item) => ({
      title: item.question,
      description: item.answer,
    }));

    return (
      <SectionShell bg="bg-slate-50">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 space-y-3 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
            {section.description ? (
              <p className="text-base leading-relaxed text-slate-500">{section.description}</p>
            ) : null}
          </div>
          <InteractiveAccordion items={accData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Static native <details> ──
  return (
    <SectionShell bg="bg-slate-50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
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
                <span className={`shrink-0 text-lg transition-transform group-open:rotate-45 ${theme.text}`}>+</span>
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
