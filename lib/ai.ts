import { presetsForPrompt } from "@/lib/layoutPresets";
import { createFallbackPageContent } from "@/lib/generateFallback";
import { normalizePageContent } from "@/lib/pagePostProcess";
import { getTemplateById } from "@/lib/templates";
import type { ContactActionType, PageContent, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

type GeneratePageContentParams = {
  userInput: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
  visualMode?: boolean;
  templateId?: string;
  forceFallback?: boolean;
};

export type GenerateProvider = "primary" | "fallback" | "template_fallback" | "mock_fallback";

export type GeneratePageContentResult = {
  content: PageContent;
  meta: {
    provider: GenerateProvider;
    providerTried: string[];
    warnings: string[];
  };
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
    if (!contentType.includes("application/json")) {
      const textSample = await response.text().catch(() => "");
      console.log(`[ai debug] provider=${config.label} html=${textSample.trimStart().startsWith("<")} preview=${textSample.slice(0, 100)}`);
      throw new Error(`AI 上游返回了 HTML/非 JSON 响应(${response.status}),请检查 AI_BASE_URL 是否正确`);
    }

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
- backgroundMode: plain | soft_gradient | dark_manifesto | paper_collage | particle_flow
                            必须与 layoutPreset 对应(见选择规则)
- theme: {
    style: minimal | business | elegant | tech | youthful,
    primaryColor: blue | green | purple | orange | black_gold | pink,
    fontStyle: modern | classic | rounded
  }
- seo: { title, description, keywords: string[] }
- contactAction: { type: wechat | phone | form | link | email, label, value }
- sections: PageSection[]   6-10 个模块
- hero.mediaType: 必须为 "image"（当 visualMode=1 时）
- hero.mediaPrompt: 中文图片描述，不涉及具体品牌/人物
- hero.mediaPosition: "right" 或 "background"

════════════════════════════════
▌可视化选择规则
════════════════════════════════

${presetsForPrompt()}

选择规则:
- personal_profile → personal_brand_elegant 或 editorial_collage 或 manifesto_dark
- product_service → product_service_modern 或 dynamic_visual 或 manifesto_dark
- local_business → local_business_warm 或 editorial_collage
- event_signup → event_campaign_dynamic 或 dynamic_visual 或 manifesto_dark
- course_sales → course_sales_compact 或 manifesto_dark 或 dynamic_visual

⚠️ visualMode 规则:
- 任意 pageType + visualMode=1 → 强制从 editorial_collage / dynamic_visual / manifesto_dark 中选择
- 作品集/摄影/设计 + visualMode=1 → editorial_collage + backgroundMode=paper_collage
- AI/科技/工具/产品 + visualMode=1 → dynamic_visual + backgroundMode=particle_flow
- 观点/宣言/品牌 + visualMode=1 → manifesto_dark + backgroundMode=dark_manifesto

⚠️ backgroundMode 必须与 layoutPreset 一致:
- manifesto_dark → backgroundMode="dark_manifesto"
- editorial_collage → backgroundMode="paper_collage"
- dynamic_visual → backgroundMode="particle_flow"
- 基础预设 → backgroundMode="plain" 或 "soft_gradient"

════════════════════════════════
▌全局视觉禁令（最高优先级）
════════════════════════════════

🚫 禁止纯白背景贯穿全页！每个页面必须有视觉层次。
🚫 禁止所有 section 都是普通白色卡片堆叠！必须混合至少 2 种不同视觉布局。
🚫 禁止 8 个模板生成同一结构！必须遵守模板专属框架。
🚫 禁止 hero 没有视觉焦点！必须设置 mediaType/image/visualHint。
🚫 禁止忘记设置 mediaPrompt 字段！

════════════════════════════════
▌模块字段完整定义
════════════════════════════════

所有模块继承:{ type, title?, description?, visible?, id?, design?: { bg?: string, spacing?: string } }

▸ hero { type: "hero", title, subtitle, buttonText, buttonAction, image?, secondaryButtonText?,
        layout?: "center" | "split" | "visual" | "manifesto" | "collage" | "immersive",
        badge?: string, kicker?: string,
        stats?: [{ label, value }], visualHint?: string,
        mediaType?: "none" | "image" | "abstract" | "canvas",
        mediaPrompt?: string, mediaPosition?: "left" | "right" | "background" | "center" }
▸ features { type: "features", title, subtitle?, items: [{ title, description, icon? }],
           layout?: "grid" | "cards" | "list" | "numbered" | "collage" | "masonry",
           highlightIndex?: number }
▸ pain_points { type: "pain_points", title, description?, items: [{ title, description }] }
▸ solution { type: "solution", title, description, items: [{ title, description }] }
▸ process { type: "process", title, description?, steps: [{ title, description }] }
▸ pricing { type: "pricing", title, description?,
           items: [{ name, price, description, features: string[], highlighted? }],
           layout?: "cards" | "table", featuredPlanIndex?: number }
▸ testimonials { type: "testimonials", title, description?,
                items: [{ name, role?, content, avatar? }],
                layout?: "cards" | "quote" | "avatars" | "editorial" }
▸ faq { type: "faq", title, description?, items: [{ question, answer }] }
▸ contact { type: "contact", title, description, wechat?, phone?, email?, address?, qrcode? }
▸ cta { type: "cta", title, description, buttonText, buttonAction,
       layout?: "banner" | "panel" | "dark" | "minimal" }
▸ app_preview { type: "app_preview", title, description?,
       layout?: "sidebar_app" | "topbar_app" | "split_demo",
       views: [{ id, label, title, description?,
                items?: [{ title, description?, meta?, status? }] }] }
▸ dashboard { type: "dashboard", title, description?,
       metrics: [{ label, value, change? }],
       cards: [{ title, description?, value?, status? }] }
▸ timeline { type: "timeline", title, description?,
       items: [{ time?, title, description? }] }
▸ gallery { type: "gallery", title, description?,
       items: [{ title, description?, imageUrl?, tag? }] }

════════════════════════════════
▌交互内容强制规则
════════════════════════════════

▸ interactionType="tabs": 每个 tab 至少有 label, title, description, 3 个 items
▸ interactionType="accordion": features.accordionItems 每个有 title, description, highlights(≥2), items(≥3)
▸ interactionType="carousel": features.carouselSlides/testimonials.carouselSlides 至少 3 页
▸ interactionType="modal": hero.modalTitle, modalDescription, modalHighlights(≥3), modalActionLabel
▸ app_preview: 至少 3 个 views, 每个 view 含 id, label, title, description, items(≥3)
▸ dashboard: 至少 4 个 metrics(label, value, change) + 至少 4 个 cards(title, description, value, status)
▸ gallery: 至少 6 个 items(title, description, tag) — 不需要 imageUrl
▸ timeline: 至少 4 个 items(time, title, description)

════════════════════════════════
▌最终检查清单
════════════════════════════════
1. layoutPreset 已选且正确
2. backgroundMode 已选且与 layoutPreset 一致
3. hero 必须有 layout
4. hero.mediaType 设为 "image", mediaPrompt 提供中文视觉描述
5. 至少一个 section 使用非默认视觉布局(collage/masonry/numbered/editorial)
6. 如果适用: app_preview 有≥3 个 views, dashboard 有≥4 metrics, gallery 有≥6 items, timeline 有≥4 items
7. 文案每句话具体、像真实品牌
8. 输出纯 JSON，无反引号、无代码块标记
9. 所有 interactionType 不为 "none" 的 section 附带完整交互内容`;

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

function buildTemplateBlock(templateId: string, userInput: string) {
  const template = getTemplateById(templateId);
  if (!template) return "";

  return `

╔══════════════════════════════════════════════════════════════╗
║ 🏷️  模板专属生成模式：${template.name}
║ ⚠️  你正在为【${template.name}】模板生成内容
║ ⚠️  这不是通用网页生成！必须严格遵循模板专属框架！
║ ⚠️  违反以下任何一条规则都会导致生成质量不合格！
╚══════════════════════════════════════════════════════════════╝

📋 模板元数据:
- id: ${template.id}
- 说明: ${template.description}
- 行业: ${template.category} (${template.categories.join("/")})

🎨 【强制】视觉框架参数:
- layoutPreset = "${template.layoutPreset}"        ← 输出时必须使用此值，不可更改！
- backgroundMode = "${template.backgroundMode}"     ← 输出时必须使用此值，不可更改！
- interactionMode = "${template.interactionMode}"   ← 输出时必须使用此值，不可更改！
- appMode = "${template.appMode ?? "landing"}"      ← 输出时必须使用此值，不可更改！
- pageType = "${template.pageType}"                 ← 输出时必须使用此值，不可更改！
- style = "${template.style}"                       ← 输出时必须使用此值，不可更改！
- primaryColor = "${template.primaryColor}"         ← 输出时必须使用此值，不可更改！

🦸 【强制】Hero 框架:
- layout = "${template.heroFramework.layout}"       ← Hero 必须使用此 layout！
- 语气: ${template.heroFramework.tone}
- 视觉方向: ${template.heroFramework.visualDirection}
- 标题风格: ${template.heroFramework.titleStyle}
- 副标题风格: ${template.heroFramework.subtitleStyle}
- CTA 风格: ${template.heroFramework.ctaStyle}
- 媒体策略: ${template.heroFramework.mediaStrategy}

📐 【强制】模块顺序 — 必须按此顺序排列 sections:
${template.recommendedSections.map((s, i) => `   ${i + 1}. ${s}`).join("\n")}

✅ 必须包含的模块: ${template.requiredSections.join(", ")}
❌ 禁止包含的模块: ${template.forbiddenSections?.join(", ") || "无"}

🔧 【强制】模块专属规则:
${template.sectionFrameworks.map((sf) =>
  `   ▸ ${sf.sectionType}:
      - 目的: ${sf.purpose}
      - 布局提示: ${sf.layoutHint}
      - 内容规则: ${sf.contentRules.join("；")}
      - 交互: ${sf.interactionHint}
      - 图片方向: ${sf.imageHint ?? "无"}`
).join("\n")}

🎯 【强制】视觉规则:
${template.visualRules.map((r) => `   ${template.visualRules.indexOf(r) + 1}. ${r}`).join("\n")}

✏️ 【强制】文案规则:
${template.copywritingRules.map((r) => `   ${template.copywritingRules.indexOf(r) + 1}. ${r}`).join("\n")}

🔗 【强制】交互规则:
${template.interactionRules.map((r) => `   ${template.interactionRules.indexOf(r) + 1}. ${r}`).join("\n")}

🖼️ 图片搜索线索: ${template.imageSearchHints.join(", ")}

📝 生成框架说明:
${template.promptFramework}

🚫 禁止事项:
${template.negativePromptRules.map((r) => `   ${template.negativePromptRules.indexOf(r) + 1}. ${r}`).join("\n")}

✅ 质量检查:
${template.qualityChecklist.map((r) => `   ${template.qualityChecklist.indexOf(r) + 1}. ${r}`).join("\n")}

══════════════════════════════════════════════════════════════
🔥 现在请根据用户需求「${userInput.slice(0, 100)}」，生成【${template.name}】模板的专属 PageContent JSON。

⚠️ 最后提醒:
1. layoutPreset/backgroundMode/heroLayout 必须与模板指定值完全一致
2. section 顺序必须遵循模板 recommendedSections 顺序
3. 必须包含 requiredSections 中的所有模块
4. 绝对不能包含 forbiddenSections 中的模块
5. 每个模块的视觉布局(layout字段)必须匹配模板专属规则
6. 不使用纯白背景 — 整页必须有模板对应的背景模式
7. 不使用"卡片堆叠"替代模板要求的 collage/masonry/numbered/editorial 布局
8. features 的 layout 字段必须与模板要求一致
9. testimonials 的 layout 字段必须与模板要求一致
10. 输出纯 JSON，无反引号、无代码块标记
══════════════════════════════════════════════════════════════`;
}

function buildUserPrompt(params: GeneratePageContentParams) {
  const templateBlock = params.templateId ? buildTemplateBlock(params.templateId, params.userInput) : "";

  // When templateId exists, the template block IS the main content — don't append generic instructions
  if (templateBlock) {
    return `请为【用户需求: ${params.userInput}】生成 PageContent JSON。

${templateBlock}`;
  }

  const visualBlock = params.visualMode
    ? `

⚠️ 视觉增强模式已开启！你必须：
- 从 editorial_collage / dynamic_visual / manifesto_dark 中选择 layoutPreset
- backgroundMode 选 paper_collage / particle_flow / dark_manifesto
- hero.layout 使用 visual / collage / immersive / manifesto 之一
- hero.mediaType 设为 "image"，hero.mediaPrompt 提供具体视觉描述
- hero.mediaPosition 设为 "right" 或 "background"
- 至少一个 section 使用更丰富的视觉布局（collage/masonry/cards/quote）
- 如果适用，添加 gallery 或 app_preview section
- 整体视觉密度更高，更像经过专业设计的成品，不是纯工具排版`
    : "";

  return `请严格按照系统提示中的 layoutPreset 选择规则生成 PageContent JSON。

用户需求：${params.userInput}
页面类型：${params.pageType}
视觉风格：${params.style}
主色调：${params.primaryColor}
目标动作：${params.contactAction}${visualBlock}

重要要求：
- 根据 pageType 选择对应的 layoutPreset（必须输出该字段）
- 严格按照选中 preset 的 promptFramework/heroFramework/sectionFrameworks 生成内容
- 按照 preset 的 preferredSections 安排模块顺序
- hero 用 preset 指定的 heroLayout
- testimonials 用 preset 指定的 layout
- cta 用 preset 指定的 ctaStyle
- 至少一个模块设 highlightIndex 或 featuredPlanIndex
- 文案要像真实品牌，具体到人名、数字、场景
- contactAction.value 如果用户没有给出真实联系方式，用清晰占位
- 输出纯 JSON，无任何包装`;
}

export async function generatePageContent(params: GeneratePageContentParams): Promise<GeneratePageContentResult> {
  const providerTried: string[] = [];
  const warnings: string[] = [];

  if (process.env.AI_USE_MOCK === "true") {
    return {
      content: normalizePageContent(createFallbackPageContent(params, params.templateId ? "template_fallback" : "mock_fallback"), params),
      meta: { provider: params.templateId ? "template_fallback" : "mock_fallback", providerTried, warnings: ["AI 服务波动，已使用稳定模式生成，可继续编辑。"] },
    };
  }

  const primary = buildProviderConfig("AI_API_KEY", "AI_BASE_URL", "AI_MODEL", "primary");
  const fallback = buildProviderConfig("AI_API_KEY_FALLBACK", "AI_BASE_URL_FALLBACK", "AI_MODEL_FALLBACK", "fallback");
  console.log(`[AI] fallback configured: ${fallback ? "YES" : "NO"}`);

  const providers: ProviderConfig[] = [];
  if (!params.forceFallback && primary) providers.push(primary);
  if (fallback) providers.push(fallback);
  if (params.forceFallback && primary && !fallback) warnings.push("fallback 未配置，已直接使用稳定模式。 ");
  if (providers.length === 0 && primary && !params.forceFallback) providers.push(primary);

  const userPrompt = buildUserPrompt(params);
  let lastError: Error | null = null;

  for (const provider of providers) {
    providerTried.push(provider.label);
    try {
      if (provider.label === "fallback") console.log("[AI] fallback started");
      const result = await callAIProvider(provider, systemPrompt, userPrompt);
      const content = result.choices?.[0]?.message?.content;

      if (!content) {
        lastError = new Error(`[${provider.label}] AI 返回内容为空`);
        console.log(`[AI] ${provider.label} failed: empty content`);
        warnings.push(`${provider.label} 返回内容为空`);
        continue;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(extractJSON(content));
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.log(`[AI] ${provider.label} failed: invalid JSON`);
        warnings.push(`${provider.label} 返回 JSON 不完整，已尝试下一个生成通道。`);
        continue;
      }

      const pageContent = normalizePageContent(parsed, params);
      console.log(`[AI] ${provider.label} succeeded`);
      if (provider.label === "fallback") console.log("[AI] fallback succeeded");
      return {
        content: pageContent,
        meta: {
          provider: provider.label === "fallback" ? "fallback" : "primary",
          providerTried,
          warnings,
        },
      };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const summary = lastError.message.slice(0, 180);
      console.log(`[AI] ${provider.label} failed: ${summary}`);
      warnings.push(`${provider.label} 生成失败，已自动切换。`);
    }
  }

  const fallbackSource = params.templateId ? "template_fallback" : "mock_fallback";
  const summary = lastError?.message ?? "AI provider 未配置或不可用";
  console.log(`[AI] all providers failed: ${summary.slice(0, 180)}`);
  warnings.push("AI 服务波动，已使用稳定模式生成，可继续编辑。");
  return {
    content: normalizePageContent(createFallbackPageContent(params, fallbackSource), params),
    meta: {
      provider: fallbackSource,
      providerTried,
      warnings,
    },
  };
}
