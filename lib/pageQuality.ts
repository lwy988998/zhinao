import type { TemplatePreset } from "@/lib/templates";
import type {
  AppPreviewSection,
  CTASection,
  ContactSection,
  DashboardSection,
  FAQSection,
  GallerySection,
  HeroSection,
  PageContent,
  PageSection,
} from "@/types/page";

export type PageQualityIssue = {
  code: string;
  severity: "info" | "warning" | "error";
  message: string;
};

export type PageQualityReport = {
  score: number;
  passed: boolean;
  issues: PageQualityIssue[];
  suggestions: string[];
};

type ScoringState = {
  score: number;
  issues: PageQualityIssue[];
  suggestions: string[];
};

const visualSectionTypes = new Set<PageSection["type"]>(["gallery", "app_preview", "dashboard", "timeline"]);
const interactiveSectionTypes = new Set<PageSection["type"]>(["app_preview", "dashboard", "faq"]);
type SectionType = PageSection["type"];
const placeholderTokens = ["lorem", "ipsum", "示例", "占位", "待填写", "TODO", "example.com", "your-"];

function addIssue(state: ScoringState, code: string, severity: PageQualityIssue["severity"], message: string, suggestion?: string) {
  state.issues.push({ code, severity, message });
  if (suggestion && !state.suggestions.includes(suggestion)) state.suggestions.push(suggestion);
}

function hasText(value: string | undefined, minLength = 2): boolean {
  return typeof value === "string" && value.trim().length >= minLength;
}

function visibleSections(content: PageContent): PageSection[] {
  return content.sections.filter((section) => section.visible !== false);
}

function findSection<T extends PageSection["type"]>(content: PageContent, type: T): Extract<PageSection, { type: T }> | undefined {
  return content.sections.find((section): section is Extract<PageSection, { type: T }> => section.type === type);
}

function sectionTypes(content: PageContent): Set<SectionType> {
  return new Set(content.sections.map((section) => section.type));
}

function isSectionType(value: string): value is SectionType {
  return [
    "hero",
    "features",
    "pain_points",
    "solution",
    "process",
    "pricing",
    "testimonials",
    "faq",
    "contact",
    "cta",
    "app_preview",
    "dashboard",
    "timeline",
    "gallery",
  ].includes(value);
}

function pushBaseStructureScore(content: PageContent, state: ScoringState) {
  let points = 0;
  if (hasText(content.pageTitle, 4)) points += 3;
  else addIssue(state, "missing_page_title", "error", "缺少 pageTitle", "补充清晰页面标题");

  if (hasText(content.pageDescription, 10)) points += 3;
  else addIssue(state, "missing_page_description", "warning", "缺少 pageDescription 或描述过短", "补充一句具体页面描述");

  if (findSection(content, "hero")) points += 4;
  else addIssue(state, "missing_hero", "error", "缺少 hero 模块", "补充首屏 hero");

  if (findSection(content, "cta")) points += 3;
  else addIssue(state, "missing_cta", "error", "缺少 cta 模块", "补充行动召唤模块");

  if (findSection(content, "contact")) points += 3;
  else addIssue(state, "missing_contact", "warning", "缺少 contact 模块", "补充联系方式模块");

  const count = visibleSections(content).length;
  if (count >= 5 && count <= 12) points += 4;
  else if (count >= 4) {
    points += 2;
    addIssue(state, "section_count_suboptimal", "info", `模块数量为 ${count}，建议保持 5-12 个模块`, "调整模块数量到 5-12 个");
  } else {
    addIssue(state, "section_count_low", "warning", `模块数量为 ${count}，内容偏薄`, "增加 features、faq、cta 等模块");
  }

  state.score += points;
}

function pushTemplateMatchScore(content: PageContent, template: TemplatePreset | undefined, state: ScoringState) {
  if (!template) {
    state.score += 18;
    if (content.layoutPreset) state.score += 3;
    if (content.backgroundMode) state.score += 4;
    return;
  }

  let points = 0;
  if (content.layoutPreset === template.layoutPreset) points += 5;
  else addIssue(state, "template_layout_mismatch", "warning", "layoutPreset 与模板不一致", "校正模板 layoutPreset");

  if (content.backgroundMode === template.backgroundMode) points += 5;
  else addIssue(state, "template_background_mismatch", "warning", "backgroundMode 与模板不一致", "校正模板 backgroundMode");

  const hero = findSection(content, "hero");
  if (hero?.layout === template.heroFramework.layout) points += 5;
  else addIssue(state, "template_hero_layout_mismatch", "warning", "hero layout 与模板不一致", "校正 hero layout");

  const types = sectionTypes(content);
  const missingRequired = template.requiredSections.filter((type) => isSectionType(type) && !types.has(type));
  if (missingRequired.length === 0) points += 6;
  else addIssue(state, "missing_required_sections", "error", `缺少模板必需模块: ${missingRequired.join(", ")}`, "补齐模板必需模块");

  const forbiddenPresent = (template.forbiddenSections ?? []).filter((type) => isSectionType(type) && types.has(type));
  if (forbiddenPresent.length === 0) points += 4;
  else addIssue(state, "forbidden_sections_present", "error", `包含模板禁止模块: ${forbiddenPresent.join(", ")}`, "移除模板禁止模块");

  state.score += points;
}

function pushVisualRichnessScore(content: PageContent, state: ScoringState) {
  let points = 0;
  const hero = findSection(content, "hero");
  const types = sectionTypes(content);

  if (content.backgroundMode && content.backgroundMode !== "plain") points += 4;
  else if (content.backgroundMode === "plain" && content.visualMode) addIssue(state, "plain_background_visual_mode", "warning", "视觉模式下仍为 plain 背景", "使用更有层次的背景模式");
  else points += 2;

  if (hero?.visualHint || hero?.mediaPrompt || hero?.mediaUrl) points += 6;
  else addIssue(state, "hero_visual_missing", "warning", "hero 缺少 visualHint/mediaPrompt/mediaUrl", "补充 hero 视觉字段");

  const visualBlocks = Array.from(types).filter((type) => visualSectionTypes.has(type)).length;
  if (visualBlocks >= 2) points += 6;
  else if (visualBlocks === 1) points += 4;
  else addIssue(state, "visual_blocks_missing", "info", "缺少 gallery/app_preview/dashboard/timeline 等视觉块", "增加至少一个视觉展示模块");

  const featureLayouts = content.sections
    .filter((section) => section.type === "features")
    .map((section) => section.layout)
    .filter(Boolean);
  if (content.backgroundMode !== "plain" || featureLayouts.some((layout) => layout !== "cards" && layout !== "grid")) points += 4;
  else addIssue(state, "flat_card_stack", "info", "页面可能偏普通卡片堆叠", "混合使用 collage/masonry/numbered 等布局");

  state.score += points;
}

function pushInteractionScore(content: PageContent, state: ScoringState) {
  let points = 0;
  const types = sectionTypes(content);
  const appPreview = findSection(content, "app_preview");
  const dashboard = findSection(content, "dashboard");
  const faq = findSection(content, "faq");
  const cta = findSection(content, "cta");

  if (content.interactionMode && content.interactionMode !== "static") points += 4;
  else if (content.interactionMode === "static") points += 2;
  else addIssue(state, "interaction_mode_missing", "info", "缺少 interactionMode", "设置页面交互强度");

  if (Array.from(types).some((type) => interactiveSectionTypes.has(type))) points += 4;
  else addIssue(state, "interactive_sections_missing", "info", "缺少互动型模块", "增加 FAQ/app_preview/dashboard 等模块");

  if (!appPreview || (appPreview.views.length >= 3 && appPreview.views.every((view) => (view.items ?? []).length >= 3))) points += 4;
  else addIssue(state, "app_preview_incomplete", "warning", "app_preview 视图或条目不足", "补齐 app_preview 的 3 个视图和条目");

  if (!dashboard || (dashboard.metrics.length >= 4 && dashboard.cards.length >= 4)) points += 4;
  else addIssue(state, "dashboard_incomplete", "warning", "dashboard 指标或卡片不足", "补齐 dashboard 指标和卡片");

  if (!faq || faq.interactionType === "accordion" || faq.items.length >= 3) points += 2;
  else addIssue(state, "faq_incomplete", "info", "FAQ 条目不足或未设置 accordion", "补齐 FAQ 条目");

  if (cta && hasText(cta.buttonText) && hasText(cta.buttonAction)) points += 2;
  else addIssue(state, "cta_action_weak", "warning", "CTA 动作不明确", "补充 CTA 按钮文字和动作");

  state.score += points;
}

function pushCopyScore(content: PageContent, state: ScoringState) {
  let points = 0;
  const textParts = [
    content.pageTitle,
    content.pageDescription,
    ...content.sections.flatMap((section) => [section.title, section.description]),
  ].filter((value): value is string => hasText(value));
  const joined = textParts.join(" ");

  if (textParts.length >= Math.min(content.sections.length + 2, 8)) points += 4;
  else addIssue(state, "copy_missing", "warning", "部分模块文案为空", "补充模块标题和描述");

  if (joined.length >= 120) points += 4;
  else addIssue(state, "copy_too_short", "info", "整体文案偏短", "补充更具体的业务场景");

  if (!placeholderTokens.some((token) => joined.toLowerCase().includes(token.toLowerCase()))) points += 4;
  else addIssue(state, "placeholder_copy", "warning", "文案中疑似存在占位内容", "替换占位文案");

  const hasConcreteSignal = /\d|第|位|天|周|月|用户|客户|预约|报名|门店|产品|服务|作品|课程|方案/.test(joined);
  if (hasConcreteSignal) points += 3;
  else addIssue(state, "copy_not_specific", "info", "文案具体度不足", "加入数字、场景或行业词");

  state.score += points;
}

export function scoreGeneratedPage(content: PageContent, template?: TemplatePreset): PageQualityReport {
  const state: ScoringState = { score: 0, issues: [], suggestions: [] };

  try {
    pushBaseStructureScore(content, state);
    pushTemplateMatchScore(content, template, state);
    pushVisualRichnessScore(content, state);
    pushInteractionScore(content, state);
    pushCopyScore(content, state);
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知评分异常";
    addIssue(state, "quality_scoring_failed", "warning", `质量评分异常: ${message.slice(0, 80)}`, "跳过质量评分，不影响生成");
  }

  const score = Math.max(0, Math.min(100, Math.round(state.score)));
  return {
    score,
    passed: score >= 75 && !state.issues.some((issue) => issue.severity === "error"),
    issues: state.issues.slice(0, 20),
    suggestions: state.suggestions.slice(0, 8),
  };
}

function heroSection(template?: TemplatePreset): HeroSection {
  return {
    id: "hero",
    type: "hero",
    visible: true,
    title: template?.previewData.pageTitle ?? "清晰呈现你的业务价值",
    subtitle: template?.tagline ?? "用稳定模式补齐页面首屏，后续可继续编辑细节。",
    buttonText: "开始咨询",
    buttonAction: "wechat",
    layout: template?.heroFramework.layout ?? "visual",
    badge: template?.tagline ?? "稳定修复模式",
    visualHint: template?.heroFramework.visualDirection ?? "专业品牌视觉，层次清晰",
    mediaType: "image",
    mediaPrompt: template?.heroFramework.mediaStrategy ?? "适合网页首屏的高质量抽象品牌视觉，不含 logo 和商标",
    mediaPosition: template?.heroFramework.layout === "immersive" || template?.heroFramework.layout === "manifesto" ? "background" : "right",
  };
}

function ctaSection(template?: TemplatePreset): CTASection {
  return {
    id: "cta",
    type: "cta",
    visible: true,
    title: template ? `使用「${template.name}」继续完善页面` : "准备好继续推进了吗？",
    description: template?.tagline ?? "页面已自动补齐关键行动入口，可继续编辑后发布。",
    buttonText: "立即咨询",
    buttonAction: "wechat",
    layout: template?.backgroundMode === "dark_manifesto" || template?.backgroundMode === "particle_flow" ? "dark" : "panel",
  };
}

function contactSection(): ContactSection {
  return {
    id: "contact",
    type: "contact",
    visible: true,
    title: "预约联系",
    description: "留下需求，我们会根据当前情况给出下一步建议。",
    contactAction: { type: "wechat", label: "添加微信咨询", value: "your-wechat-id" },
  };
}

function appPreviewRepairSection(template?: TemplatePreset): AppPreviewSection {
  return {
    id: "app-preview",
    type: "app_preview",
    visible: true,
    title: "产品演示",
    description: template?.sectionFrameworks.find((item) => item.sectionType === "app_preview")?.purpose ?? "展示产品核心视图和关键状态。",
    layout: template?.id === "dashboard_app_demo" ? "sidebar_app" : "split_demo",
    views: ["总览", "工作流", "分析"].map((label, index) => ({
      id: `view-${index + 1}`,
      label,
      title: `${label}视图`,
      description: "展示该视图下的核心信息。",
      items: [
        { title: "关键状态", description: "当前最需要关注的内容。", status: "active" },
        { title: "下一步", description: "引导用户完成行动。", status: "pending" },
        { title: "结果", description: "展示完成后的收益。", status: "done" },
      ],
    })),
  };
}

function dashboardRepairSection(template?: TemplatePreset): DashboardSection {
  return {
    id: "dashboard",
    type: "dashboard",
    visible: true,
    title: "数据仪表盘",
    description: template?.sectionFrameworks.find((item) => item.sectionType === "dashboard")?.purpose ?? "用指标呈现业务状态。",
    metrics: [
      { label: "转化率", value: "27%", change: "+8%" },
      { label: "响应时间", value: "1.6s", change: "-22%" },
      { label: "活跃项目", value: "48", change: "+12" },
      { label: "满意度", value: "98%", change: "+3%" },
    ],
    cards: [
      { title: "任务流", description: "展示关键任务与状态。", value: "运行中", status: "active" },
      { title: "提醒", description: "识别需要处理的异常。", value: "3 项", status: "alert" },
      { title: "集成", description: "保持业务数据同步。", value: "已连接", status: "done" },
      { title: "报告", description: "自动生成阶段性总结。", value: "已更新", status: "done" },
    ],
  };
}

function galleryRepairSection(template?: TemplatePreset): GallerySection {
  const hints = template?.imageSearchHints.length ? template.imageSearchHints : ["品牌视觉", "产品场景", "服务细节", "用户体验"];
  return {
    id: "gallery",
    type: "gallery",
    visible: true,
    title: "视觉展示",
    description: "展示可替换的视觉方向。",
    items: Array.from({ length: 6 }, (_, index) => ({
      title: `视觉 ${index + 1}`,
      description: hints[index % hints.length],
      tag: index === 0 ? "Hero" : "参考",
    })),
  };
}

function faqRepairSection(): FAQSection {
  return {
    id: "faq",
    type: "faq",
    visible: true,
    title: "常见问题",
    interactionType: "accordion",
    items: [
      { question: "这个页面可以继续修改吗？", answer: "可以，生成后可在编辑器里继续调整文案、图片和联系方式。" },
      { question: "联系方式在哪里填写？", answer: "可以在联系模块和 CTA 模块中替换为真实联系方式。" },
      { question: "适合直接发布吗？", answer: "建议补充真实案例、价格和联系方式后再发布。" },
    ],
  };
}

function fallbackSection(type: SectionType, template?: TemplatePreset): PageSection | null {
  const fromTemplate = template?.previewData.sections.find((section) => section.type === type);
  if (fromTemplate) return { ...fromTemplate, id: fromTemplate.id ?? type, visible: fromTemplate.visible ?? true };
  if (type === "hero") return heroSection(template);
  if (type === "cta") return ctaSection(template);
  if (type === "contact") return contactSection();
  if (type === "gallery") return galleryRepairSection(template);
  if (type === "app_preview") return appPreviewRepairSection(template);
  if (type === "dashboard") return dashboardRepairSection(template);
  if (type === "faq") return faqRepairSection();
  return null;
}

function repairAppPreview(section: AppPreviewSection, template?: TemplatePreset): AppPreviewSection {
  const repair = appPreviewRepairSection(template);
  const views = section.views.length ? section.views : repair.views;
  return {
    ...section,
    layout: section.layout ?? repair.layout,
    views: views.slice(0, Math.max(3, views.length)).map((view, index) => {
      const fill = repair.views[index % repair.views.length];
      const items = view.items ?? [];
      return {
        ...fill,
        ...view,
        items: items.length >= 3 ? items : [...items, ...(fill.items ?? []).slice(items.length)],
      };
    }),
  };
}

function repairDashboard(section: DashboardSection, template?: TemplatePreset): DashboardSection {
  const repair = dashboardRepairSection(template);
  return {
    ...section,
    metrics: section.metrics.length >= 4 ? section.metrics : [...section.metrics, ...repair.metrics.slice(section.metrics.length)],
    cards: section.cards.length >= 4 ? section.cards : [...section.cards, ...repair.cards.slice(section.cards.length)],
  };
}

function repairGallery(section: GallerySection, template?: TemplatePreset): GallerySection {
  const repair = galleryRepairSection(template);
  return {
    ...section,
    items: section.items.length >= 6 ? section.items : [...section.items, ...repair.items.slice(section.items.length)],
  };
}

function repairFAQ(section: FAQSection): FAQSection {
  const repair = faqRepairSection();
  return {
    ...section,
    interactionType: section.interactionType ?? "accordion",
    items: section.items.length >= 3 ? section.items : [...section.items, ...repair.items.slice(section.items.length)],
  };
}

function repairHero(section: HeroSection, template?: TemplatePreset): HeroSection {
  const repair = heroSection(template);
  return {
    ...section,
    layout: template?.heroFramework.layout ?? section.layout ?? repair.layout,
    mediaType: section.mediaType ?? repair.mediaType,
    mediaPosition: section.mediaPosition ?? repair.mediaPosition,
    visualHint: section.visualHint ?? repair.visualHint,
    mediaPrompt: section.mediaPrompt ?? repair.mediaPrompt,
    badge: section.badge ?? repair.badge,
  };
}

function repairCTA(section: CTASection, template?: TemplatePreset): CTASection {
  const repair = ctaSection(template);
  return {
    ...section,
    buttonText: hasText(section.buttonText) ? section.buttonText : repair.buttonText,
    buttonAction: hasText(section.buttonAction) ? section.buttonAction : repair.buttonAction,
    layout: section.layout ?? repair.layout,
  };
}

function repairSection(section: PageSection, template?: TemplatePreset): PageSection {
  if (section.type === "hero") return repairHero(section, template);
  if (section.type === "cta") return repairCTA(section, template);
  if (section.type === "app_preview") return repairAppPreview(section, template);
  if (section.type === "dashboard") return repairDashboard(section, template);
  if (section.type === "gallery") return repairGallery(section, template);
  if (section.type === "faq") return repairFAQ(section);
  return section;
}

export function repairGeneratedPage(content: PageContent, report: PageQualityReport, template?: TemplatePreset): PageContent {
  try {
    const forbidden = new Set(template?.forbiddenSections ?? []);
    const sections = content.sections.filter((section) => !forbidden.has(section.type)).map((section) => repairSection(section, template));
    const existing = new Set(sections.map((section) => section.type));

    const baselineTypes: SectionType[] = ["hero", "cta", "contact"];
    for (const type of baselineTypes) {
      if (!existing.has(type)) {
        const section = fallbackSection(type, template);
        if (section) sections.push(section);
        existing.add(type);
      }
    }

    for (const type of template?.requiredSections ?? []) {
      if (!isSectionType(type) || existing.has(type)) continue;
      const section = fallbackSection(type, template);
      if (section) sections.push(section);
      existing.add(type);
    }

    if (content.visualMode && !sections.some((section) => visualSectionTypes.has(section.type))) {
      const visualFallbackType: SectionType = template?.requiredSections.includes("app_preview") ? "app_preview" : "gallery";
      const section = fallbackSection(visualFallbackType, template);
      if (section && !existing.has(section.type)) sections.push(section);
    }

    sections.sort((a, b) => {
      if (!template) {
        const order = ["hero", "features", "gallery", "app_preview", "dashboard", "pricing", "faq", "contact", "cta"];
        return (order.indexOf(a.type) === -1 ? 99 : order.indexOf(a.type)) - (order.indexOf(b.type) === -1 ? 99 : order.indexOf(b.type));
      }
      const ai = template.recommendedSections.indexOf(a.type);
      const bi = template.recommendedSections.indexOf(b.type);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

    const repaired: PageContent = {
      ...content,
      pageTitle: hasText(content.pageTitle, 4) ? content.pageTitle : template?.previewData.pageTitle ?? "稳定修复页面",
      pageDescription: hasText(content.pageDescription, 10) ? content.pageDescription : template?.previewData.pageDescription ?? "系统已自动补齐页面关键结构，可继续编辑。",
      layoutPreset: template?.layoutPreset ?? content.layoutPreset,
      backgroundMode: template?.backgroundMode ?? content.backgroundMode ?? (content.visualMode ? "soft_gradient" : "plain"),
      visualMode: template?.visualMode ?? content.visualMode,
      interactionMode: template?.interactionMode ?? content.interactionMode,
      appMode: template?.appMode ?? content.appMode,
      sections: sections.slice(0, 12),
    };

    if (!report.passed) {
      repaired.updatedAt = new Date().toISOString();
    }

    return repaired;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`[quality] repair skipped=${message.slice(0, 120)}`);
    return content;
  }
}
