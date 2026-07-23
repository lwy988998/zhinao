import type { TestimonialsSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { InteractiveCarousel } from "@/components/interactive/InteractiveCarousel";
import type { CarouselSlideData } from "@/components/interactive/InteractiveCarousel";
import { InteractiveTabs } from "@/components/interactive/InteractiveTabs";
import type { TabData } from "@/components/interactive/InteractiveTabs";

type Props = {
  section: TestimonialsSection;
  theme: ThemeClasses;
};

export function TestimonialsSectionView({ section, theme }: Props) {
  const items = section.items ?? [];
  const layout = section.layout ?? "cards";
  const interactionType = section.interactionType ?? "none";

  // ── Interactive: Carousel ──
  if (interactionType === "carousel" && section.carouselSlides && section.carouselSlides.length > 0) {
    const slides: CarouselSlideData[] = section.carouselSlides.map((s) => ({
      title: s.title,
      description: s.description,
      meta: s.meta,
      highlights: s.highlights,
      items: (s.items ?? []).map((ti) => ({
        title: ti.name,
        description: ti.content,
      })),
    }));

    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-2xl">
          <InteractiveCarousel slides={slides} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Interactive: Tabs ──
  if (interactionType === "tabs" && section.tabs && section.tabs.length > 0) {
    const tabData: TabData[] = section.tabs.map((t) => ({
      label: t.label,
      title: t.title ?? t.label,
      description: t.description,
      items: (t.items ?? []).map((ti) => ({
        title: ti.name,
        description: ti.content,
      })),
    }));

    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="mx-auto max-w-3xl">
          <InteractiveTabs tabs={tabData} accentClass={theme.text} />
        </div>
      </SectionShell>
    );
  }

  // ── Cards layout ──
  if (layout === "cards") {
    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.name} className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm">
              <div className="mb-3 flex gap-0.5 text-amber-400 text-sm">{"★".repeat(5)}</div>
              <blockquote className="text-sm leading-6 text-slate-600">&ldquo;{item.content}&rdquo;</blockquote>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                {item.avatar ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500">{item.name[0]}</div>
                ) : (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.softBg} text-xs font-semibold ${theme.text}`}>{item.name[0]}</div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  {item.role ? <p className="text-xs text-slate-500">{item.role}</p> : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Quote layout ──
  if (layout === "quote") {
    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="space-y-6">
          {items.slice(0, 3).map((item) => (
            <blockquote key={item.name} className="mx-auto max-w-3xl rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm sm:p-8">
              <p className={`text-4xl leading-none ${theme.text}`}>&ldquo;</p>
              <p className="-mt-2 text-lg leading-relaxed text-slate-700 sm:text-xl">{item.content}</p>
              <footer className="mt-5">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                {item.role ? <p className="text-xs text-slate-500">{item.role}</p> : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Editorial layout ──
  if (layout === "editorial") {
    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="space-y-5">
          {items.slice(0, 4).map((item, i) => (
            <blockquote key={item.name} className="mx-auto max-w-3xl rounded-2xl border border-stone-300 bg-white p-7 shadow-sm sm:p-10" style={{ transform: `rotate(${(i % 2 === 0 ? 0.5 : -0.5)}deg)` }}>
              <div className="flex items-start gap-4">
                <span className="shrink-0 text-5xl leading-none text-stone-200">&ldquo;</span>
                <div>
                  <p className="text-base leading-relaxed text-slate-700 sm:text-lg">{item.content}</p>
                  <footer className="mt-5 border-t border-stone-100 pt-4">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    {item.role ? <p className="text-xs text-stone-500">{item.role}</p> : null}
                  </footer>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </SectionShell>
    );
  }

  // ── Avatars layout ──
  if (layout === "avatars") {
    return (
      <SectionShell bg="bg-slate-50">
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
          {section.description ? (
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.name} className="text-center">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${theme.softBg} text-lg font-semibold ${theme.text}`}>{item.name[0]}</div>
              <p className="mt-3 text-xs leading-5 text-slate-600">&ldquo;{item.content.slice(0, 60)}{item.content.length > 60 ? "…" : ""}&rdquo;</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
              {item.role ? <p className="text-xs text-slate-500">{item.role}</p> : null}
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  return null;
}
