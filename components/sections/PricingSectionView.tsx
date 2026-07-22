import type { PricingSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: PricingSection;
  theme: ThemeClasses;
};

export function PricingSectionView({ section, theme }: Props) {
  const plans = section.items?.length ? section.items : section.plans ?? [];

  return (
    <SectionShell>
      <div className="space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm ${plan.highlighted ? `ring-2 ${theme.ring}` : ""} ${theme.border} bg-white`.trim()}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-950">{plan.name}</h3>
                <p className={`text-3xl font-semibold ${theme.text}`.trim()}>{plan.price}</p>
                <p className="text-sm leading-6 text-slate-600">{plan.description}</p>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span className={`mt-2 h-1.5 w-1.5 rounded-full ${theme.bg}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
