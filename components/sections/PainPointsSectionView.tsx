import type { PainPointsSection } from "@/types/page";
import { SectionShell } from "./SectionShell";

type Props = {
  section: PainPointsSection;
};

export function PainPointsSectionView({ section }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell bg="bg-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {section.description ? (
            <p className="text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.title}
              className="flex items-start gap-4 rounded-2xl border border-rose-200/50 bg-rose-50/50 p-5"
            >
              <div className="mt-0.5 shrink-0 text-lg">⚠️</div>
              <div>
                <h3 className="text-base font-semibold text-rose-800">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
