import type { HeroSection } from "@/types/page";
import { SectionShell } from "./SectionShell";
import type { ThemeClasses } from "@/lib/theme";

type Props = {
  section: HeroSection;
  theme: ThemeClasses;
};

function StatsBlock({
  stats,
  accentClass,
}: {
  stats: NonNullable<HeroSection["stats"]>;
  accentClass: string;
}) {
  if (!stats?.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className={`text-2xl font-bold sm:text-3xl ${accentClass}`}>{s.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function HeroSectionView({ section, theme }: Props) {
  const layout = section.layout ?? "center";
  const primaryText = section.buttonText || section.primaryButtonText;
  const hasStats = section.stats && section.stats.length > 0;

  // ── Center layout ──
  if (layout === "center") {
    return (
      <SectionShell bg="bg-white" spacing="airy" divider={false}>
        <div className="flex flex-col items-center text-center">
          {section.badge ? (
            <span
              className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}
            >
              {section.badge}
            </span>
          ) : null}

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            {section.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            {section.subtitle}
          </p>

          {hasStats ? (
            <div className="mt-8">
              <StatsBlock stats={section.stats!} accentClass={theme.text} />
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className={`inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] ${theme.button} ${theme.buttonHover} shadow-sm hover:shadow-md`}
            >
              {primaryText}
            </button>
            {section.secondaryButtonText ? (
              <button
                type="button"
                className={`inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50`}
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>

          {section.visualHint ? (
            <div className="mt-12 w-full max-w-3xl">
              <div className="mx-auto flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400 sm:h-64">
                {section.visualHint}
              </div>
            </div>
          ) : null}
        </div>
      </SectionShell>
    );
  }

  // ── Split layout (text left, visual right) ──
  if (layout === "split") {
    return (
      <SectionShell bg="bg-white" spacing="airy" divider={false}>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          {/* Left: text */}
          <div className="flex flex-1 flex-col items-start text-left">
            {section.badge ? (
              <span
                className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}
              >
                {section.badge}
              </span>
            ) : null}

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              {section.title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
              {section.subtitle}
            </p>

            {hasStats ? (
              <div className="mt-6 flex gap-8">
                {section.stats!.map((s) => (
                  <div key={s.label}>
                    <p className={`text-xl font-bold sm:text-2xl ${theme.text}`}>{s.value}</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={`inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] ${theme.button} ${theme.buttonHover} shadow-sm hover:shadow-md`}
              >
                {primaryText}
              </button>
              {section.secondaryButtonText ? (
                <button
                  type="button"
                  className={`inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50`}
                >
                  {section.secondaryButtonText}
                </button>
              ) : null}
            </div>
          </div>

          {/* Right: visual */}
          <div className="flex flex-1 items-center justify-center">
            <div className="flex h-64 w-full max-w-md items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400 sm:h-80">
              {section.visualHint ?? "视觉区域"}
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Visual layout (full-bleed hero) ──
  return (
    <SectionShell bg={`${theme.softBg} bg-gradient-to-b ${theme.gradient}`} spacing="airy" divider={false}>
      <div className="flex flex-col items-center text-center">
        {section.badge ? (
          <span
            className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}
          >
            {section.badge}
          </span>
        ) : null}

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
          {section.title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
          {section.subtitle}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            className={`inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] ${theme.button} ${theme.buttonHover} shadow-sm hover:shadow-md`}
          >
            {primaryText}
          </button>
          {section.secondaryButtonText ? (
            <button
              type="button"
              className={`inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50`}
            >
              {section.secondaryButtonText}
            </button>
          ) : null}
        </div>

        {hasStats ? (
          <div className="mt-10 w-full max-w-2xl">
            <div className="rounded-2xl border border-slate-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur">
              <StatsBlock stats={section.stats!} accentClass={theme.text} />
            </div>
          </div>
        ) : null}

        {section.visualHint ? (
          <div className="mt-10 w-full max-w-4xl">
            <div className="mx-auto flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 text-sm text-slate-400 sm:h-64">
              {section.visualHint}
            </div>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
