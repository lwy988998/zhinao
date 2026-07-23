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
    <SectionShell bg="bg-white">
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {section.title}
        </h2>
        {section.description ? (
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
            {section.description}
          </p>
        ) : null}
      </div>

      <div className="relative">
        {/* Vertical connector line (desktop) */}
        <div className="absolute left-6 top-0 hidden h-full w-0.5 bg-slate-100 md:block" />

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative flex gap-5 md:gap-8">
              {/* Step number */}
              <div
                className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${
                  index === 0 ? `${theme.bg} text-white` : "bg-white border-2 border-slate-200 text-slate-500"
                }`}
              >
                {index + 1}
              </div>

              {/* Content */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm md:flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
