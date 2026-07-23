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
    <SectionShell bg="bg-slate-50">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
            {section.description}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((item, i) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${theme.softBg} text-lg`}>
                {i + 1}
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${theme.text}`}>{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
