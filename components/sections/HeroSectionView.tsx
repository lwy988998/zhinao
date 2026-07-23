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
            {section.mediaUrl ? (
              <img
                src={section.mediaUrl}
                alt=""
                className="h-64 w-full max-w-md rounded-2xl object-cover shadow-lg sm:h-80"
                loading="lazy"
              />
            ) : (
              <div className="flex h-64 w-full max-w-md items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400 sm:h-80">
                {section.visualHint ?? "视觉区域"}
              </div>
            )}
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Manifesto layout (dark, bold, opinionated) ──
  if (layout === "manifesto") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="flex flex-col items-center text-center py-8 sm:py-16">
          {section.kicker ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
              {section.kicker}
            </p>
          ) : null}

          {section.badge ? (
            <span className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              {section.badge}
            </span>
          ) : null}

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            {section.title}
          </h1>

          {section.subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {section.subtitle}
            </p>
          ) : null}

          {hasStats ? (
            <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12">
              {section.stats!.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-white sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-slate-100"
            >
              {primaryText}
            </button>
            {section.secondaryButtonText ? (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-[0.97] hover:border-white/40 hover:bg-white/5"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Collage layout (editorial, layered paper feel) ──
  if (layout === "collage") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-14">
          {/* Left: text */}
          <div className="flex flex-1 flex-col items-start text-left">
            {section.kicker ? (
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                {section.kicker}
              </p>
            ) : null}

            {section.badge ? (
              <span className="mb-4 inline-flex items-center rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                {section.badge}
              </span>
            ) : null}

            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {section.title}
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">
              {section.subtitle}
            </p>

            {hasStats ? (
              <div className="mt-6 flex gap-8">
                {section.stats!.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-slate-900 sm:text-2xl">{s.value}</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className={`inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] ${theme.button} ${theme.buttonHover}`}
              >
                {primaryText}
              </button>
              {section.secondaryButtonText ? (
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:bg-slate-50"
                >
                  {section.secondaryButtonText}
                </button>
              ) : null}
            </div>
          </div>

          {/* Right: layered paper cards */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-64 w-56 sm:h-80 sm:w-64">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-lg"
                  style={{
                    transform: `rotate(${(i - 1) * 3}deg) translateY(${i * 4}px) translateX(${i * 6}px)`,
                    zIndex: 3 - i,
                  }}
                >
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="text-center text-stone-300">
                      <div className="mx-auto mb-2 h-24 w-20 rounded-lg bg-stone-100" />
                      <div className="mx-auto h-2 w-16 rounded bg-stone-100" />
                    </div>
                  </div>
                </div>
              ))}
              {/* Top card — hero visual or media image */}
              <div
                className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-xl"
                style={{ zIndex: 4 }}
              >
                {section.mediaUrl ? (
                  <img
                    src={section.mediaUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center text-stone-400">
                    <div className="mx-auto mb-2 flex h-24 w-20 items-center justify-center rounded-lg bg-stone-50 text-3xl">
                      ✦
                    </div>
                    <p className="text-xs">{section.visualHint ?? "作品集"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Immersive layout (centered, for particle backgrounds) ──
  if (layout === "immersive") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="flex flex-col items-center text-center py-6 sm:py-20">
          {section.kicker ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/50">
              {section.kicker}
            </p>
          ) : null}

          {section.badge ? (
            <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              {section.badge}
            </span>
          ) : null}

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {section.title}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            {section.subtitle}
          </p>

          {hasStats ? (
            <div className="mt-8 w-full max-w-2xl">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 shadow-sm backdrop-blur">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                  {section.stats!.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-white/90"
            >
              {primaryText}
            </button>
            {section.secondaryButtonText ? (
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-[0.97] hover:border-white/40"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
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
