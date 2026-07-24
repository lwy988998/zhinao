import { getTemplateById } from "@/lib/templates";
import type { ContactActionType, PageContent, PageSection, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

export type StableGenerateParams = {
  userInput: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
  visualMode?: boolean;
  templateId?: string;
};

function titleFromInput(input: string, templateName?: string): string {
  const normalized = input.replace(/[\n\r]+/g, " ").trim();
  const first = normalized.split(/[。！？!?]/)[0]?.trim() || normalized;
  const base = first.length > 28 ? `${first.slice(0, 28)}...` : first;
  return templateName ? `${base} · ${templateName}` : base || "稳定模式生成页面";
}

function contactLabel(type: ContactActionType): string {
  if (type === "phone") return "电话咨询";
  if (type === "form") return "提交需求";
  if (type === "link") return "了解详情";
  if (type === "email") return "邮件联系";
  return "添加微信咨询";
}

function contactValue(type: ContactActionType): string {
  if (type === "phone") return "请在编辑器填写电话";
  if (type === "email") return "hello@example.com";
  if (type === "link") return "https://example.com";
  if (type === "form") return "在线表单";
  return "your-wechat-id";
}

function baseSections(title: string, params: StableGenerateParams): PageSection[] {
  const actionLabel = contactLabel(params.contactAction);
  return [
    {
      id: "hero",
      type: "hero",
      visible: true,
      title,
      subtitle: `根据你的需求「${params.userInput.slice(0, 56)}」生成的稳定版页面，可继续在编辑器中完善细节。`,
      buttonText: actionLabel,
      buttonAction: params.contactAction,
      layout: params.visualMode ? "visual" : "split",
      badge: "稳定模式",
      mediaType: params.visualMode ? "abstract" : "none",
      mediaPosition: "right",
    },
    {
      id: "features",
      type: "features",
      visible: true,
      title: "核心亮点",
      description: "先把页面骨架稳定搭好，再根据真实业务继续编辑。",
      layout: "cards",
      items: [
        { title: "信息清晰", description: "首屏直接说明你是谁、提供什么、适合谁。" },
        { title: "转化明确", description: "每个模块都围绕咨询、预约或购买动作展开。" },
        { title: "方便编辑", description: "文案、价格、图片和联系方式都可以在编辑器里继续替换。" },
      ],
    },
    {
      id: "pricing",
      type: "pricing",
      visible: true,
      title: "方案与价格",
      description: "价格可在编辑器中替换为真实套餐。",
      featuredPlanIndex: 1,
      items: [
        { name: "体验方案", price: "¥99 起", description: "适合首次了解。", features: ["基础咨询", "需求评估", "一次体验"] },
        { name: "标准方案", price: "¥699 起", description: "适合完整推进。", features: ["完整服务", "阶段反馈", "交付支持"], highlighted: true },
        { name: "定制方案", price: "按需报价", description: "适合复杂需求。", features: ["专属规划", "深度定制", "长期陪伴"] },
      ],
    },
    {
      id: "faq",
      type: "faq",
      visible: true,
      title: "常见问题",
      items: [
        { question: "这个页面可以继续修改吗？", answer: "可以。生成后会进入编辑器，你可以继续替换文案、图片、价格和联系方式。" },
        { question: "稳定模式是什么意思？", answer: "当 AI 服务波动时，系统会用安全模板生成可渲染页面，避免停在失败状态。" },
        { question: "图片没有生成怎么办？", answer: "页面仍会正常生成，图片可以稍后在编辑器里手动替换。" },
        { question: "联系方式在哪里修改？", answer: "可在编辑器的联系模块和 CTA 模块中调整。" },
        { question: "适合上线使用吗？", answer: "建议先补充真实案例、价格和联系方式，再发布。" },
      ],
    },
    {
      id: "contact",
      type: "contact",
      visible: true,
      title: "预约咨询",
      description: "留下你的需求，我们会根据当前情况给出下一步建议。",
      contactAction: { type: params.contactAction, label: actionLabel, value: contactValue(params.contactAction) },
    },
    {
      id: "cta",
      type: "cta",
      visible: true,
      title: "先生成稳定页面，再慢慢打磨细节",
      description: "当前页面已保证可编辑、可预览、可发布。",
      buttonText: actionLabel,
      buttonAction: params.contactAction,
      layout: params.visualMode ? "dark" : "banner",
    },
  ];
}

/**
 * When a template is selected, build richer sections that match the template's
 * visual direction, replacing generic fallback sections.
 */
function buildTemplateFallbackSections(params: StableGenerateParams): PageSection[] {
  const template = getTemplateById(params.templateId);
  if (!template) return baseSections(titleFromInput(params.userInput), params);
  const t = template;

  const actionLabel = contactLabel(params.contactAction);
  const sections: PageSection[] = [];

  // ═══ Hero — must match template heroFramework ═══
  sections.push({
    id: "hero",
    type: "hero",
    visible: true,
    title: `${t.previewData?.pageTitle ?? t.name} — ${params.userInput.slice(0, 20)}`,
    subtitle: t.tagline,
    buttonText: t.pageType === "event_signup" ? "立即报名" : t.pageType === "local_business" ? "预约咨询" : "查看方案",
    buttonAction: params.contactAction,
    layout: t.heroFramework.layout,
    badge: t.tagline,
    kicker: t.category.toUpperCase(),
    visualHint: t.heroFramework.visualDirection,
    mediaType: "abstract",
    mediaPrompt: t.heroFramework.mediaStrategy,
    mediaPosition: t.heroFramework.layout === "immersive" ? "background" : "right",
    interactionType: t.interactionMode === "interactive_demo" ? "tabs" : "none",
    interactiveItems: [
      { title: "核心价值", description: t.tagline, status: "active" },
      { title: "视觉方向", description: t.heroFramework.visualDirection, status: "preview" },
      { title: "行动入口", description: t.heroFramework.ctaStyle, status: "ready" },
    ],
  });

  // ═══ Build template-specific sections ═══
  for (const type of t.recommendedSections) {
    if (type === "hero") continue;

    if (type === "features") {
      const sf = t.sectionFrameworks.find((f) => f.sectionType === "features");
      const layoutMap: Record<string, string> = {
        "editorial_portfolio": "collage",
        "warm_brand_story": "cards",
        "liquid_glass_studio": "masonry",
        "ai_agent_dark": "grid",
        "dashboard_app_demo": "grid",
        "mobile_campaign_card": "numbered",
      };
      sections.push({
        id: "features",
        type: "features",
        visible: true,
        title: "核心能力",
        description: sf?.purpose ?? "展示核心能力，可在编辑器继续替换。",
        layout: (layoutMap[t.id] ?? "grid") as "grid" | "cards" | "list" | "numbered" | "collage" | "masonry",
        interactionType: t.interactionMode === "interactive_demo" ? "tabs" : "none",
        items: [
          { title: "专属框架", description: "基于「" + t.name + "」模板的结构生成，不是千篇一律页面。" },
          { title: "视觉方向", description: t.heroFramework.visualDirection },
          { title: "可编辑", description: "文案、图片、价格和联系方式可在编辑器替换。" },
        ],
        tabs: [
          { label: "定位", title: "模板定位", description: t.tagline, highlights: t.copywritingRules.slice(0, 3) },
          { label: "视觉", title: "视觉规则", description: t.heroFramework.visualDirection, highlights: t.visualRules.slice(0, 3) },
        ],
      });
    }

    if (type === "gallery") {
      sections.push({
        id: "gallery",
        type: "gallery",
        visible: true,
        title: "视觉展示",
        description: t.sectionFrameworks.find((f) => f.sectionType === "gallery")?.purpose ?? "展示作品或素材方向。",
        items: Array.from({ length: 6 }, (_, i) => ({
          title: `视觉 ${i + 1}`,
          description: t.imageSearchHints[i % t.imageSearchHints.length],
          tag: i === 0 ? "Hero" : "参考",
        })),
      });
    }

    if (type === "dashboard") {
      sections.push({
        id: "dashboard",
        type: "dashboard",
        visible: true,
        title: "实时数据概览",
        description: "用真实业务指标呈现产品状态。",
        metrics: [
          { label: "自动化率", value: "92%", change: "+18%" },
          { label: "响应时间", value: "1.6s", change: "-32%" },
          { label: "活跃项目", value: "48", change: "+12" },
          { label: "转化提升", value: "27%", change: "+9%" },
        ],
        cards: [
          { title: "实时任务流", description: "展示关键任务、阻塞和下一步动作。", value: "运行中", status: "active" },
          { title: "智能提醒", description: "自动识别异常和优先级变化。", value: "3 项", status: "alert" },
          { title: "集成状态", description: "连接业务工具并保持数据同步。", value: "已连接", status: "done" },
        ],
      });
    }

    if (type === "app_preview") {
      const isSidebar = t.id === "dashboard_app_demo";
      sections.push({
        id: "app-preview",
        type: "app_preview",
        visible: true,
        title: "产品 Demo",
        description: "像真实产品一样展示多视图交互。",
        layout: isSidebar ? "sidebar_app" : "split_demo",
        views: ["总览", "工作流", "分析"].map((label, vi) => ({
          id: `view-${vi + 1}`,
          label,
          title: `${label}视图`,
          description: t.interactionRules[vi] ?? "展示该视图下的核心状态。",
          items: [
            { title: "关键状态", description: "当前最需要关注的内容。", status: "active" },
            { title: "下一步", description: "引导用户完成行动。", status: "pending" },
            { title: "结果", description: "展示完成后的收益。", status: "done" },
          ],
        })),
      });
    }

    if (type === "pricing") {
      const isRestaurant = t.id === "restaurant_dark_luxury";
      sections.push({
        id: "pricing",
        type: "pricing",
        visible: true,
        title: isRestaurant ? "菜单与套餐" : "方案与价格",
        description: isRestaurant ? "私厨菜单和定制晚宴方案" : "提供清晰方案，减少决策成本。",
        featuredPlanIndex: 1,
        layout: t.id === "mobile_campaign_card" ? "table" : "cards",
        items: isRestaurant
          ? [
              { name: "品鉴套餐", price: "¥388/位", description: "六道式品鉴菜单，配精选酒水", features: ["前菜三道", "主菜两道", "甜品与Petit Four", "配酒服务"] },
              { name: "主厨定制", price: "¥688/位", description: "八道式定制晚宴，时令食材优先", features: ["主厨私定菜单", "精选配酒", "餐前鸡尾酒", "专属服务"], highlighted: true },
              { name: "包场私宴", price: "按需报价", description: "8-20人完整私宴体验", features: ["专属空间", "定制菜单", "花艺布置", "全程侍酒师"] },
            ]
          : [
              { name: "体验方案", price: "¥99 起", description: "适合初次了解。", features: ["基础咨询", "快速体验", "一次反馈"] },
              { name: "标准方案", price: "¥699 起", description: "适合完整推进。", features: ["完整服务", "阶段反馈", "交付支持"], highlighted: true },
              { name: "定制方案", price: "按需报价", description: "适合复杂需求。", features: ["专属规划", "深度定制", "长期陪伴"] },
            ],
      });
    }

    if (type === "testimonials") {
      sections.push({
        id: "testimonials",
        type: "testimonials",
        visible: true,
        title: "客户反馈",
        layout: t.id.includes("editorial") || t.id.includes("cinematic") ? "editorial" : "cards",
        items: [
          { name: "用户 A", role: "真实客户", content: "页面结构清楚，风格和业务非常贴近。" },
          { name: "用户 B", role: "合作伙伴", content: "视觉方向明确，后续编辑也很方便。" },
          { name: "用户 C", role: "体验用户", content: "行动入口清晰，适合直接发布前打磨。" },
        ],
      });
    }

    if (type === "timeline") {
      sections.push({
        id: "timeline",
        type: "timeline",
        visible: true,
        title: "叙事时间线",
        items: [
          { time: "01", title: "开场", description: "建立情绪和场景。" },
          { time: "02", title: "展开", description: "说明方法、作品或活动流程。" },
          { time: "03", title: "转化", description: "给出预约、购买或联系入口。" },
        ],
      });
    }

    if (type === "process") {
      sections.push({
        id: "process",
        type: "process",
        visible: true,
        title: "服务流程",
        steps: [
          { title: "理解需求", description: "提炼行业、用户和转化目标。" },
          { title: "匹配框架", description: "按「" + t.name + "」模板生成对应结构和视觉语言。" },
          { title: "完善视觉", description: "补充图片方向、图标和交互。" },
        ],
      });
    }

    if (type === "faq") {
      sections.push({
        id: "faq",
        type: "faq",
        visible: true,
        title: "常见问题",
        items: [
          { question: "「" + t.name + "」模板适合我吗？", answer: "如果你需要" + t.tagline + "，这个模板可以帮你快速搭好结构和视觉方向。" },
          { question: "AI 生成失败怎么办？", answer: "当前页面使用模板稳定版，仍可继续编辑和发布。" },
          { question: "可以继续改风格吗？", answer: "可以保留模板框架，同时调整颜色、风格和内容。" },
        ],
      });
    }

    if (type === "contact") {
      sections.push({
        id: "contact",
        type: "contact",
        visible: true,
        title: "预约联系",
        description: "留下需求，继续沟通下一步。",
        contactAction: { type: params.contactAction, label: actionLabel, value: contactValue(params.contactAction) },
      });
    }

    if (type === "cta") {
      const ctaLayout = t.backgroundMode === "dark_manifesto" || t.backgroundMode === "particle_flow" ? "dark" : t.id === "mobile_campaign_card" ? "banner" : t.id === "cinematic_showcase" ? "minimal" : "panel";
      sections.push({
        id: "cta",
        type: "cta",
        visible: true,
        title: "用「" + t.name + "」模板生成你的页面",
        description: t.tagline,
        buttonText: t.id === "restaurant_dark_luxury" ? "立即预约" : "开始生成",
        buttonAction: params.contactAction,
        layout: ctaLayout,
      });
    }
  }

  return sections.slice(0, 12);
}

export function createFallbackPageContent(params: StableGenerateParams, source: "template_fallback" | "mock_fallback" = "mock_fallback"): PageContent {
  const template = getTemplateById(params.templateId);
  const isTemplateFallback = source === "template_fallback" && template;
  const title = titleFromInput(params.userInput, template?.name);
  const now = new Date().toISOString();

  const sections = isTemplateFallback
    ? buildTemplateFallbackSections(params)
    : baseSections(title, params);

  return {
    id: `${source}-${Date.now()}`,
    pageTitle: title,
    pageDescription: `围绕「${params.userInput.slice(0, 80)}」${template ? `使用「${template.name}」模板` : ""}生成的可编辑页面。`,
    pageType: template?.pageType ?? params.pageType,
    layoutPreset: template?.layoutPreset ?? (params.visualMode ? "dynamic_visual" : "product_service_modern"),
    backgroundMode: template?.backgroundMode as PageContent["backgroundMode"] ?? (params.visualMode ? "particle_flow" : "soft_gradient"),
    appMode: template?.appMode,
    interactionMode: template?.interactionMode,
    visualMode: template?.visualMode ?? params.visualMode ?? true,
    theme: {
      style: template?.style ?? params.style,
      primaryColor: template?.primaryColor ?? params.primaryColor,
      fontStyle: (template?.style ?? params.style) === "elegant" ? "classic" : "modern",
    },
    seo: {
      title,
      description: `${template ? `使用「${template.name}」模板` : ""}介绍服务亮点、流程、价格和联系方式。`,
      keywords: [title, template?.name ?? "", "智脑生成"].filter(Boolean),
    },
    contactAction: {
      type: params.contactAction,
      label: contactLabel(params.contactAction),
      value: contactValue(params.contactAction),
    },
    sections,
    assets: { sources: [] },
    createdAt: now,
    updatedAt: now,
  };
}
