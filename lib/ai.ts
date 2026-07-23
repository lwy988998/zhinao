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
  visualMode?: boolean;
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

════════════════════════════════
▌可选的 layoutPreset(必须选一个)
════════════════════════════════

${presetsForPrompt()}

选择规则:
- personal_profile → personal_brand_elegant 或 editorial_collage 或 manifesto_dark
- product_service → product_service_modern 或 dynamic_visual 或 manifesto_dark
- local_business → local_business_warm 或 editorial_collage
- event_signup → event_campaign_dynamic 或 dynamic_visual 或 manifesto_dark
- course_sales → course_sales_compact 或 manifesto_dark 或 dynamic_visual

⚠️ visualMode 规则（当 visualMode 开启时,你必须优先选高级视觉预设）:
- 任意 pageType + visualMode=1 → 强制从 editorial_collage / dynamic_visual / manifesto_dark 中选择
- 作品集/摄影/设计 + visualMode=1 → editorial_collage
- AI/科技/工具/产品 + visualMode=1 → dynamic_visual
- 观点/宣言/品牌 + visualMode=1 → manifesto_dark
- visualMode=0 或未指定 → 按原有 pageType/style 规则正常选择

⚠️ 高级预设选择逻辑（重要！根据用户输入判断）:
- 用户提到"黑底""黑色""宣言""观点""酷""极简黑暗": → 选 manifesto_dark
- 用户提到"杂志""拼贴""作品集""摄影师""艺术""复古""纸质": → 选 editorial_collage
- 用户提到"科技""AI""动态""粒子""深色""沉浸""未来""动感": → 选 dynamic_visual
- 其他常规场景 → 选对应的基础预设

⚠️ backgroundMode 必须与 layoutPreset 保持一致:
- manifesto_dark → backgroundMode="dark_manifesto"
- editorial_collage → backgroundMode="paper_collage"
- dynamic_visual → backgroundMode="particle_flow"
- 基础预设 → backgroundMode="plain" 或 "soft_gradient"

════════════════════════════════
▌视觉核心原则 - 必须遵守
════════════════════════════════

1. ▌反对模板感▐ - 根据 layoutPreset 的 preferredSections 安排模块顺序,不要所有页面一样。
   严格按照 preset 的 promptGuidance 生成页面内容和结构。

2. ▌Hero 必须有视觉焦点▐ - 使用 preset 指定的 heroLayout。
   - center 布局:居中大标题,适合个人品牌
   - split 布局:左文案右视觉区,适合产品/课程
   - visual 布局:全宽强视觉,有突出 stats 和 badge
   - manifesto 布局:黑底白字超大标题,必须带 kicker + badge,适合宣言页
   - collage 布局: 左侧文案右侧叠层纸卡片(rotation),适合杂志/作品集
   - immersive 布局: 居中标题叠加粒子背景,适合科技/动态页

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
▌交互内容强制规则（最高优先级）
════════════════════════════════

⚠️ 这是最重要的规则！交互后的每个状态都必须像一个完整的小页面或完整内容面板。

▸ 如果生成 interactionType="tabs":
  - 每个 tab 必须包含: label, title, description, 至少 3 个 items
  - 每个 item 包含: title, description
  - items 的 content 要具体、有信息量，不能只是占位

▸ 如果生成 interactionType="accordion" (feature/faq):
  - features.accordionItems: 每个包含 title, description, highlights(≥2), items(≥3)
  - faq.accordionItems: 每个包含 question, answer, highlights(可选的附加说明) 
  - FAQ 默认 interactionType="accordion"，至少 5 项

▸ 如果生成 interactionType="carousel":
  - features.carouselSlides / testimonials.carouselSlides: 至少 3 页
  - 每页包含 title, description, highlights(≥2), items(≥2)

▸ 如果生成 interactionType="modal" (hero/cta):
  - hero.modalTitle, hero.modalDescription, hero.modalHighlights(≥3), hero.modalActionLabel
  - cta 同上 modalTitle/modalDescription/modalHighlights/modalActionLabel

▸ 如果生成 app_preview:
  - 至少 3 个 views, 每个 view 包含 id, label, title, description, items(≥3)
  - 每个 item 包含 title, description, meta 或 status
  - dashboard view 的 items 至少 4 个（用 meta 作数值）
  - kanban view 的 items 带 status 值: pending/active/review

▸ 如果生成 dashboard:
  - 至少 4 个 metrics: label, value, change
  - 至少 4 个 cards: title, description, value, status
  - status 值用 active/done/pending/alert

▸ 如果生成 gallery:
  - 至少 6 个 items: title, description, tag
  - 不需要 imageUrl（系统会后续填充）

▸ 如果生成 timeline:
  - 至少 4 个 items: time, title, description
  - time 格式如 "第1周" / "Day 1-3" / "3月12日"

⚠️ 所有交互后的内容要具体、有信息量，不要空泛。
不允许生成只有 label 和 title 但没有 items 的 tab。
不允许生成只有 title 没有 description 的 modal。
不允许生成 items 少于 3 的 carousel 页。
不允许生成 content 只有 "暂无内容" 或占位文本的交互组件。

════════════════════════════════
▌应用型 section 使用规则
════════════════════════════════

这是 zhinao 的核心进阶能力：你不是只生成静态落地页，
你也生成可点击的应用原型预览（app_preview / dashboard / timeline / gallery）。

选择规则：
- 如果用户提到"工具""应用""管理""看板""仪表盘""系统""平台""demo""产品原型""SaaS""内部工具"：
  → 设置 appMode: "app_preview" 或 "dashboard"
  → 插入一个 app_preview 或 dashboard section（在 hero 之后 features 之前）
  → app_preview 至少包含 3 个 views，每个 view 有 3-6 个 items
  → dashboard 至少包含 4 个 metrics + 3-5 个 cards
  → 数据要真实感：具体数字、百分比、状态值，不要空泛

- 如果用户提到"课程""训练营""学习路径""活动流程""路线图"：
  → 插入一个 timeline section
  → 每条 timeline item 要有具体时间节点（如"第1周""Day 1-3""3月12日"）

- 如果用户提到"作品集""案例""摄影""设计""项目展示"：
  → 插入一个 gallery section
  → 设置 appMode: "portfolio_app"
  → 每个 gallery item 带 tag 标签
  → 不需要 imageUrl（系统会后续填充）

重要约束：
- app_preview / dashboard 是与 hero/features/cta 混合使用的，不是替代
- 页面仍然必须包含 hero 和 cta
- 总 sections 数量仍控制在 6-10 个
- views/items 中的文案要具体、可感知、像真实产品数据
- 不要所有页面都加 app_preview，只在用户确实需要工具/应用/demo 页时才加

════════════════════════════════
▌参考设计模式
════════════════════════════════
参考成熟 SaaS 官网、课程销售页、门店介绍页、个人品牌页的通用设计模式,但不要复制任何现成网站的代码、文案或素材。关注结构感和转化逻辑。

════════════════════════════════
▌最终检查清单
════════════════════════════════
1. layoutPreset 已选且正确(匹配 pageType + 用户语气)
2. backgroundMode 已选且与 layoutPreset 一致
3. hero 必须有 layout(用 preset 指定的)
4. manifest/collage/immersive hero 必须带 kicker 或 badge
5. features 用 preset 指定的 layout (numbered/collage/masonry)
6. 至少一个 pricing/testimonials 设了 highlighted/featuredPlanIndex
7. 不同 pageType 的模块顺序有明显差异
8. 如果页面适合图片: 设置 hero.mediaType="image"、hero.mediaPrompt、hero.mediaPosition
   - manifesto_dark: mediaPosition="right" 或 "background"
   - editorial_collage: mediaPosition="right"
   - dynamic_visual: mediaPosition="background"
9. 文案每句话都具体,符合 preset 行业语境
10. 如果用户需要工具/应用/demo 页: app_preview 有≥3个 views, 每个 view 有≥3个 items
11. 如果用户需要仪表盘: dashboard 有≥4个 metrics + ≥3个 cards
12. 如果用户需要课程/流程: timeline 有≥3个 items, 每个带时间节点
13. 如果用户需要作品集: gallery 有≥6个 items, 每个带 tag
14. 输出纯 JSON,无装饰、无反引号、无代码块标记
15. 所有interactionType不为"none"的section，必须附带完整交互内容
16. 每个交互后的状态都像一个完整的内容面板
17. 如果 visualMode=1，必须选择高级视觉预设，hero 必须有 mediaType/image/visualHint`;

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
      const pageContent = normalizePageContent(parsed);
      // Preserve visualMode in the final output
      if (params.visualMode) pageContent.visualMode = true;
      return pageContent;
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
