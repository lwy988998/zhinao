"use client";

import type { HeroSection, PageContent } from "@/types/page";
import { SectionShell } from "./SectionShell";
import type { ThemeClasses } from "@/lib/theme";
import { InteractiveCarousel } from "@/components/interactive/InteractiveCarousel";
import type { CarouselSlideData } from "@/components/interactive/InteractiveCarousel";
import { InteractiveModal } from "@/components/interactive/InteractiveModal";
import { scrollToContact, copyText, isExternalUrl, openLink } from "@/lib/actionUtils";

type Props = {
  section: HeroSection;
  theme: ThemeClasses;
  content?: PageContent;
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

function handleButtonAction(section: HeroSection, fallback: string) {
  const val = section.buttonAction || fallback;

  if (val && isExternalUrl(val)) {
    openLink(val);
    return;
  }

  if (val && val.length > 3 && !val.startsWith("#")) {
    copyText(val, section.buttonText || section.primaryButtonText);
    return;
  }

  scrollToContact();
}

export function HeroSectionView({ section, theme, content }: Props) {
  const layout = section.layout ?? "center";
  const primaryText = section.buttonText || section.primaryButtonText;
  const heroImageUrl = section.mediaUrl || content?.assets?.heroImageUrl;
  const navigationItems = content?.navigation?.items ?? [];
  const hasStats = section.stats && section.stats.length > 0;
  const interactionType = section.interactionType ?? "none";

  // ── Interactive: Modal on CTA ──
  const renderCTA = () => {
    if (interactionType === "modal" && section.modalTitle) {
      return (
        <InteractiveModal
          triggerLabel={primaryText ?? "了解更多"}
          title={section.modalTitle}
          description={section.modalDescription}
          highlights={section.modalHighlights}
          items={section.modalItems}
          actionLabel={section.modalActionLabel}
          actionValue={section.modalActionValue}
          triggerClassName="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] bg-slate-950 text-white shadow-sm hover:shadow-md hover:bg-slate-800"
        />
      );
    }
    return (
      <button
        type="button"
        onClick={() => handleButtonAction(section, section.buttonAction)}
        className="inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] bg-slate-950 text-white shadow-sm hover:shadow-md hover:bg-slate-800 cursor-pointer"
      >
        {primaryText}
      </button>
    );
  };

  // ── Interactive: Carousel below hero ──
  const renderInteractiveContent = () => {
    if (interactionType === "carousel" && section.interactiveItems && section.interactiveItems.length > 0) {
      const slides: CarouselSlideData[] = section.interactiveItems.map((item) => ({
        title: item.title,
        description: item.description,
        highlights: item.highlights,
        items: item.details?.items?.map((di) => ({
          title: di.title,
          description: di.description,
          value: di.value,
          meta: di.meta,
          status: di.status,
        })),
      }));
      return (
        <div className="mt-10 mx-auto max-w-2xl">
          <InteractiveCarousel slides={slides} accentClass={theme.text} />
        </div>
      );
    }
    if (interactionType === "carousel") {
      return null;
    }
    return null;
  };

  // ── Fullscreen image layout ──
  if (layout === "fullscreen_image") {
    const overlay = section.overlay ?? "gradient";
    const overlayClass = overlay === "light"
      ? "bg-white/35"
      : overlay === "dark"
        ? "bg-slate-950/55"
        : "bg-gradient-to-r from-slate-950/72 via-slate-950/32 to-transparent";

    const scrollNext = () => {
      const current = document.getElementById(section.id ?? "hero");
      const next = current?.nextElementSibling as HTMLElement | null;
      if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const scrollToNavTarget = (targetSectionId?: string) => {
      if (!targetSectionId) return;
      const el = document.getElementById(targetSectionId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
      <section className="relative min-h-[88vh] overflow-hidden bg-[#191713] text-white sm:min-h-screen">
        {heroImageUrl ? (
          <img src={heroImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(120deg,#17130f_0%,#4a4034_42%,#e7ded0_100%)]" />
        )}
        <div className={`absolute inset-0 ${overlayClass}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_32%),linear-gradient(180deg,rgba(0,0,0,0.25)_0%,transparent_28%,rgba(0,0,0,0.35)_100%)]" />

        {navigationItems.length ? (
          <nav className="absolute left-0 right-0 top-0 z-20 border-b border-white/12 bg-black/10 px-5 py-4 backdrop-blur-sm sm:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
              <span className="min-w-0 truncate text-sm font-semibold tracking-[0.24em] text-white/90">{content?.pageTitle ?? section.title}</span>
              <div className="hidden items-center gap-5 lg:flex">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToNavTarget(item.targetSectionId)}
                    className="text-xs font-medium tracking-[0.18em] text-white/72 transition hover:text-white"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        ) : null}

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-5 pb-20 pt-28 sm:min-h-screen sm:px-8 lg:pt-32">
          <div className="max-w-3xl text-left">
            {section.kicker ? <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-white/60">{section.kicker}</p> : null}
            {section.badge ? <span className="mb-6 inline-flex border border-white/30 px-3 py-1 text-xs font-medium tracking-[0.18em] text-white/80">{section.badge}</span> : null}
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal text-white sm:text-7xl lg:text-8xl">{section.title}</h1>
            {section.subtitle ? <p className="mt-7 max-w-xl text-base leading-8 text-white/72 sm:text-lg">{section.subtitle}</p> : null}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {interactionType === "modal" && section.modalTitle ? (
                <InteractiveModal
                  triggerLabel={primaryText ?? "了解更多"}
                  title={section.modalTitle}
                  description={section.modalDescription}
                  highlights={section.modalHighlights}
                  items={section.modalItems}
                  actionLabel={section.modalActionLabel}
                  actionValue={section.modalActionValue}
                  triggerClassName="inline-flex h-12 items-center justify-center border border-white bg-white px-8 text-sm font-medium text-slate-950 transition active:scale-[0.98] hover:bg-transparent hover:text-white"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => handleButtonAction(section, section.buttonAction)}
                  className="inline-flex h-12 items-center justify-center border border-white bg-white px-8 text-sm font-medium text-slate-950 transition active:scale-[0.98] hover:bg-transparent hover:text-white cursor-pointer"
                >
                  {primaryText}
                </button>
              )}
              {section.secondaryButtonText ? (
                <button
                  type="button"
                  onClick={scrollNext}
                  className="inline-flex h-12 items-center justify-center border border-white/35 px-8 text-sm font-medium text-white transition active:scale-[0.98] hover:bg-white/10 cursor-pointer"
                >
                  {section.secondaryButtonText}
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute bottom-7 left-1/2 z-20 flex h-11 w-11 -translate-x-1/2 items-center justify-center border border-white/35 text-white/75 transition hover:bg-white/10 hover:text-white"
          aria-label="滚动到下一屏"
        >
          ↓
        </button>
      </section>
    );
  }

  // ── Center layout ──
  if (layout === "center") {
    return (
      <SectionShell bg="bg-white" spacing="airy" divider={false}>
        <div className="flex flex-col items-center text-center">
          {section.badge ? (
            <span className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}>
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
            {renderCTA()}
            {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>

          {renderInteractiveContent()}

          {!interactionType.startsWith("interactive") && section.visualHint ? (
            <div className="mt-12 w-full max-w-3xl">
              {heroImageUrl ? (
                <img
                  src={heroImageUrl}
                  alt=""
                  className="mx-auto h-48 w-full rounded-2xl object-cover shadow-lg sm:h-64"
                  loading="lazy"
                />
              ) : (
                <div className="mx-auto flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400 sm:h-64">
                  {section.visualHint}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </SectionShell>
    );
  }

  // ── Split layout ──
  if (layout === "split") {
    return (
      <SectionShell bg="bg-white" spacing="airy" divider={false}>
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <div className="flex flex-1 flex-col items-start text-left">
            {section.badge ? (
              <span className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}>
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
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {renderCTA()}
              {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            {heroImageUrl ? (
              <img src={heroImageUrl} alt="" className="h-64 w-full max-w-md rounded-2xl object-cover shadow-lg sm:h-80" loading="lazy" />
            ) : (
              <div className="flex h-64 w-full max-w-md items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 text-sm text-slate-400 sm:h-80">
                {section.visualHint ?? "视觉区域"}
              </div>
            )}
          </div>
        </div>
        {renderInteractiveContent()}
      </SectionShell>
    );
  }

  // ── Manifesto layout ──
  if (layout === "manifesto") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="relative flex flex-col items-center text-center py-8 sm:py-16">
          {section.mediaUrl ? (
            <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-30">
              <img
                src={section.mediaUrl}
                alt=""
                className="h-full w-full object-cover blur-sm"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-950/70" />
            </div>
          ) : null}
          {section.kicker ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/50">{section.kicker}</p>
          ) : null}
          {section.badge ? (
            <span className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">{section.badge}</span>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">{section.title}</h1>
          {section.subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">{section.subtitle}</p>
          ) : null}
          {hasStats ? (
            <div className="mt-10 flex flex-wrap justify-center gap-8 sm:gap-12">
              {section.stats!.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-bold text-white sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">{s.label}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {interactionType === "modal" && section.modalTitle ? (
              <InteractiveModal
                triggerLabel={primaryText ?? "了解更多"}
                title={section.modalTitle}
                description={section.modalDescription}
                highlights={section.modalHighlights}
                items={section.modalItems}
                actionLabel={section.modalActionLabel}
                actionValue={section.modalActionValue}
                triggerClassName="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-slate-100"
              />
            ) : (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-slate-100 cursor-pointer"
              >
                {primaryText}
              </button>
            )}
            {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-[0.97] hover:border-white/40 hover:bg-white/5 cursor-pointer"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Collage layout ──
  if (layout === "collage") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-14">
          <div className="flex flex-1 flex-col items-start text-left">
            {section.kicker ? (
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">{section.kicker}</p>
            ) : null}
            {section.badge ? (
              <span className="mb-4 inline-flex items-center rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{section.badge}</span>
            ) : null}
            <h1 className="max-w-xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">{section.title}</h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-500 sm:text-lg">{section.subtitle}</p>
            {hasStats ? (
              <div className="mt-6 flex gap-8">
                {section.stats!.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-slate-900 sm:text-2xl">{s.value}</p>
                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            ) : null}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {renderCTA()}
              {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:bg-slate-50 cursor-pointer"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-64 w-56 sm:h-80 sm:w-64">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute inset-0 overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-lg"
                  style={{ transform: `rotate(${(i - 1) * 3}deg) translateY(${i * 4}px) translateX(${i * 6}px)`, zIndex: 3 - i }}
                >
                  <div className="flex h-full items-center justify-center p-4">
                    <div className="text-center text-stone-300">
                      <div className="mx-auto mb-2 h-24 w-20 rounded-lg bg-stone-100" />
                      <div className="mx-auto h-2 w-16 rounded bg-stone-100" />
                    </div>
                  </div>
                </div>
              ))}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-xl" style={{ zIndex: 4 }}>
                {heroImageUrl ? (
                  <img src={heroImageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-center text-stone-400">
                    <div className="mx-auto mb-2 flex h-24 w-20 items-center justify-center rounded-lg bg-stone-50 text-3xl">✦</div>
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

  // ── Immersive layout ──
  if (layout === "immersive") {
    return (
      <SectionShell bg="bg-transparent" spacing="airy" divider={false}>
        <div className="flex flex-col items-center text-center py-6 sm:py-20">
          {section.kicker ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/50">{section.kicker}</p>
          ) : null}
          {section.badge ? (
            <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">{section.badge}</span>
          ) : null}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{section.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">{section.subtitle}</p>
          {hasStats ? (
            <div className="mt-8 w-full max-w-2xl">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 shadow-sm backdrop-blur">
                <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
                  {section.stats!.map((s) => (
                    <div key={s.label} className="text-center">
                      <p className="text-2xl font-bold text-white sm:text-3xl">{s.value}</p>
                      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {interactionType === "modal" && section.modalTitle ? (
              <InteractiveModal
                triggerLabel={primaryText ?? "了解更多"}
                title={section.modalTitle}
                description={section.modalDescription}
                highlights={section.modalHighlights}
                items={section.modalItems}
                actionLabel={section.modalActionLabel}
                actionValue={section.modalActionValue}
                triggerClassName="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-white/90"
              />
            ) : (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-white/90 cursor-pointer"
              >
                {primaryText}
              </button>
            )}
            {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-8 text-sm font-medium text-white transition-all active:scale-[0.97] hover:border-white/40 cursor-pointer"
              >
                {section.secondaryButtonText}
              </button>
            ) : null}
          </div>
        </div>
      </SectionShell>
    );
  }

  // ── Visual layout ──
  return (
    <SectionShell bg={`${theme.softBg} bg-gradient-to-b ${theme.gradient}`} spacing="airy" divider={false}>
      <div className="flex flex-col items-center text-center">
        {section.badge ? (
          <span className={`mb-5 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${theme.border} ${theme.text} ${theme.softBg}`}>
            {section.badge}
          </span>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">{section.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">{section.subtitle}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {renderCTA()}
          {section.secondaryButtonText ? (
              <button
                type="button"
                onClick={() => handleButtonAction(section, section.buttonAction)}
                className="inline-flex h-12 items-center justify-center rounded-full border px-8 text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-300 hover:bg-slate-50 cursor-pointer"
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
        {heroImageUrl ? (
          <div className="mt-10 w-full max-w-4xl">
            <img
              src={heroImageUrl}
              alt=""
              className="mx-auto h-56 w-full rounded-2xl object-cover shadow-lg sm:h-72"
              loading="lazy"
            />
          </div>
        ) : section.visualHint ? (
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
