import type { PageContent } from "@/types/page";

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

export function isValidPageContent(input: unknown): input is PageContent {
  if (!isRecord(input)) {
    return false;
  }

  return (
    typeof input.pageTitle === "string" &&
    typeof input.pageDescription === "string" &&
    Array.isArray(input.sections) &&
    isRecord(input.theme) &&
    isRecord(input.seo) &&
    isRecord(input.contactAction)
  );
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
