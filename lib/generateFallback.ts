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

function titleFromInput(input: string): string {
  const normalized = input.replace(/[\n\r]+/g, " ").trim();
  const first = normalized.split(/[。！？!?]/)[0]?.trim() || normalized;
  return first.length > 24 ? `${first.slice(0, 24)}...` : first || "稳定模式生成页面";
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
      id: "solution",
      type: "solution",
      visible: true,
      title: "适合解决的问题",
      description: "把用户最关心的顾虑提前讲明白。",
      items: [
        { title: "不知道是否适合", description: "用具体场景说明目标用户和使用条件。" },
        { title: "担心效果不明确", description: "用流程、案例和评价降低决策成本。" },
        { title: "缺少行动入口", description: "在首屏、价格和底部都保留清晰咨询入口。" },
      ],
    },
    {
      id: "process",
      type: "process",
      visible: true,
      title: "服务流程",
      steps: [
        { title: "沟通需求", description: "了解目标、预算、时间和当前状态。" },
        { title: "匹配方案", description: "根据场景推荐合适的服务或产品组合。" },
        { title: "确认执行", description: "明确交付内容、节奏和后续支持方式。" },
        { title: "持续优化", description: "根据反馈调整内容，让页面更贴近真实转化。" },
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

function addTemplateSections(sections: PageSection[], params: StableGenerateParams): PageSection[] {
  const template = getTemplateById(params.templateId);
  if (!template) return sections;
  const existingTypes = new Set<string>(sections.map((section) => section.type));
  const additions: PageSection[] = [];

  for (const type of template.recommendedSections) {
    if (existingTypes.has(type)) continue;
    if (type === "gallery") {
      additions.push({
        id: "gallery",
        type: "gallery",
        visible: true,
        title: "视觉展示",
        description: "展示空间、产品或作品细节，图片可在编辑器继续替换。",
        items: Array.from({ length: 6 }, (_, index) => ({ title: `展示图 ${index + 1}`, description: "可替换为真实案例或环境图片", tag: "精选" })),
      });
    }
    if (type === "dashboard") {
      additions.push({
        id: "dashboard",
        type: "dashboard",
        visible: true,
        title: "实时数据概览",
        metrics: [
          { label: "任务完成率", value: "92%", change: "+8%" },
          { label: "响应时间", value: "1.8s", change: "-21%" },
          { label: "活跃项目", value: "36", change: "+12" },
          { label: "满意度", value: "98%", change: "+3%" },
        ],
        cards: [
          { title: "自动分派", description: "按优先级把任务流转给对应角色。", value: "运行中", status: "active" },
          { title: "风险提醒", description: "识别延期、重复和阻塞事项。", value: "3 项", status: "alert" },
          { title: "日报生成", description: "自动整理今日进展和明日计划。", value: "已完成", status: "done" },
        ],
      });
    }
    if (type === "app_preview") {
      additions.push({
        id: "app-preview",
        type: "app_preview",
        visible: true,
        title: "产品 Demo",
        description: "用应用预览说明核心工作流。",
        layout: "sidebar_app",
        views: ["总览", "任务", "报表"].map((label, index) => ({
          id: `view-${index + 1}`,
          label,
          title: `${label}视图`,
          description: "展示真实使用状态和下一步动作。",
          items: [
            { title: "关键事项", description: "系统自动整理重要事项。", status: "active" },
            { title: "待处理", description: "需要人工确认的内容。", status: "pending" },
            { title: "已完成", description: "最近完成的工作记录。", status: "done" },
          ],
        })),
      });
    }
    existingTypes.add(type);
  }

  if (additions.length === 0) return sections;
  const hero = sections[0];
  return [hero, ...additions.slice(0, 2), ...sections.slice(1)].slice(0, 10);
}

export function createFallbackPageContent(params: StableGenerateParams, source: "template_fallback" | "mock_fallback" = "mock_fallback"): PageContent {
  const template = getTemplateById(params.templateId);
  const title = titleFromInput(params.userInput);
  const now = new Date().toISOString();
  const templateStyle = template?.style ?? params.style;
  const templateColor = template?.primaryColor ?? params.primaryColor;
  const templatePageType = template?.pageType ?? params.pageType;
  const sections = addTemplateSections(baseSections(title, params), params);

  return {
    id: `${source}-${Date.now()}`,
    pageTitle: title,
    pageDescription: `围绕「${params.userInput.slice(0, 80)}」生成的可编辑页面。`,
    pageType: templatePageType,
    layoutPreset: template?.layoutPreset ?? (params.visualMode ? "dynamic_visual" : "product_service_modern"),
    backgroundMode: (template?.backgroundMode as PageContent["backgroundMode"]) ?? (params.visualMode ? "particle_flow" : "soft_gradient"),
    visualMode: template?.visualMode ?? params.visualMode,
    theme: {
      style: templateStyle,
      primaryColor: templateColor,
      fontStyle: templateStyle === "elegant" ? "classic" : "modern",
    },
    seo: {
      title,
      description: `介绍${title}的服务亮点、流程、价格、常见问题和联系方式。`,
      keywords: [title, "服务介绍", "咨询", "预约", "智脑生成"],
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
