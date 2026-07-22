import type { PageContent, PageSection } from "@/types/page";
import { getThemeClasses } from "@/lib/theme";
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

function renderSection(section: PageSection, theme: ReturnType<typeof getThemeClasses>) {
  const key = section.id ?? section.type;

  switch (section.type) {
    case "hero":
      return <HeroSectionView key={key} section={section} theme={theme} />;
    case "features":
      return <FeaturesSectionView key={key} section={section} theme={theme} />;
    case "pain_points":
      return <PainPointsSectionView key={key} section={section} theme={theme} />;
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
  const sections = content.sections.filter(isRenderableSection);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <span className="font-medium text-slate-900">{content.pageTitle}</span>
          <span className="mx-2 text-slate-300">|</span>
          <span>{mode === "preview" ? "预览模式" : "公开模式"}</span>
        </div>

        {sections.length > 0 ? (
          <div className="space-y-0">
            {sections.map((section) => renderSection(section, theme))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center text-slate-500">
            当前页面没有可渲染的区块。
          </div>
        )}
      </div>
    </main>
  );
}
