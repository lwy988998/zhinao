import type { DashboardSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: DashboardSection;
  theme: ThemeClasses;
};

function TrendBar({ metrics }: { metrics: Array<{ label: string; value: string; change?: string }> }) {
  const bars = metrics.map((m) => {
    const v = parseFloat(m.value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(v) ? v : m.label.length * 2;
  });
  const max = Math.max(...bars, 1);
  return (
    <div className="mb-6 space-y-2">
      {metrics.map((m, i) => (
        <div key={m.label} className="flex items-center gap-3 text-xs">
          <span className="w-16 shrink-0 text-right text-slate-400 truncate">{m.label}</span>
          <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-950 transition-all"
              style={{ width: `${Math.max(8, (bars[i] / max) * 100)}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-slate-600 font-medium">{m.value}</span>
          {m.change ? (
            <span className={`w-12 shrink-0 ${m.change.startsWith("+") ? "text-green-600" : m.change.startsWith("-") ? "text-red-500" : "text-slate-500"}`}>
              {m.change}
            </span>
          ) : <span className="w-12 shrink-0" />}
        </div>
      ))}
    </div>
  );
}

export function DashboardSectionView({ section, theme: _theme }: Props) {
  const metrics = section.metrics ?? [];
  const cards = section.cards ?? [];

  return (
    <SectionShell bg="bg-slate-50">
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mt-1 text-sm text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          实时数据
        </span>
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
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
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

      {/* Trend bars */}
      {metrics.length > 1 ? <TrendBar metrics={metrics} /> : null}

      {/* Content cards */}
      {cards.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
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
                className={`rounded-xl border border-slate-200/70 border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${statusColor}`}
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

      {/* Activity feed — from cards data */}
      {cards.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">最近活动</h4>
          <div className="space-y-3">
            {cards.slice(0, 5).map((card, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`h-2 w-2 shrink-0 rounded-full ${
                  card.status === "active" ? "bg-blue-500" :
                  card.status === "done" ? "bg-green-500" :
                  card.status === "alert" ? "bg-red-500" : "bg-slate-300"
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{card.title}</p>
                  {card.description ? (
                    <p className="text-xs text-slate-500 truncate">{card.description}</p>
                  ) : null}
                </div>
                {card.value ? (
                  <span className="shrink-0 text-sm font-semibold text-slate-700">{card.value}</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Fallback */}
      {metrics.length === 0 && cards.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-8">暂无仪表盘数据</p>
      ) : null}
    </SectionShell>
  );
}
