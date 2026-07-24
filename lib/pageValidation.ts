import type {
  ContactActionType,
  PageContent,
  PageSection,
  PageType,
  PrimaryColor,
  ThemeStyle,
} from "@/types/page";

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPageType(value: unknown): value is PageType {
  return value === "personal_profile" || value === "product_service" || value === "local_business" || value === "event_signup" || value === "course_sales";
}

function isThemeStyle(value: unknown): value is ThemeStyle {
  return value === "minimal" || value === "business" || value === "elegant" || value === "tech" || value === "youthful";
}

function isPrimaryColor(value: unknown): value is PrimaryColor {
  return value === "blue" || value === "green" || value === "purple" || value === "orange" || value === "black_gold" || value === "pink";
}

function isContactActionType(value: unknown): value is ContactActionType {
  return value === "wechat" || value === "phone" || value === "form" || value === "link" || value === "email";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isSection(section: unknown): section is PageSection {
  if (!isRecord(section) || typeof section.type !== "string") {
    return false;
  }

  if (typeof section.title !== "string" && section.title !== undefined) {
    return false;
  }

  const knownTypes = new Set([
    "hero",
    "features",
    "pain_points",
    "solution",
    "process",
    "pricing",
    "testimonials",
    "faq",
    "contact",
    "cta",
    "app_preview",
    "dashboard",
    "timeline",
    "gallery",
  ]);

  return knownTypes.has(section.type);
}

export function isValidPageContent(input: unknown): input is PageContent {
  if (!isRecord(input)) {
    return false;
  }

  const contactAction = isRecord(input.contactAction) ? input.contactAction : null;
  const theme = isRecord(input.theme) ? input.theme : null;
  const seo = isRecord(input.seo) ? input.seo : null;
  const sections = Array.isArray(input.sections) ? input.sections : null;

  return (
    isNonEmptyString(input.pageTitle) &&
    isNonEmptyString(input.pageDescription) &&
    isPageType(input.pageType) &&
    isRecord(theme) &&
    isThemeStyle(theme.style) &&
    isPrimaryColor(theme.primaryColor) &&
    typeof theme.fontStyle === "string" &&
    isRecord(seo) &&
    isNonEmptyString(seo.title) &&
    isNonEmptyString(seo.description) &&
    (seo.keywords === undefined || isStringArray(seo.keywords)) &&
    isRecord(contactAction) &&
    isContactActionType(contactAction.type) &&
    isNonEmptyString(contactAction.label) &&
    isNonEmptyString(contactAction.value) &&
    Array.isArray(sections) &&
    sections.length >= 1 &&
    sections.length <= 20 &&
    sections.some((section) => isRecord(section) && section.type === "hero") &&
    sections.some((section) => isRecord(section) && section.type === "cta") &&
    sections.filter(isSection).length > 0
  );
}

export function normalizeVisibleSections(content: PageContent): PageContent {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      visible: section.visible ?? true,
    })),
  };
}

export function ensureVisibleSections(content: PageContent): PageContent {
  return {
    ...content,
    sections: content.sections.map((section) => {
      const sectionWithOptionalVisible = section as PageContent["sections"][number] & {
        visible?: boolean;
      };

      return {
        ...section,
        visible: sectionWithOptionalVisible.visible ?? true,
      };
    }),
  };
}
