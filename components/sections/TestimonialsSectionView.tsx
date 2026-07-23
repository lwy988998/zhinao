import type { TestimonialsSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: TestimonialsSection;
  theme: ThemeClasses;
};

export function TestimonialsSectionView({ section, theme }: Props) {
  const items = section.items ?? [];
  const layout = section.layout ?? "cards";

  return (
    <SectionShell bg="bg-slate-50">
      {/* Section header */}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm"
            >
              {/* Stars decoration */}
              <div className="mb-3 flex gap-0.5 text-amber-400 text-sm">
                {"★".repeat(5)}
              </div>
              <blockquote className="text-sm leading-6 text-slate-600">
                &ldquo;{item.content}&rdquo;
              </blockquote>
              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                {item.avatar ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500">
                    {item.name[0]}
                  </div>
                ) : (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.softBg} text-xs font-semibold ${theme.text}`}>
                    {item.name[0]}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  {item.role ? (
                    <p className="text-xs text-slate-500">{item.role}</p>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ── Quote layout (large emphasis quote) ── */}
      {layout === "quote" && (
        <div className="space-y-6">
          {items.slice(0, 3).map((item) => (
            <blockquote
              key={item.name}
              className="mx-auto max-w-3xl rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm sm:p-8"
            >
              <p className={`text-4xl leading-none ${theme.text}`}>&ldquo;</p>
              <p className="-mt-2 text-lg leading-relaxed text-slate-700 sm:text-xl">
                {item.content}
              </p>
              <footer className="mt-5">
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                {item.role ? (
                  <p className="text-xs text-slate-500">{item.role}</p>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      )}

      {/* ── Avatars layout (compact, centered) ── */}
      {layout === "avatars" && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.name} className="text-center">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${theme.softBg} text-lg font-semibold ${theme.text}`}
              >
                {item.name[0]}
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-600">&ldquo;{item.content.slice(0, 60)}{item.content.length > 60 ? "…" : ""}&rdquo;</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{item.name}</p>
              {item.role ? (
                <p className="text-xs text-slate-500">{item.role}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}
