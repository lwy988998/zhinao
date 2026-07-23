import type { PricingSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: PricingSection;
  theme: ThemeClasses;
};

export function PricingSectionView({ section, theme }: Props) {
  const plans = section.items?.length ? section.items : section.plans ?? [];
  const layout = section.layout ?? "cards";
  const featuredIdx = section.featuredPlanIndex;
  const normalisedFeatured =
    typeof featuredIdx === "number" && featuredIdx >= 0 && featuredIdx < plans.length
      ? featuredIdx
      : plans.findIndex((p) => p.highlighted);

  return (
    <SectionShell bg="bg-white">
      {/* Header */}
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

      {/* ── Cards layout ── */}
      {layout === "cards" && (
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const isFeatured = normalisedFeatured === i;
            return (
              <article
                key={plan.name}
                className={`relative rounded-2xl border p-6 ${
                  isFeatured
                    ? `border-slate-300 bg-white shadow-xl ${theme.ring} scale-[1.02]`
                    : "border-slate-200/60 bg-white shadow-sm"
                }`}
              >
                {isFeatured ? (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-xs font-semibold text-white ${theme.bg}`}
                  >
                    推荐
                  </span>
                ) : null}

                <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`text-3xl font-bold ${isFeatured ? theme.text : "text-slate-900"}`}>
                    {plan.price}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{plan.description}</p>

                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg
                        className={`mt-0.5 h-4 w-4 shrink-0 ${isFeatured ? theme.text : "text-slate-400"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium transition-all active:scale-[0.97] ${
                    isFeatured
                      ? `${theme.button} ${theme.buttonHover} shadow-sm`
                      : "border border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  {isFeatured ? "立即选择" : "了解详情"}
                </button>
              </article>
            );
          })}
        </div>
      )}

      {/* ── Table layout (horizontal comparison) ── */}
      {layout === "table" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50">
                <th className="px-5 py-4 font-semibold text-slate-900">方案</th>
                <th className="px-5 py-4 font-semibold text-slate-900">价格</th>
                <th className="px-5 py-4 font-semibold text-slate-900">说明</th>
                <th className="px-5 py-4 font-semibold text-slate-900">功能亮点</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, i) => {
                const isFeatured = normalisedFeatured === i;
                return (
                  <tr
                    key={plan.name}
                    className={`border-b border-slate-100 last:border-0 ${
                      isFeatured ? `${theme.softBg}` : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">{plan.name}</span>
                      {isFeatured ? (
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${theme.bg}`}>
                          推荐
                        </span>
                      ) : null}
                    </td>
                    <td className={`px-5 py-4 font-bold ${isFeatured ? theme.text : "text-slate-900"}`}>
                      {plan.price}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{plan.description}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {plan.features.slice(0, 3).join(" · ")}
                      {plan.features.length > 3 ? " …" : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
