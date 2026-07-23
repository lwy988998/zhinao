import type {
  ContactSection,
  CTASection,
  HeroSection,
  PageContent,
  PageSection,
  ThemeStyle,
  PrimaryColor,
} from "@/types/page";

//
// Top-level page fields
//

export function updatePageField<K extends "pageTitle" | "pageDescription">(
  content: PageContent,
  field: K,
  value: string,
): PageContent {
  return { ...content, [field]: value };
}

//
// Theme
//

export function updateThemeStyle(content: PageContent, style: ThemeStyle): PageContent {
  return { ...content, theme: { ...content.theme, style } };
}

export function updateThemeColor(content: PageContent, primaryColor: PrimaryColor): PageContent {
  return { ...content, theme: { ...content.theme, primaryColor } };
}

//
// Section-level updates (immutable)
//

function cloneSections(content: PageContent): PageSection[] {
  return content.sections.map((s) => ({ ...s } as unknown as PageSection));
}

function replaceSection(content: PageContent, index: number, section: PageSection): PageContent {
  const sections = cloneSections(content);
  sections[index] = section;
  return { ...content, sections };
}

//
// Hero section updates
//

export function updateHeroField<K extends "title" | "subtitle" | "buttonText" | "buttonAction">(
  content: PageContent,
  field: K,
  value: string,
): PageContent {
  const idx = content.sections.findIndex((s) => s.type === "hero");
  if (idx === -1) return content;
  const section = { ...content.sections[idx], [field]: value } as unknown as HeroSection;
  // Also keep buttonText when the old primaryButtonText alias existed
  if (field === "buttonText") {
    (section as unknown as Record<string, unknown>)["primaryButtonText"] = value;
  }
  return replaceSection(content, idx, section);
}

//
// CTA section updates
//

export function updateCTAField<K extends "title" | "description" | "buttonText" | "buttonAction">(
  content: PageContent,
  field: K,
  value: string,
): PageContent {
  const idx = content.sections.findIndex((s) => s.type === "cta");
  if (idx === -1) return content;
  const section = { ...content.sections[idx], [field]: value } as unknown as CTASection;
  return replaceSection(content, idx, section);
}

//
// Contact section updates
//

export function updateContactField<K extends "title" | "description" | "wechat" | "phone" | "email" | "address">(
  content: PageContent,
  field: K,
  value: string,
): PageContent {
  const idx = content.sections.findIndex((s) => s.type === "contact");
  if (idx === -1) return content;
  const section = { ...content.sections[idx], [field]: value } as unknown as ContactSection;
  return replaceSection(content, idx, section);
}

//
// Generic section updates (by index)
//

export function updateSectionTitle(content: PageContent, index: number, value: string): PageContent {
  if (index < 0 || index >= content.sections.length) return content;
  const section = { ...content.sections[index], title: value } as unknown as PageSection;
  return replaceSection(content, index, section);
}

const DESCRIPTION_SECTION_TYPES = new Set([
  "hero",
  "solution",
  "contact",
  "cta",
]);

const SUBTITLE_SECTION_TYPES = new Set(["features"]);

export function updateSectionDescription(content: PageContent, index: number, value: string): PageContent {
  if (index < 0 || index >= content.sections.length) return content;
  const section = content.sections[index];
  const clone = { ...section } as unknown as Record<string, unknown>;

  if (DESCRIPTION_SECTION_TYPES.has(section.type)) {
    clone.description = value;
  } else if (SUBTITLE_SECTION_TYPES.has(section.type)) {
    clone.subtitle = value;
  }

  return replaceSection(content, index, clone as unknown as PageSection);
}

//
// Visibility toggle
//

export function toggleSectionVisible(content: PageContent, index: number): PageContent {
  if (index < 0 || index >= content.sections.length) return content;
  const section = content.sections[index];

  // hero and cta must stay visible
  if (section.type === "hero" || section.type === "cta") return content;

  const visible = section.visible ?? true;
  return replaceSection(content, index, { ...section, visible: !visible });
}

//
// Reorder
//

export function moveSectionUp(content: PageContent, index: number): PageContent {
  if (index <= 0 || index >= content.sections.length) return content;

  const sections = cloneSections(content);
  const prev = sections[index - 1];

  // Prevent moving hero out of position 0
  if (prev.type === "hero") return content;

  // CTA must stay last
  const current = sections[index];
  if (current.type === "cta") return content;

  [sections[index - 1], sections[index]] = [sections[index], sections[index - 1]];
  return { ...content, sections };
}

export function moveSectionDown(content: PageContent, index: number): PageContent {
  if (index < 0 || index >= content.sections.length - 1) return content;

  const current = content.sections[index];
  const next = content.sections[index + 1];

  // Prevent moving cta out of last position
  if (next.type === "cta") return content;

  // Hero must stay first
  if (current.type === "hero") return content;

  const sections = cloneSections(content);
  [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
  return { ...content, sections };
}
