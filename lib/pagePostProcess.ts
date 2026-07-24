import { createFallbackPageContent, type StableGenerateParams } from "@/lib/generateFallback";
import { getTemplateById } from "@/lib/templates";
import type {
  PageContent,
  AppPreviewSection,
  DashboardSection,
  GallerySection,
  TimelineSection,
  FAQSection,
  PageSection,
} from "@/types/page";

/**
 * Post-process AI-generated page content to ensure interactive sections
 * have complete, non-empty content. Only fills gaps — never overwrites
 * existing quality content.
 */

function enrichAppPreview(content: PageContent): PageContent {
  const sections = content.sections.map((section) => {
    if (section.type !== "app_preview") return section;
    const s = section as AppPreviewSection;

    const views = s.views ?? [];
    if (views.length === 0) return section;

    const enrichedViews = views.map((view, vi) => {
      const items = view.items ?? [];
      const label = view.label || `视图${vi + 1}`;

      if (items.length >= 3) return view;

      const fillItems = [
        { title: `${label}-项目 1`, description: `这是${label}中的第一项内容，包含具体的使用场景说明`, status: "active" as const },
        { title: `${label}-项目 2`, description: `这是${label}中的第二项内容，展示更多信息细节`, status: "pending" as const },
        { title: `${label}-项目 3`, description: `这是${label}中的第三项内容，补充完整的产品数据`, status: "pending" as const },
      ];

      return { ...view, items: [...items, ...fillItems.slice(items.length)] };
    });

    return { ...s, views: enrichedViews };
  });

  return { ...content, sections };
}

function enrichDashboard(content: PageContent): PageContent {
  const sections = content.sections.map((section) => {
    if (section.type !== "dashboard") return section;
    const s = section as DashboardSection;

    let metrics = s.metrics ?? [];
    let cards = s.cards ?? [];

    if (metrics.length < 4) {
      const fillMetrics = [
        { label: "活跃用户", value: "2,847", change: "+12.5%" },
        { label: "转化率", value: "24.8%", change: "+3.2%" },
        { label: "平均响应", value: "1.2s", change: "-18%" },
        { label: "满意度", value: "98.5%", change: "+0.8%" },
      ];
      metrics = [...metrics, ...fillMetrics.slice(metrics.length)];
    }

    if (cards.length < 4) {
      const fillCards = [
        { title: "系统运行状态", description: "所有服务正常运行，无异常告警", value: "99.9%", status: "active" },
        { title: "月度报表生成", description: "3 月份报表已完成，可下载查看", value: "完成", status: "done" },
        { title: "新功能上线审核", description: "v2.1.0 版本功能等待产品确认", value: "待审核", status: "pending" },
        { title: "安全漏洞扫描", description: "发现 2 个中等风险项需修复", value: "中等", status: "alert" },
      ];
      cards = [...cards, ...fillCards.slice(cards.length)];
    }

    return { ...s, metrics, cards };
  });

  return { ...content, sections };
}

function enrichGallery(content: PageContent): PageContent {
  const sections = content.sections.map((section) => {
    if (section.type !== "gallery") return section;
    const s = section as GallerySection;

    let items = s.items ?? [];

    if (items.length < 6) {
      const fillItems: GallerySection["items"] = [
        { title: "品牌视觉设计", description: "为科技创业公司打造的完整品牌视觉识别系统", tag: "品牌设计" },
        { title: "电商产品摄影", description: "高端护肤品系列的精美产品拍摄与后期处理", tag: "摄影" },
        { title: "移动应用界面", description: "金融科技应用的完整 UI/UX 设计方案", tag: "UI设计" },
        { title: "社交媒体内容", description: "美妆品牌社交媒体的季度内容策划与制作", tag: "内容" },
        { title: "包装设计项目", description: "有机食品品牌的全系列包装设计升级", tag: "包装" },
        { title: "企业宣传片", description: "制造业集团年度品牌宣传片的策划与制作", tag: "视频" },
      ];
      items = [...items, ...fillItems.slice(items.length)];
    }

    return { ...s, items };
  });

  return { ...content, sections };
}

function enrichTimeline(content: PageContent): PageContent {
  const sections = content.sections.map((section) => {
    if (section.type !== "timeline") return section;
    const s = section as TimelineSection;

    let items = s.items ?? [];

    if (items.length < 4) {
      const fillItems: TimelineSection["items"] = [
        { time: "第1周", title: "基础入门", description: "了解核心概念和工具链，搭建开发环境" },
        { time: "第2-3周", title: "核心技能训练", description: "通过实战项目掌握关键技术和最佳实践" },
        { time: "第4-5周", title: "项目实战", description: "独立完成综合项目，从需求分析到上线部署" },
        { time: "第6周", title: "成果展示与复盘", description: "项目答辩、作品集整理，导师一对一反馈" },
      ];
      items = [...items, ...fillItems.slice(items.length)];
    }

    return { ...s, items };
  });

  return { ...content, sections };
}

function enrichFAQ(content: PageContent): PageContent {
  const sections = content.sections.map((section) => {
    if (section.type !== "faq") return section;
    const s = section as FAQSection;

    let items = s.items ?? [];

    if (items.length < 5) {
      const fillItems: FAQSection["items"] = [
        { question: "如何开始使用这个服务？", answer: "注册账号后，您可以根据引导完成初始设置，通常在 5 分钟内即可开始使用核心功能。" },
        { question: "支持哪些支付方式？", answer: "我们支持支付宝、微信支付和银行转账，企业用户还支持对公转账和发票申请。" },
        { question: "数据安全如何保障？", answer: "所有数据传输采用 TLS 加密，数据存储经过 AES-256 加密，我们定期进行安全审计和渗透测试。" },
        { question: "可以退款吗？", answer: "购买后 7 天内支持无理由退款。超过 7 天的订单，我们会根据实际使用情况评估部分退款。" },
        { question: "是否支持团队协作？", answer: "企业版和专业版支持多成员协作，可以设置不同权限角色，支持审批流程和数据隔离。" },
      ];
      items = [...items, ...fillItems.slice(items.length)];
    }

    return { ...s, items };
  });

  return { ...content, sections };
}

/**
 * Visual-mode enrichment: when visualMode is on, ensure the page has
 * stronger visual assets, background mode, and hero visual hints.
 */
function enrichVisual(content: PageContent): PageContent {
  if (!content.visualMode) return content;

  const enriched = { ...content };

  // Ensure backgroundMode is set to a visual-rich option
  if (!enriched.backgroundMode || enriched.backgroundMode === "plain") {
    if (enriched.layoutPreset === "manifesto_dark") enriched.backgroundMode = "dark_manifesto";
    else if (enriched.layoutPreset === "editorial_collage") enriched.backgroundMode = "paper_collage";
    else if (enriched.layoutPreset === "dynamic_visual") enriched.backgroundMode = "particle_flow";
    else enriched.backgroundMode = "soft_gradient";
  }

  // Ensure assets object exists
  if (!enriched.assets) enriched.assets = {};

  // Enrich hero section for visual impact
  const enrichedSections = enriched.sections.map((section) => {
    if (section.type !== "hero") return section;
    // Use spread + cast to add visual fields
    return {
      ...section,
      layout: (section.layout === "center" || !section.layout ? "visual" : section.layout),
      mediaType: (section.mediaType ?? "image"),
      mediaPrompt: (section.mediaPrompt ?? `A visually striking hero image for: ${enriched.pageTitle}`),
      mediaPosition: (section.mediaPosition ?? "right"),
      visualHint: (section.visualHint ?? "专业品牌视觉，高清质感"),
    } as typeof section;
  });

  return { ...enriched, sections: enrichedSections };
}

/** Auto-set appMode based on section presence if AI omitted it */
function detectAppMode(content: PageContent): PageContent {
  if (content.appMode) return content;

  const hasAppPreview = content.sections.some((s) => s.type === "app_preview");
  const hasDashboard = content.sections.some((s) => s.type === "dashboard");
  const hasGallery = content.sections.some((s) => s.type === "gallery");

  if (hasAppPreview) return { ...content, appMode: "app_preview" };
  if (hasDashboard) return { ...content, appMode: "dashboard" };
  if (hasGallery) return { ...content, appMode: "portfolio_app" };

  return content;
}

/**
 * Main entry point: enrich all interactive content in a page.
 * Only fills gaps — never overwrites existing quality content.
 * visualMode gates more aggressive visual enrichment.
 */
export function enrichInteractiveContent(content: PageContent): PageContent {
  let enriched = content;

  enriched = enrichAppPreview(enriched);
  enriched = enrichDashboard(enriched);
  enriched = enrichGallery(enriched);
  enriched = enrichTimeline(enriched);
  enriched = enrichFAQ(enriched);
  enriched = detectAppMode(enriched);
  enriched = enrichVisual(enriched);

  return enriched;
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function validBackground(value: unknown, fallback: PageContent["backgroundMode"]): PageContent["backgroundMode"] {
  return value === "plain" || value === "soft_gradient" || value === "dark_manifesto" || value === "paper_collage" || value === "particle_flow" ? value : fallback;
}

function normalizeKnownSection(section: unknown, index: number, fallback: PageSection): PageSection | null {
  if (!isRecord(section) || typeof section.type !== "string") return null;
  const common = { id: str(section.id, `${section.type}-${index + 1}`), visible: section.visible === false ? false : true };

  if (section.type === "hero") {
    const base = fallback.type === "hero" ? fallback : createFallbackPageContent({ userInput: "", pageType: "product_service", style: "minimal", primaryColor: "blue", contactAction: "wechat" }).sections[0];
    if (base.type !== "hero") return null;
    return { ...base, ...section, ...common, type: "hero", title: str(section.title, base.title), subtitle: str(section.subtitle, base.subtitle), buttonText: str(section.buttonText ?? section.primaryButtonText, base.buttonText), buttonAction: str(section.buttonAction, base.buttonAction) } as PageSection;
  }

  if (section.type === "features") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ title: str(item.title, `亮点 ${itemIndex + 1}`), description: str(item.description, "可在编辑器继续完善说明。"), icon: typeof item.icon === "string" ? item.icon : undefined }));
    return { ...fallback, ...section, ...common, type: "features", title: str(section.title, "核心亮点"), items: items.length ? items : fallback.type === "features" ? fallback.items : [] } as PageSection;
  }

  if (section.type === "pain_points" || section.type === "solution") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ title: str(item.title, `要点 ${itemIndex + 1}`), description: str(item.description, "可在编辑器继续完善说明。") }));
    return { ...fallback, ...section, ...common, type: section.type, title: str(section.title, section.type === "pain_points" ? "用户痛点" : "解决方案"), description: str(section.description, "围绕用户关心的问题给出清晰说明。"), items: items.length ? items : "items" in fallback ? fallback.items : [] } as PageSection;
  }

  if (section.type === "process") {
    const steps = arr(section.steps).filter(isRecord).map((item, itemIndex) => ({ title: str(item.title, `步骤 ${itemIndex + 1}`), description: str(item.description, "可在编辑器继续完善说明。") }));
    return { ...fallback, ...section, ...common, type: "process", title: str(section.title, "服务流程"), steps: steps.length ? steps : fallback.type === "process" ? fallback.steps : [] } as PageSection;
  }

  if (section.type === "pricing") {
    const items = arr(section.items ?? section.plans).filter(isRecord).map((item, itemIndex) => ({ name: str(item.name, `方案 ${itemIndex + 1}`), price: str(item.price, "按需报价"), description: str(item.description, "可在编辑器继续完善。"), features: arr(item.features).filter((feature): feature is string => typeof feature === "string" && feature.trim().length > 0), highlighted: item.highlighted === true }));
    return { ...fallback, ...section, ...common, type: "pricing", title: str(section.title, "方案与价格"), items: items.length ? items : fallback.type === "pricing" ? fallback.items : [] } as PageSection;
  }

  if (section.type === "testimonials") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ name: str(item.name, `客户 ${itemIndex + 1}`), role: str(item.role, "真实用户"), content: str(item.content ?? item.description, "体验清晰、沟通顺畅，值得继续了解。") }));
    return { ...fallback, ...section, ...common, type: "testimonials", title: str(section.title, "客户反馈"), items: items.length ? items : fallback.type === "testimonials" ? fallback.items : [] } as PageSection;
  }

  if (section.type === "faq") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ question: str(item.question, `常见问题 ${itemIndex + 1}`), answer: str(item.answer, "可以在编辑器中补充更完整的回答。") }));
    return { ...fallback, ...section, ...common, type: "faq", title: str(section.title, "常见问题"), items: items.length ? items : fallback.type === "faq" ? fallback.items : [] } as PageSection;
  }

  if (section.type === "contact") {
    return { ...fallback, ...section, ...common, type: "contact", title: str(section.title, "预约咨询"), description: str(section.description, "留下需求，我们会尽快联系你。") } as PageSection;
  }

  if (section.type === "cta") {
    const base = fallback.type === "cta" ? fallback : createFallbackPageContent({ userInput: "", pageType: "product_service", style: "minimal", primaryColor: "blue", contactAction: "wechat" }).sections.at(-1);
    if (!base || base.type !== "cta") return null;
    return { ...base, ...section, ...common, type: "cta", title: str(section.title, base.title), description: str(section.description, base.description), buttonText: str(section.buttonText, base.buttonText), buttonAction: str(section.buttonAction, base.buttonAction) } as PageSection;
  }

  if (section.type === "app_preview") {
    const views = arr(section.views).filter(isRecord).map((view, viewIndex) => ({ id: str(view.id, `view-${viewIndex + 1}`), label: str(view.label, `视图 ${viewIndex + 1}`), title: str(view.title, `视图 ${viewIndex + 1}`), description: str(view.description, "展示该视图下的核心信息。"), items: arr(view.items).filter(isRecord).map((item, itemIndex) => ({ title: str(item.title, `项目 ${itemIndex + 1}`), description: str(item.description, "可在编辑器继续完善。"), meta: typeof item.meta === "string" ? item.meta : undefined, status: typeof item.status === "string" ? item.status : undefined })) }));
    return { ...fallback, ...section, ...common, type: "app_preview", title: str(section.title, "产品 Demo"), views: views.length ? views : fallback.type === "app_preview" ? fallback.views : [] } as PageSection;
  }

  if (section.type === "dashboard") {
    const metrics = arr(section.metrics).filter(isRecord).map((metric, metricIndex) => ({ label: str(metric.label, `指标 ${metricIndex + 1}`), value: str(metric.value, "--"), change: typeof metric.change === "string" ? metric.change : undefined }));
    const cards = arr(section.cards).filter(isRecord).map((card, cardIndex) => ({ title: str(card.title, `卡片 ${cardIndex + 1}`), description: str(card.description, "可在编辑器继续完善。"), value: typeof card.value === "string" ? card.value : undefined, status: typeof card.status === "string" ? card.status : undefined }));
    return { ...fallback, ...section, ...common, type: "dashboard", title: str(section.title, "数据概览"), metrics: metrics.length ? metrics : fallback.type === "dashboard" ? fallback.metrics : [], cards: cards.length ? cards : fallback.type === "dashboard" ? fallback.cards : [] } as PageSection;
  }

  if (section.type === "timeline") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ time: typeof item.time === "string" ? item.time : `阶段 ${itemIndex + 1}`, title: str(item.title, `阶段 ${itemIndex + 1}`), description: str(item.description, "可在编辑器继续完善。") }));
    return { ...fallback, ...section, ...common, type: "timeline", title: str(section.title, "时间安排"), items: items.length ? items : fallback.type === "timeline" ? fallback.items : [] } as PageSection;
  }

  if (section.type === "gallery") {
    const items = arr(section.items).filter(isRecord).map((item, itemIndex) => ({ title: str(item.title, `展示图 ${itemIndex + 1}`), description: typeof item.description === "string" ? item.description : undefined, imageUrl: typeof item.imageUrl === "string" ? item.imageUrl : undefined, tag: typeof item.tag === "string" ? item.tag : undefined }));
    return { ...fallback, ...section, ...common, type: "gallery", title: str(section.title, "视觉展示"), items: items.length ? items : fallback.type === "gallery" ? fallback.items : [] } as PageSection;
  }

  return null;
}

export function normalizePageContent(input: unknown, params: StableGenerateParams): PageContent {
  const raw = isRecord(input) ? input : {};
  const fallback = createFallbackPageContent(params, params.templateId ? "template_fallback" : "mock_fallback");
  const template = getTemplateById(params.templateId);
  const title = str(raw.pageTitle, fallback.pageTitle);
  const description = str(raw.pageDescription, fallback.pageDescription);
  const fallbackByType = new Map<string, PageSection>(fallback.sections.map((section) => [section.type, section]));
  const sections = arr(raw.sections)
    .map((section, index) => {
      const type = isRecord(section) && typeof section.type === "string" ? section.type : "";
      return normalizeKnownSection(section, index, fallbackByType.get(type) ?? fallback.sections[Math.min(index, fallback.sections.length - 1)]);
    })
    .filter((section): section is PageSection => Boolean(section));

  const existingTypes = new Set<string>(sections.map((section) => section.type));
  for (const fallbackSection of fallback.sections) {
    if (!existingTypes.has(fallbackSection.type)) sections.push(fallbackSection);
    existingTypes.add(fallbackSection.type);
  }

  const heroIndex = sections.findIndex((section) => section.type === "hero");
  if (heroIndex > 0) sections.unshift(sections.splice(heroIndex, 1)[0]);
  const ctaIndex = sections.findIndex((section) => section.type === "cta");
  if (ctaIndex >= 0 && ctaIndex !== sections.length - 1) sections.push(sections.splice(ctaIndex, 1)[0]);

  const themeInput = isRecord(raw.theme) ? raw.theme : {};
  const style = themeInput.style === "minimal" || themeInput.style === "business" || themeInput.style === "elegant" || themeInput.style === "tech" || themeInput.style === "youthful" ? themeInput.style : template?.style ?? params.style;
  const primaryColor = themeInput.primaryColor === "blue" || themeInput.primaryColor === "green" || themeInput.primaryColor === "purple" || themeInput.primaryColor === "orange" || themeInput.primaryColor === "black_gold" || themeInput.primaryColor === "pink" ? themeInput.primaryColor : template?.primaryColor ?? params.primaryColor;
  const contactInput = isRecord(raw.contactAction) ? raw.contactAction : {};
  const seoInput = isRecord(raw.seo) ? raw.seo : {};
  const assetsInput = isRecord(raw.assets) ? raw.assets : {};

  const content: PageContent = {
    ...fallback,
    pageTitle: title,
    pageDescription: description,
    pageType: template?.pageType ?? fallback.pageType,
    layoutPreset: template?.layoutPreset ?? str(raw.layoutPreset, fallback.layoutPreset ?? "product_service_modern"),
    backgroundMode: template ? validBackground(template.backgroundMode, fallback.backgroundMode) : validBackground(raw.backgroundMode, fallback.backgroundMode),
    visualMode: template?.visualMode ?? params.visualMode ?? Boolean(raw.visualMode),
    theme: { style, primaryColor, fontStyle: themeInput.fontStyle === "classic" || themeInput.fontStyle === "rounded" ? themeInput.fontStyle : "modern" },
    seo: {
      title: str(seoInput.title, title),
      description: str(seoInput.description, description),
      keywords: arr(seoInput.keywords).filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 8),
    },
    contactAction: {
      type: contactInput.type === "wechat" || contactInput.type === "phone" || contactInput.type === "form" || contactInput.type === "link" || contactInput.type === "email" ? contactInput.type : params.contactAction,
      label: str(contactInput.label, fallback.contactAction.label),
      value: str(contactInput.value, fallback.contactAction.value),
    },
    sections: sections.slice(0, 12),
    assets: {
      heroImageUrl: typeof assetsInput.heroImageUrl === "string" ? assetsInput.heroImageUrl : fallback.assets?.heroImageUrl,
      collageImageUrls: arr(assetsInput.collageImageUrls).filter((item): item is string => typeof item === "string" && item.trim().length > 0),
      coverImageUrl: typeof assetsInput.coverImageUrl === "string" ? assetsInput.coverImageUrl : fallback.assets?.coverImageUrl,
      sources: arr(assetsInput.sources).filter(isRecord).map((source) => ({
        id: typeof source.id === "string" ? source.id : undefined,
        type: source.type === "hero" || source.type === "gallery" || source.type === "icon" || source.type === "cover" ? source.type : undefined,
        title: typeof source.title === "string" ? source.title : undefined,
        source: typeof source.source === "string" ? source.source : undefined,
        url: typeof source.url === "string" ? source.url : undefined,
        imageUrl: typeof source.imageUrl === "string" ? source.imageUrl : undefined,
        licenseHint: typeof source.licenseHint === "string" ? source.licenseHint : undefined,
        provider: typeof source.provider === "string" ? source.provider : undefined,
        createdAt: typeof source.createdAt === "string" ? source.createdAt : undefined,
        disabled: source.disabled === true,
      })),
    },
  };

  if (content.seo.keywords.length === 0) content.seo.keywords = fallback.seo.keywords;
  return enrichInteractiveContent(content);
}
