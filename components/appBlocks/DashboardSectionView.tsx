import type { DashboardSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: DashboardSection;
  theme: ThemeClasses;
};

export function DashboardSectionView({ section, theme: _theme }: Props) {
  const metrics = section.metrics ?? [];
  const cards = section.cards ?? [];

  return (
    <SectionShell bg="bg-slate-50">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-2 text-sm text-slate-500">{section.description}</p>
        ) : null}
      </div>

      {/* Metrics row */}
      {metrics.length > 0 ? (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((m) => {
            const positive = m.change?.startsWith("+");
            const negative = m.change?.startsWith("-");
            return (
              <div
                key={m.label}
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {m.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{m.value}</p>
                {m.change ? (
                  <p
                    className={`mt-1 text-xs font-medium ${
                      positive ? "text-green-600" : negative ? "text-red-500" : "text-slate-500"
                    }`}
                  >
                    {m.change}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Trend bar (pure CSS) */}
      {metrics.length > 0 ? (
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-950 transition-all"
            style={{ width: `${Math.min(95, 30 + metrics.length * 15)}%` }}
          />
        </div>
      ) : null}

      {/* Content cards */}
      {cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, _i) => {
            const statusColors: Record<string, string> = {
              active: "border-l-blue-500",
              done: "border-l-green-500",
              pending: "border-l-amber-500",
              alert: "border-l-red-500",
            };
            const statusColor = card.status ? (statusColors[card.status] ?? "border-l-slate-300") : "border-l-slate-200";

            return (
              <div
                key={card.title}
                className={`rounded-xl border border-slate-200/70 border-l-4 bg-white p-4 shadow-sm ${statusColor}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900">{card.title}</p>
                  {card.status ? (
                    <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-xs font-medium text-slate-500">
                      {card.status}
                    </span>
                  ) : null}
                </div>
                {card.description ? (
                  <p className="mt-1 text-xs text-slate-500">{card.description}</p>
                ) : null}
                {card.value ? (
                  <p className="mt-2 text-lg font-bold text-slate-950">{card.value}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </SectionShell>
  );
}
