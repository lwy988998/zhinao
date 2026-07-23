import type { TimelineSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: TimelineSection;
  theme: ThemeClasses;
};

export function TimelineSectionView({ section, theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell bg="bg-white">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-2 text-sm text-slate-500">{section.description}</p>
        ) : null}
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-10">
          {items.map((item, i) => {
            const isFirst = i === 0;
            return (
              <div key={`${item.title}-${i}`} className="relative mb-10 last:mb-0 group">
                {/* Node dot */}
                <div
                  className={`absolute -left-[calc(1.5rem+5px)] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white transition-all sm:-left-[calc(2.5rem+5px)] ${
                    isFirst
                      ? `${theme.border} ${theme.bg} border-transparent text-white shadow-sm`
                      : "border-slate-200 text-slate-500"
                  }`}
                >
                  <span className={`text-xs font-bold ${isFirst ? "text-white" : ""}`}>{i + 1}</span>
                </div>

                {/* Time label */}
                {item.time ? (
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {item.time}
                  </p>
                ) : null}

                {/* Title */}
                <h3 className={`text-lg font-semibold ${isFirst ? theme.text : "text-slate-950"}`}>
                  {item.title}
                </h3>

                {/* Description with highlights-style content */}
                {item.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                ) : null}

                {/* Hover/active indicator line */}
                <div className={`mt-3 h-1 w-0 rounded-full transition-all duration-300 group-hover:w-16 ${theme.bg}`} />
              </div>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">暂无时间线数据</p>
        ) : null}
      </div>
    </SectionShell>
  );
}
