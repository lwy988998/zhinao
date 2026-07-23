import { mockPageContent } from "@/data/mockPage";
import { isValidPageContent } from "@/lib/pageValidation";
import { presetsForPrompt } from "@/lib/layoutPresets";
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
      max_tokens: 8192,
    }),
  });

  const contentType = response.headers.get("content-type") || "";
  console.log(`[ai debug] provider=${config.label} status=${response.status} content-type=${contentType}`);

  if (!response.ok) {
    // Non-JSON response body for diagnostics
    if (!contentType.includes("application/json")) {
      const textSample = await response.text().catch(() => "");
      console.log(`[ai debug] provider=${config.label} html=${textSample.trimStart().startsWith("<")} preview=${textSample.slice(0, 100)}`);
      throw new Error(`AI 上游返回了 HTML/非 JSON 响应(${response.status}),请检查 AI_BASE_URL 是否正确`);
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
    throw new Error(`AI API 请求失败:${response.status}${upstreamError ? ` - ${upstreamError}` : ""}`);
  }

  // Guard: don't parse non-JSON as JSON
  if (!contentType.includes("application/json")) {
    const textSample = await response.text().catch(() => "");
    console.log(`[ai debug] provider=${config.label} html=${textSample.trimStart().startsWith("<")} preview=${textSample.slice(0, 100)}`);
    throw new Error("AI 上游不是 JSON 响应,请检查接口地址和服务商兼容性");
  }

  return (await response.json()) as ChatCompletionResponse;
}

const systemPrompt = `你是▞智脑 / zhinao▞的网页内容生成引擎。
你的任务是生成高质量、有品牌感、一眼不像模板的网页内容 JSON。
你只能返回 JSON,不返回 Markdown,不返回解释,不返回代码块。
所有文案必须是中文。

════════════════════════════════
▌输出结构
════════════════════════════════

PageContent 字段:
- pageTitle: string         品牌级页面标题
- pageDescription: string   一句话概括(用于 SEO)
- pageType: personal_profile | product_service | local_business | event_signup | course_sales
- layoutPreset: string      必须从下方预设列表中选一个 id
- theme: {
    style: minimal | business | elegant | tech | youthful,
    primaryColor: blue | green | purple | orange | black_gold | pink,
    fontStyle: modern | classic | rounded
  }
- seo: { title, description, keywords: string[] }
- contactAction: { type: wechat | phone | form | link | email, label, value }
- sections: PageSection[]   6-10 个模块

════════════════════════════════
▌可选的 layoutPreset(必须选一个)
════════════════════════════════

${presetsForPrompt()}

选择规则:
- personal_profile → personal_brand_elegant
- product_service → product_service_modern
- local_business → local_business_warm
- event_signup → event_campaign_dynamic
- course_sales → course_sales_compact

════════════════════════════════
▌视觉核心原则 - 必须遵守
════════════════════════════════

1. ▌反对模板感▐ - 根据 layoutPreset 的 preferredSections 安排模块顺序,不要所有页面一样。
   严格按照 preset 的 promptGuidance 生成页面内容和结构。

2. ▌Hero 必须有视觉焦点▐ - 使用 preset 指定的 heroLayout。
   - center 布局:居中大标题,适合个人品牌
   - split 布局:左文案右视觉区,适合产品/课程
   - visual 布局:全宽强视觉,有突出 stats 和 badge

3. ▌留白有节奏▐ - preset 的 sectionRhythm 决定整体节奏:
   - calm:宽松、优雅,section 间大量留白
   - conversion:紧凑,减少不必要空白,驱动转化
   - editorial:有层次,穿插数据区和强调引用
   - dynamic:活力、醒目,大胆的颜色块切换

4. ▌卡片要有层级▐ - 根据 preset 的 cardStyle:
   - elevated:主卡片阴影更重,有高亮推荐标签
   - subtle:卡片低调,靠文案和间距区分
   - bordered:边框明确,干净利落
   - colorful:卡片带主色或柔和底色

5. ▌文案要像真实品牌▐ - 拒绝▞助力您的业务▞▞优质服务▞这类空洞短语。
   每句话要具体、可感知,符合该 preset 的行业语境。

6. ▌不同 style 要明显不同▐ -
   - minimal: 极简白底、极细线条、大面积留白
   - business: 专业、可信赖、数据感、深基调
   - elegant: 柔和过渡、圆润圆角、pink/cream 系
   - tech: 暗色或极简+荧光点缀、几何线条
   - youthful: 亮色背景块、大圆角、emoji 图标

════════════════════════════════
▌模块字段完整定义
════════════════════════════════

所有模块继承:{ type, title?, description?, visible?, id?, design?: { bg?: string, spacing?: string } }

▸ hero { type: "hero", title, subtitle, buttonText, buttonAction, image?, secondaryButtonText?,
        layout?: "center" | "split" | "visual", badge?: string,
        stats?: [{ label, value }], visualHint?: string }
▸ features { type: "features", title, subtitle?, items: [{ title, description, icon? }],
           layout?: "grid" | "cards" | "list", highlightIndex?: number }
▸ pain_points { type: "pain_points", title, description?, items: [{ title, description }] }
▸ solution { type: "solution", title, description, items: [{ title, description }] }
▸ process { type: "process", title, description?, steps: [{ title, description }] }
▸ pricing { type: "pricing", title, description?,
           items: [{ name, price, description, features: string[], highlighted? }],
           layout?: "cards" | "table", featuredPlanIndex?: number }
▸ testimonials { type: "testimonials", title, description?,
                items: [{ name, role?, content, avatar? }],
                layout?: "cards" | "quote" | "avatars" }
▸ faq { type: "faq", title, description?, items: [{ question, answer }] }
▸ contact { type: "contact", title, description, wechat?, phone?, email?, address?, qrcode? }
▸ cta { type: "cta", title, description, buttonText, buttonAction,
       layout?: "banner" | "panel" }

════════════════════════════════
▌参考设计模式
════════════════════════════════
参考成熟 SaaS 官网、课程销售页、门店介绍页、个人品牌页的通用设计模式,但不要复制任何现成网站的代码、文案或素材。关注结构感和转化逻辑。

════════════════════════════════
▌最终检查清单
════════════════════════════════
1. layoutPreset 已选且正确(匹配 pageType)
2. hero 必须有 layout(用 preset 指定的)
3. hero 必须有 badge 或 stats(至少一个)
4. testimonials 使用 preset 指定的 layout
5. 至少一个 pricing/testimonials 设了 highlighted/featuredPlanIndex
6. 不同 pageType 的模块顺序有明显差异
7. 文案每句话都具体,符合 preset 行业语境
8. 输出纯 JSON,无装饰、无反引号、无代码块标记`;

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
  return `请严格按照系统提示中的 layoutPreset 选择规则生成 PageContent JSON。

用户需求：${params.userInput}
页面类型：${params.pageType}
视觉风格：${params.style}
主色调：${params.primaryColor}
目标动作：${params.contactAction}

重要要求：
- 根据 pageType 选择对应的 layoutPreset（必须输出该字段）
- 严格按照选中 preset 的 promptGuidance 生成内容
- 按照 preset 的 preferredSections 安排模块顺序
- hero 用 preset 指定的 heroLayout
- testimonials 用 preset 指定的 layout
- cta 用 preset 指定的 ctaStyle
- 至少一个模块设 highlightIndex 或 featuredPlanIndex
- 文案要像真实品牌，具体到人名、数字、场景
- contactAction.value 如果用户没有给出真实联系方式，用清晰占位
- 输出纯 JSON，无任何包装`;
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

  // 备 API(DeepSeek 等)
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
