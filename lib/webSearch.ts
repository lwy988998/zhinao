export type SearchAsset = {
  title: string;
  url: string;
  imageUrl?: string;
  source?: string;
  snippet?: string;
  licenseHint?: string;
  provider?: string;
};

type SearchParams = {
  query: string;
  count?: number;
  type?: "image" | "web";
};

type ProviderConfig = {
  label: string;
  apiKey?: string;
  baseUrl?: string;
};

function getProviders(): ProviderConfig[] {
  return [
    { label: "bocha", apiKey: process.env.BOCHA_API_KEY?.trim(), baseUrl: process.env.BOCHA_BASE_URL?.trim() },
    { label: "fallback", apiKey: process.env.SEARCH_API_KEY_FALLBACK?.trim(), baseUrl: process.env.SEARCH_BASE_URL_FALLBACK?.trim() },
  ];
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getNested(input: unknown, path: string[]): unknown {
  let cur = input;
  for (const key of path) {
    if (!isRecord(cur)) return undefined;
    cur = cur[key];
  }
  return cur;
}

function extractItems(data: unknown): unknown[] {
  const candidates = [
    getNested(data, ["data", "webPages", "value"]),
    getNested(data, ["webPages", "value"]),
    getNested(data, ["data", "images", "value"]),
    getNested(data, ["images", "value"]),
    getNested(data, ["data", "results"]),
    getNested(data, ["results"]),
    getNested(data, ["data", "items"]),
    getNested(data, ["items"]),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeAsset(item: unknown, provider: string): SearchAsset | null {
  if (!isRecord(item)) return null;

  const title = asString(item.title) ?? asString(item.name) ?? asString(item.siteName) ?? "搜索结果";
  const url = asString(item.url) ?? asString(item.link) ?? asString(item.displayUrl) ?? asString(item.contentUrl);
  const imageUrl =
    asString(item.imageUrl) ??
    asString(item.thumbnailUrl) ??
    asString(item.contentUrl) ??
    asString(getNested(item, ["thumbnail", "url"])) ??
    asString(getNested(item, ["image", "url"]));

  const finalUrl = url ?? imageUrl;
  if (!finalUrl) return null;

  return {
    title,
    url: finalUrl,
    imageUrl,
    source: asString(item.source) ?? asString(item.provider) ?? provider,
    snippet: asString(item.snippet) ?? asString(item.summary) ?? asString(item.description),
    licenseHint: asString(item.license) ?? asString(item.licenseHint),
    provider,
  };
}

async function callProvider(config: ProviderConfig, params: SearchParams): Promise<SearchAsset[]> {
  if (!config.apiKey || !config.baseUrl) return [];

  const endpoint = config.baseUrl.replace(/\/$/, "");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      query: params.query,
      q: params.query,
      count: params.count ?? 8,
      limit: params.count ?? 8,
      type: params.type ?? "image",
    }),
    signal: AbortSignal.timeout(12000),
  });

  console.log(`[search] provider=${config.label} status=${response.status}`);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    console.log(`[search] provider=${config.label} error=${text.slice(0, 120)}`);
    return [];
  }

  const data = await response.json().catch(() => null);
  return extractItems(data)
    .map((item) => normalizeAsset(item, config.label))
    .filter((item): item is SearchAsset => item !== null)
    .slice(0, params.count ?? 8);
}

export async function searchWebAssets(params: SearchParams): Promise<SearchAsset[]> {
  if (!params.query.trim()) return [];

  for (const provider of getProviders()) {
    if (!provider.apiKey || !provider.baseUrl) continue;

    try {
      const results = await callProvider(provider, params);
      if (results.length > 0) return results;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`[search] provider=${provider.label} failed=${message.slice(0, 120)}`);
    }
  }

  return [];
}
