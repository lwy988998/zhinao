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
};

const pageTypeHints: Record<PageType, string> = {
  personal_profile: "portrait portfolio brand photography",
  product_service: "product service website hero visual",
  local_business: "local business interior lifestyle photography",
  event_signup: "event campaign registration visual",
  course_sales: "online course workshop learning visual",
};

function uniqueStrings(values: Array<string | undefined>): string[] {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim()))));
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

  const baseQuery = uniqueStrings([params.pageTitle, hints.slice(0, 2).join(" ")]).join(" ");
  const queries = uniqueStrings([
    `${baseQuery} high quality hero image no logo`,
    `${params.pageTitle} ${hints[0] ?? "website"} gallery images`,
    `${params.pageTitle} ${hints[1] ?? "brand"} icon illustration`,
  ]);

  try {
    const [heroResults, galleryResults, iconResults] = await Promise.all([
      searchWebAssets({ query: queries[0], count: 6, type: "image" }),
      searchWebAssets({ query: queries[1] ?? queries[0], count: 8, type: "image" }),
      searchWebAssets({ query: queries[2] ?? queries[0], count: 4, type: "image" }),
    ]);

    const heroUrls = pickImageUrls(heroResults);
    const galleryUrls = pickImageUrls(galleryResults);
    const iconUrls = pickImageUrls(iconResults);
    const sources = [
      ...heroResults.map((asset, index) => toSource(asset, index === 0 ? "hero" : "cover", index)),
      ...galleryResults.map((asset, index) => toSource(asset, "gallery", index)),
      ...iconResults.map((asset, index) => toSource(asset, "icon", index)),
    ].slice(0, 18);

    return {
      heroImageUrl: heroUrls[0],
      galleryImageUrls: galleryUrls.slice(0, 6),
      iconImageUrls: iconUrls.slice(0, 4),
      sources,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`[asset-search] failed=${message.slice(0, 120)}`);
    return { sources: [] };
  }
}

export function applyFoundImages(content: PageContent, found: FoundPageImages): PageContent {
  const assets = { ...(content.assets ?? {}) };
  if (found.sources.length > 0) assets.sources = found.sources;
  if (found.heroImageUrl) assets.heroImageUrl = found.heroImageUrl;
  if (found.galleryImageUrls?.length) assets.collageImageUrls = found.galleryImageUrls;
  assets.coverImageUrl = assets.heroImageUrl ?? assets.collageImageUrls?.[0] ?? assets.coverImageUrl;

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
