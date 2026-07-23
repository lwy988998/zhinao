import fs from "node:fs";
import path from "node:path";
import type { PageContent, PrimaryColor, ThemeStyle } from "@/types/page";

// ── Config ──

function getImageConfig() {
  const key = process.env.GPT_IMAGE_API_KEY?.trim();
  const baseUrl = process.env.GPT_IMAGE_BASE_URL?.trim();
  const model = process.env.GPT_IMAGE_MODEL?.trim() || "dall-e-3";
  if (!key || !baseUrl) return null;
  return { key, baseUrl: baseUrl.replace(/\/$/, ""), model };
}

// ── Prompt builders ──

export function buildHeroImagePrompt(content: PageContent): string {
  const preset = content.layoutPreset ?? "";
  const title = content.pageTitle;
  const style = content.theme.style;
  const color = content.theme.primaryColor;

  if (preset === "manifesto_dark") {
    return `Minimalist brand visual for a manifesto-style web page: "${title}". Dark background, high contrast, geometric abstraction, bold white typography feel, editorial design. NO text in the image. NO logos. Abstract modern art style. Clean composition. 16:9 ratio.`;
  }

  if (preset === "editorial_collage") {
    return `Editorial collage-style visual for a creative portfolio page: "${title}". Paper texture, layered magazine cutouts, film grain, vintage editorial feel, warm tones, artistic composition. NO text in the image. NO real people faces. Abstract arrangement of shapes and textures. 16:9 ratio.`;
  }

  if (preset === "dynamic_visual") {
    return `Futuristic abstract visual for a tech product page: "${title}". Dark background, flowing light particles, blue-purple gradient glow, tech atmosphere, immersive depth, data visualization aesthetic. NO text in the image. NO UI elements. Abstract flowing light. 16:9 ratio.`;
  }

  // Standard / other
  const styleDesc: Record<ThemeStyle, string> = {
    minimal: "minimalist clean",
    business: "professional corporate",
    elegant: "elegant soft",
    tech: "modern tech",
    youthful: "vibrant playful",
  };

  const colorDesc: Record<PrimaryColor, string> = {
    blue: "blue tones",
    green: "emerald green tones",
    purple: "violet purple tones",
    orange: "warm orange tones",
    black_gold: "black and gold tones",
    pink: "soft pink tones",
  };

  return `Modern hero banner visual for a web page: "${title}". ${styleDesc[style] ?? "clean"} style, ${colorDesc[color] ?? "neutral"} tones. Abstract geometric composition, modern design, subtle gradient. NO text or letters. NO logos or branding. Professional quality. 16:9 ratio.`;
}

// ── Image generation ──

type ImageResult = { url: string } | null;

/** Call image API; returns URL or null on failure */
export async function generateImage(prompt: string): Promise<ImageResult> {
  const config = getImageConfig();
  if (!config) {
    console.log("[image] no config, skip");
    return null;
  }

  try {
    const endpoint = `${config.baseUrl}/images/generations`;
    console.log(`[image] generating: ${prompt.slice(0, 80)}...`);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify({
        model: config.model,
        prompt,
        n: 1,
        size: "1792x1024",
        response_format: "url",
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.log(`[image] API error ${response.status}: ${text.slice(0, 200)}`);
      return null;
    }

    const data = (await response.json()) as {
      data?: Array<{ url?: string; b64_json?: string }>;
    };

    const item = data?.data?.[0];
    if (!item) {
      console.log("[image] empty response");
      return null;
    }

    // URL response — return directly
    if (item.url) {
      console.log(`[image] got URL: ${item.url.slice(0, 60)}...`);
      return { url: item.url };
    }

    // Base64 response — save locally
    if (item.b64_json) {
      const localUrl = await saveBase64Image(item.b64_json);
      if (localUrl) return { url: localUrl };
    }

    console.log("[image] no url or b64 in response");
    return null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`[image] failed: ${msg}`);
    return null;
  }
}

// ── Base64 save ──

async function saveBase64Image(b64: string): Promise<string | null> {
  try {
    const dir = path.join(process.cwd(), "public", "generated");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const buffer = Buffer.from(b64, "base64");
    const name = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.png`;
    const filePath = path.join(dir, name);

    fs.writeFileSync(filePath, buffer);
    const publicUrl = `/generated/${name}`;
    console.log(`[image] saved base64: ${publicUrl}`);
    return publicUrl;
  } catch (err) {
    console.log(`[image] base64 save failed: ${err}`);
    return null;
  }
}

// ── Batch generation helpers ──

/** Generate hero image for a page, returns URL or null */
export async function generateHeroImage(content: PageContent): Promise<string | null> {
  const heroSection = content.sections.find((s) => s.type === "hero");
  if (!heroSection) return null;

  const preset = content.layoutPreset ?? "";
  const presetsNeedingImages = ["manifesto_dark", "editorial_collage", "dynamic_visual"];

  // For advanced presets, always try to generate
  if (presetsNeedingImages.includes(preset)) {
    const prompt = buildHeroImagePrompt(content);
    const result = await generateImage(prompt);
    return result?.url ?? null;
  }

  // For visualMode=1, always try to generate regardless of preset
  if (content.visualMode) {
    const prompt = buildHeroImagePrompt(content);
    const result = await generateImage(prompt);
    return result?.url ?? null;
  }

  // For standard presets without visualMode, only generate if user input suggests visual content
  const userInputLower = (content.pageDescription + content.pageTitle).toLowerCase();
  const visualKeywords = ["图片", "照片", "作品", "视觉", "展示", "相册", "画廊", "设计", "摄影", "作品集"];
  if (visualKeywords.some((kw) => userInputLower.includes(kw))) {
    const prompt = buildHeroImagePrompt(content);
    const result = await generateImage(prompt);
    return result?.url ?? null;
  }

  return null;
}

/** Generate collage images (up to 3), returns array of URLs */
export async function generateCollageImages(content: PageContent): Promise<string[]> {
  const preset = content.layoutPreset ?? "";
  if (preset !== "editorial_collage") return [];

  const basePrompt = buildHeroImagePrompt(content);

  // Generate 3 variations with slightly different angles
  const variations = [
    `${basePrompt} Variation 1: asymmetric composition, tilted angle, warm paper tones.`,
    `${basePrompt} Variation 2: layered cutouts, film grain texture, vintage color palette.`,
    `${basePrompt} Variation 3: geometric shapes overlay, torn paper edges, artistic shadow.`,
  ];

  const results = await Promise.allSettled(variations.map((p) => generateImage(p)));

  return results
    .filter(
      (r): r is PromiseFulfilledResult<ImageResult> =>
        r.status === "fulfilled" && r.value?.url != null,
    )
    .map((r) => r.value!.url);
}

// ── Post-processing: inject generated images into PageContent ──

export async function enrichPageWithImages(content: PageContent): Promise<PageContent> {
  const preset = content.layoutPreset ?? "";

  // Initialize assets
  if (!content.assets) content.assets = {};

  try {
    // 1. Hero image
    const heroUrl = await generateHeroImage(content);
    if (heroUrl) {
      content.assets.heroImageUrl = heroUrl;
      // Inject into hero section
      const heroSection = content.sections.find((s) => s.type === "hero");
      if (heroSection && "mediaUrl" in heroSection) {
        heroSection.mediaUrl = heroUrl;
        heroSection.mediaType = heroSection.mediaType || "image";
        heroSection.mediaPosition = heroSection.mediaPosition || "right";
        heroSection.mediaFit = heroSection.mediaFit || "cover";
      }
    }

    // 2. Collage images (editorial_collage only)
    if (preset === "editorial_collage") {
      const collageUrls = await generateCollageImages(content);
      if (collageUrls.length > 0) {
        content.assets.collageImageUrls = collageUrls;
      }
    }

    // 3. Cover image (first available hero or collage)
    content.assets.coverImageUrl =
      content.assets.heroImageUrl ?? content.assets.collageImageUrls?.[0];
  } catch (err) {
    console.log(`[image] enrich failed (non-fatal): ${err}`);
    // Don't rethrow — page still valid without images
  }

  return content;
}
