import type { GallerySection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "@/components/sections/SectionShell";

type Props = {
  section: GallerySection;
  theme: ThemeClasses;
};

/** Abstract placeholder pattern when no imageUrl */
function Placeholder({ index }: { index: number }) {
  const patterns = [
    "radial-gradient(circle at 30% 40%, #e2e8f0 1px, transparent 1px) 0 0 / 20px 20px",
    "repeating-linear-gradient(45deg, #f1f5f9 0, #f1f5f9 3px, transparent 3px, transparent 10px)",
    "repeating-linear-gradient(0deg, #e2e8f0 0, #e2e8f0 1px, transparent 1px, transparent 12px)",
    "conic-gradient(from 90deg at 50% 50%, #f1f5f9 0deg, #e2e8f0 90deg, #f1f5f9 180deg, #e2e8f0 270deg) 0 0 / 30px 30px",
  ];
  return (
    <div
      className="h-40 w-full rounded-xl"
      style={{ background: patterns[index % patterns.length] }}
    />
  );
}

export function GallerySectionView({ section, theme: _theme }: Props) {
  const items = section.items ?? [];

  return (
    <SectionShell bg="bg-white">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{section.title}</h2>
        {section.description ? (
          <p className="mt-2 text-sm text-slate-500">{section.description}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <article
            key={item.title}
            className="group cursor-default overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Image area */}
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <Placeholder index={i} />
            )}

            {/* Meta */}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                {item.tag ? (
                  <span className="shrink-0 rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                    {item.tag}
                  </span>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
