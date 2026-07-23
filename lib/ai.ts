import { mockPageContent } from "@/data/mockPage";
import { isValidPageContent } from "@/lib/pageValidation";
import type { ContactActionType, PageContent, PageSection, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

type GeneratePageContentParams = {
  userInput: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type ProviderConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  label: string;
};

const DEFAULT_MODEL = "gpt-4o-mini";

function buildProviderConfig(
  keyEnv: string,
  urlEnv: string,
  modelEnv: string,
  label: string,
): ProviderConfig | null {
  const apiKey = process.env[keyEnv]?.trim();
  const baseUrl = process.env[urlEnv]?.trim();
  const model = process.env[modelEnv]?.trim() || DEFAULT_MODEL;

  if (!apiKey || !baseUrl) return null;

  return { apiKey, baseUrl, model, label };
}

async function callAIProvider(
  config: ProviderConfig,
  systemPrompt: string,
  userPrompt: string,
): Promise<ChatCompletionResponse> {
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/chat/completions`;

  console.log(`[ai debug] provider=${config.label} endpoint=${new URL(endpoint).pathname}`);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  const contentType = response.headers.get("content-type") || "";
  console.log(`[ai debug] provider=${config.label} status=${response.status} content-type=${contentType}`);

  if (!response.ok) {
    // Non-JSON response body for diagnostics
    if (!contentType.includes("application/json")) {
      const textSample = await response.text().catch(() => "");
      console.log(`[ai debug] provider=${config.label} html=${textSample.trimStart().startsWith("<")} preview=${textSample.slice(0, 100)}`);
      throw new Error(`AI 上游返回了 HTML/非 JSON 响应（${response.status}），请检查 AI_BASE_URL 是否正确`);
    }

    // Try reading JSON error from upstream
    let upstreamError = "";
    try {
      const errBody = await response.json();
      upstreamError = (errBody as Record<string, unknown>)?.error
        ? (typeof (errBody as Record<string, unknown>).error === "object"
          ? ((errBody as Record<string, unknown>).error as Record<string, string>).message ?? ""
          : String((errBody as Record<string, unknown>).error ?? ""))
        : "";
    } catch { /* ignore */ }

    console.log(`[ai debug] provider=${config.label} upstream_error=${upstreamError}`);
    throw new Error(`AI API 请求失败：${response.status}${upstreamError ? ` — ${upstreamError}` : ""}`);
  }

  // Guard: don't parse non-JSON as JSON
  if (!contentType.includes("application/json")) {
    const textSample = await response.text().catch(() => "");
    console.log(`[ai debug] provider=${config.label} html=${textSample.trimStart().startsWith("<")} preview=${textSample.slice(0, 100)}`);
    throw new Error("AI 上游不是 JSON 响应，请检查接口地址和服务商兼容性");
  }

  return (await response.json()) as ChatCompletionResponse;
}

const systemPrompt = `你是“智脑 / zhinao”的网页内容生成引擎。
你只能返回 JSON，不返回 Markdown，不返回解释，不返回代码块。
输出必须是一个 PageContent 对象，所有文案必须是中文。

PageContent 字段必须包含：
- pageTitle: string
- pageDescription: string
- pageType: personal_profile | product_service | local_business | event_signup | course_sales
- theme: { style: minimal | business | elegant | tech | youthful, primaryColor: blue | green | purple | orange | black_gold | pink, fontStyle: modern | classic | rounded }
- seo: { title: string, description: string, keywords: string[] }
- contactAction: { type: wechat | phone | form | link | email, label: string, value: string }
- sections: PageSection[]

sections 规则：
- 数量必须为 6 到 10 个。
- 第一个模块必须是 hero。
- 最后一个模块必须是 cta。
- contact 模块必须存在。
- 模块只能使用以下 10 种：hero, features, pain_points, solution, process, pricing, testimonials, faq, contact, cta。
- 每个模块可以包含 id 和 visible，也可以省略。

模块字段规则：
- hero: { type: "hero", title, subtitle, buttonText, buttonAction, image? }
- features: { type: "features", title, subtitle?, items: { title, description, icon? }[] }
- pain_points: { type: "pain_points", title, items: { title, description }[] }
- solution: { type: "solution", title, description, items: { title, description }[] }
- process: { type: "process", title, steps: { title, description }[] }
- pricing: { type: "pricing", title, items: { name, price, description, features: string[], highlighted? }[] }
- testimonials: { type: "testimonials", title, items: { name, role?, content, avatar? }[] }
- faq: { type: "faq", title, items: { question, answer }[] }
- contact: { type: "contact", title, description, wechat?, phone?, email?, address?, qrcode? }
- cta: { type: "cta", title, description, buttonText, buttonAction }

不要使用任何未定义字段替代上述字段。不要输出 mock 标记。`;

export function extractJSON(text: string) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const unwrapped = fenced ? fenced[1].trim() : trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const firstBrace = unwrapped.indexOf("{");
  const lastBrace = unwrapped.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return unwrapped.slice(firstBrace, lastBrace + 1);
  }

  return unwrapped;
}

function buildUserPrompt(params: GeneratePageContentParams) {
  return `请根据以下信息生成可发布网页的 PageContent JSON：

用户需求：${params.userInput}
页面类型：${params.pageType}
视觉风格：${params.style}
主色调：${params.primaryColor}
目标动作：${params.contactAction}

请让内容真实、具体、可直接用于网页预览。contactAction.value 如果用户没有给出真实联系方式，请使用清晰占位内容，例如“请填写微信号”或“请填写手机号”，不要编造真实个人信息。`;
}

function normalizeSection(section: PageSection, index: number): PageSection {
  return {
    ...section,
    id: section.id ?? `${section.type}-${index + 1}`,
    visible: section.visible ?? true,
  };
}

function normalizePageContent(content: PageContent): PageContent {
  return {
    ...content,
    sections: content.sections.map(normalizeSection),
  };
}

export async function generatePageContent(params: GeneratePageContentParams): Promise<PageContent> {
  if (process.env.AI_USE_MOCK === "true") {
    return normalizePageContent(mockPageContent);
  }

  const providers: ProviderConfig[] = [];

  // 主 API
  const primary = buildProviderConfig("AI_API_KEY", "AI_BASE_URL", "AI_MODEL", "primary");
  if (primary) providers.push(primary);

  // 备 API（DeepSeek 等）
  const fallback = buildProviderConfig("AI_API_KEY_FALLBACK", "AI_BASE_URL_FALLBACK", "AI_MODEL_FALLBACK", "fallback");
  if (fallback) providers.push(fallback);

  if (providers.length === 0) {
    throw new Error("AI API 未配置");
  }

  const userPrompt = buildUserPrompt(params);
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`[ai debug] trying provider=${provider.label}`);

      const result = await callAIProvider(provider, systemPrompt, userPrompt);
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`[${provider.label}] AI 返回内容为空`);
        console.log(`[ai debug] provider=${provider.label} empty content, trying next...`);
        continue;
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(extractJSON(content));
      } catch {
        lastError = new Error(`[${provider.label}] AI 返回内容不是有效 JSON`);
        console.log(`[ai debug] provider=${provider.label} invalid JSON, trying next...`);
        continue;
      }

      if (!isValidPageContent(parsed)) {
        const keys = typeof parsed === "object" && parsed !== null ? Object.keys(parsed as Record<string, unknown>).join(", ") : typeof parsed;
        console.log(`[ai debug] provider=${provider.label} invalid structure. top-level keys: ${keys}`);
        lastError = new Error(`[${provider.label}] AI 返回内容不符合 PageContent 结构`);
        console.log(`[ai debug] provider=${provider.label} invalid structure, trying next...`);
        continue;
      }

      console.log(`[ai debug] provider=${provider.label} success`);
      return normalizePageContent(parsed);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[ai debug] provider=${provider.label} failed: ${lastError.message}`);
      // Continue to next provider
    }
  }

  // All providers failed
  const summary = lastError?.message ?? "未知错误";
  console.log(`[ai debug] all providers failed. last error: ${summary}`);
  throw new Error(summary);
}
