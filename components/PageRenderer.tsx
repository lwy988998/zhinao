import type { PageContent, PageSection, CTASection } from "@/types/page";
import { getThemeClasses, getDesignTokens } from "@/lib/theme";
import { getPreset } from "@/lib/layoutPresets";
import type { LayoutPreset } from "@/lib/layoutPresets";
import { CTASectionView } from "@/components/sections/CTASectionView";
import { ContactSectionView } from "@/components/sections/ContactSectionView";
import { FAQSectionView } from "@/components/sections/FAQSectionView";
import { FeaturesSectionView } from "@/components/sections/FeaturesSectionView";
import { HeroSectionView } from "@/components/sections/HeroSectionView";
import { PainPointsSectionView } from "@/components/sections/PainPointsSectionView";
import { PricingSectionView } from "@/components/sections/PricingSectionView";
import { ProcessSectionView } from "@/components/sections/ProcessSectionView";
import { SolutionSectionView } from "@/components/sections/SolutionSectionView";
import { TestimonialsSectionView } from "@/components/sections/TestimonialsSectionView";

type Props = {
  content: PageContent;
  mode?: "preview" | "public";
};

function isRenderableSection(section: PageSection) {
  return section.visible !== false;
}

/** Picks an alternating background per section index + preset + design hint */
function sectionBg(
  index: number,
  section: PageSection,
  tokens: ReturnType<typeof getDesignTokens>,
  preset: LayoutPreset | undefined,
): string {
  // CTA with banner layout: it manages its own bg
  if (section.type === "cta" && (section as CTASection).layout !== "panel")
    return tokens.sectionBg.white;
  if (section.type === "hero") return tokens.sectionBg.white;

  // Section-level design.bg hint overrides everything
  const hint = section.design?.bg;
  if (hint === "dark") return tokens.sectionBg.dark;
  if (hint === "soft") return tokens.sectionBg.accent;
  if (hint === "none") return tokens.sectionBg.white;

  const bgStyle = preset?.backgroundStyle ?? "soft_alternating";

  switch (bgStyle) {
    case "bold_blocks": {
      // Bold alternation: accent → white → accent → soft → repeat
      const boldRhythm = [
        tokens.sectionBg.accent,
        tokens.sectionBg.white,
        tokens.sectionBg.accent,
        tokens.sectionBg.soft,
      ];
      return boldRhythm[index % boldRhythm.length];
    }
    case "white_only":
      return tokens.sectionBg.white;
    case "dark_accent": {
      const darkRhythm = [
        tokens.sectionBg.white,
        tokens.sectionBg.dark,
        tokens.sectionBg.white,
        tokens.sectionBg.soft,
      ];
      return darkRhythm[index % darkRhythm.length];
    }
    case "soft_alternating":
    default: {
      const softRhythm = [
        tokens.sectionBg.white,
        tokens.sectionBg.soft,
        tokens.sectionBg.white,
        tokens.sectionBg.accent,
        tokens.sectionBg.white,
        tokens.sectionBg.soft,
        tokens.sectionBg.white,
        tokens.sectionBg.accent,
      ];
      return softRhythm[index % softRhythm.length];
    }
  }
}

function renderSection(
  section: PageSection,
  theme: ReturnType<typeof getThemeClasses>,
) {
  const key = section.id ?? section.type;

  switch (section.type) {
    case "hero":
      return <HeroSectionView key={key} section={section} theme={theme} />;
    case "features":
      return <FeaturesSectionView key={key} section={section} theme={theme} />;
    case "pain_points":
      return <PainPointsSectionView key={key} section={section} />;
    case "solution":
      return <SolutionSectionView key={key} section={section} theme={theme} />;
    case "process":
      return <ProcessSectionView key={key} section={section} theme={theme} />;
    case "pricing":
      return <PricingSectionView key={key} section={section} theme={theme} />;
    case "testimonials":
      return <TestimonialsSectionView key={key} section={section} theme={theme} />;
    case "faq":
      return <FAQSectionView key={key} section={section} theme={theme} />;
    case "contact":
      return <ContactSectionView key={key} section={section} theme={theme} />;
    case "cta":
      return <CTASectionView key={key} section={section} theme={theme} />;
    default:
      return null;
  }
}

export function PageRenderer({ content, mode = "preview" }: Props) {
  const theme = getThemeClasses(content.theme.primaryColor);
  const tokens = getDesignTokens(content.theme.primaryColor);
  const preset = content.layoutPreset ? getPreset(content.layoutPreset) : undefined;
  const sections = content.sections.filter(isRenderableSection);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Info strip — only in preview */}
      {mode === "preview" && (
        <div className="mx-auto max-w-6xl px-5 pt-5 sm:px-8">
          <div className="mb-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-500 shadow-sm backdrop-blur">
            <span className="font-semibold text-slate-800">{content.pageTitle}</span>
            <span className="mx-2 text-slate-300">|</span>
            <span>
              {preset ? preset.name : content.pageType}
              {content.layoutPreset ? ` (${content.layoutPreset})` : ""}
            </span>
          </div>
        </div>
      )}

      {sections.length > 0 ? (
        sections.map((section, index) => {
          const bg = section.type === "cta" ? "" : sectionBg(index, section, tokens, preset);
          return (
            <div key={section.id ?? section.type} className={bg}>
              {renderSection(section, theme)}
            </div>
          );
        })
      ) : (
        <div className="flex items-center justify-center py-32">
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-10 py-16 text-center text-slate-400">
            当前页面没有可渲染的区块。
          </div>
        </div>
      )}
    </main>
  );
}
