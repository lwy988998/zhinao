import { getTemplateById } from "@/lib/templates";
import { searchWebAssets, type SearchAsset } from "@/lib/webSearch";
import type { AssetSource, GallerySection, PageContent, PageType } from "@/types/page";

type FindPageImagesParams = {
  pageTitle: string;
  pageType: PageType;
  templateId?: string;
  imageSearchHints?: string[];
};

type FoundPageImages = {
  heroImageUrl?: string;
  galleryImageUrls?: string[];
  iconImageUrls?: string[];
  sources: AssetSource[];
  inspirationSummary?: string;
};

const pageTypeHints: Record<PageType, string> = {
  personal_profile: "portrait portfolio brand photography",
  product_service: "product service website hero visual",
  local_business: "local business interior lifestyle photography",
  event_signup: "event campaign registration visual",
  course_sales: "online course workshop learning visual",
};

function uniqueStrings(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim())))).slice(0, 10);
}

function pickImageUrls(results: SearchAsset[]): string[] {
  return uniqueStrings(results.map((asset) => asset.imageUrl ?? asset.url)).filter((url) => /^https?:\/\//i.test(url));
}

function toSource(asset: SearchAsset, type: AssetSource["type"], index: number): AssetSource {
  return {
    id: `${type ?? "asset"}-${index + 1}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: asset.title,
    source: asset.source,
    url: asset.url,
    imageUrl: asset.imageUrl ?? asset.url,
    licenseHint: asset.licenseHint,
    provider: asset.provider ?? asset.source,
    createdAt: new Date().toISOString(),
  };
}

export async function findPageImages(params: FindPageImagesParams): Promise<FoundPageImages> {
  const template = getTemplateById(params.templateId);
  const hints = uniqueStrings([
    ...(params.imageSearchHints ?? []),
    ...(template?.imageSearchHints ?? []),
    pageTypeHints[params.pageType],
  ]);

  const styleHints = template
    ? `${template.style} ${template.backgroundMode} ${template.primaryColor} design`
    : "";

  const baseQuery = uniqueStrings([
    params.pageTitle.slice(0, 30),
    hints.slice(0, 3).join(" "),
    styleHints,
  ]).join(" ");

  const queries = uniqueStrings([
    `${baseQuery} high quality hero no logo no watermark no brand`,
    `${hints.slice(1, 5).join(" ")} gallery reference no logo`,
    `${hints.slice(0, 3).join(" ")} ${styleHints} no logo no brand`,
  ]);

  try {
    const [heroResults, galleryResults, styleResults] = await Promise.all([
      searchWebAssets({ query: queries[0], count: 6, type: "image" }),
      searchWebAssets({ query: queries[1] ?? queries[0], count: 8, type: "image" }),
      searchWebAssets({ query: queries[2] ?? queries[0], count: 4, type: "image" }),
    ]);

    const heroUrls = pickImageUrls(heroResults);
    const galleryUrls = pickImageUrls(galleryResults);
    const iconStyleUrls = pickImageUrls(styleResults);
    const sources = [
      ...heroResults.map((asset, index) => toSource(asset, index === 0 ? "hero" : "cover", index)),
      ...galleryResults.map((asset, index) => toSource(asset, "gallery", index)),
      ...styleResults.map((asset, index) => toSource(asset, "icon", index)),
    ].slice(0, 18);

    const inspirationSummary = template
      ? `模板「${template.name}」搜图方向: ${template.imageSearchHints.slice(0, 4).join("、")}`
      : `搜索方向: ${hints.slice(0, 4).join("、")}`;

    console.log(`[asset-search] template=${params.templateId ?? "none"} hero=${heroUrls.length} gallery=${galleryUrls.length} icon=${iconStyleUrls.length}`);

    return {
      heroImageUrl: heroUrls[0],
      galleryImageUrls: galleryUrls.slice(0, 8),
      iconImageUrls: iconStyleUrls.slice(0, 4),
      sources,
      inspirationSummary,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`[asset-search] failed=${message.slice(0, 120)}`);
    return {
      sources: [],
      inspirationSummary: template
        ? `模板「${template.name}」推荐搜图方向: ${template.imageSearchHints.slice(0, 4).join("、")}`
        : undefined,
    };
  }
}

export function applyFoundImages(content: PageContent, found: FoundPageImages): PageContent {
  const assets = { ...(content.assets ?? {}) };
  if (found.sources.length > 0) assets.sources = [...(assets.sources ?? []), ...found.sources].slice(0, 24);
  if (found.heroImageUrl) assets.heroImageUrl = found.heroImageUrl;
  if (found.galleryImageUrls?.length) assets.collageImageUrls = found.galleryImageUrls;

  const coverCandidate = assets.heroImageUrl ?? assets.collageImageUrls?.[0];
  if (coverCandidate) assets.coverImageUrl = coverCandidate;

  const sections = content.sections.map((section) => {
    if (section.type === "hero" && found.heroImageUrl) {
      return {
        ...section,
        mediaType: "image" as const,
        mediaUrl: found.heroImageUrl,
        mediaPosition: section.mediaPosition ?? "background",
        mediaFit: section.mediaFit ?? "cover",
      };
    }

    if (section.type === "gallery" && found.galleryImageUrls?.length) {
      const gallery = section as GallerySection;
      return {
        ...gallery,
        items: gallery.items.map((item, index) => ({
          ...item,
          imageUrl: item.imageUrl || found.galleryImageUrls?.[index % found.galleryImageUrls.length],
        })),
      };
    }

    return section;
  });

  return { ...content, assets, sections };
}
