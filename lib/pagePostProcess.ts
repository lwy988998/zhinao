import type {
  PageContent,
  AppPreviewSection,
  DashboardSection,
  GallerySection,
  TimelineSection,
  FAQSection,
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

  let enriched = { ...content };

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
