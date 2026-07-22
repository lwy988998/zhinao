import type { TestimonialsSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: TestimonialsSection;
  theme: ThemeClasses;
};

export function TestimonialsSectionView({ section, theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className={`rounded-2xl border p-5 shadow-sm ${theme.border} bg-white`.trim()}>
              <p className="text-sm leading-6 text-slate-700">“{item.content}”</p>
              <div className="mt-4">
                <p className="font-medium text-slate-950">{item.name}</p>
                {item.role ? <p className="text-sm text-slate-500">{item.role}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
