import type { AppMode, BackgroundMode, HeroLayout, InteractionMode, PageContent, PageSection, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

export type TemplateCategory = "featured" | "business" | "personal" | "product" | "event" | "portfolio" | "app";

export type TemplatePreviewStyle =
  | "liquid_glass"
  | "cinematic"
  | "restaurant_dark"
  | "agent_dark"
  | "brand_warm"
  | "mobile_poster"
  | "editorial_collage"
  | "dynamic_visual"
  | "full_image_brand";

export type TemplateHeroFramework = {
  layout: HeroLayout;
  tone: string;
  visualDirection: string;
  titleStyle: string;
  subtitleStyle: string;
  ctaStyle: string;
  mediaStrategy: string;
};

export type TemplateSectionFramework = {
  sectionType: string;
  purpose: string;
  layoutHint: string;
  contentRules: string[];
  interactionHint: string;
  imageHint?: string;
};

export type TemplatePreset = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: TemplateCategory;
  categories: TemplateCategory[];
  previewStyle: TemplatePreviewStyle;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  visualMode: boolean;
  layoutPreset: string;
  backgroundMode: BackgroundMode;
  interactionMode: InteractionMode;
  appMode?: AppMode;
  recommendedSections: string[];
  requiredSections: string[];
  forbiddenSections?: string[];
  heroFramework: TemplateHeroFramework;
  sectionFrameworks: TemplateSectionFramework[];
  visualRules: string[];
  copywritingRules: string[];
  interactionRules: string[];
  imageSearchHints: string[];
  iconSearchHints: string[];
  promptFramework: string;
  promptGuidance: string;
  negativePromptRules: string[];
  qualityChecklist: string[];
  previewData: PageContent;
};

type TemplateSeed = Omit<TemplatePreset, "promptGuidance" | "previewData"> & {
  previewTitle: string;
  previewDescription: string;
  previewHeroSubtitle: string;
};

const defaultChecklist = [
  "页面结构是否符合模板",
  "Hero 是否有视觉焦点",
  "文案是否符合行业",
  "CTA 是否明确",
  "是否有交互",
  "是否移动端友好",
];

function sectionTitle(type: string): string {
  const titles: Record<string, string> = {
    hero: "核心首屏",
    features: "核心能力",
    gallery: "视觉展示",
    testimonials: "用户反馈",
    timeline: "叙事时间线",
    process: "服务流程",
    pricing: "方案价格",
    faq: "常见问题",
    contact: "预约联系",
    cta: "行动召唤",
    app_preview: "应用预览",
    dashboard: "数据仪表盘",
    solution: "解决方案",
    pain_points: "用户痛点",
  };
  return titles[type] ?? type;
}

function previewSection(type: string, template: TemplateSeed): PageSection | null {
  if (type === "hero") {
    return {
      id: "hero",
      type: "hero",
      visible: true,
      title: template.previewTitle,
      subtitle: template.previewHeroSubtitle,
      buttonText: template.pageType === "event_signup" ? "立即报名" : template.pageType === "local_business" ? "预约咨询" : "查看方案",
      buttonAction: template.pageType === "local_business" ? "phone" : "wechat",
      layout: template.heroFramework.layout,
      badge: template.tagline,
      kicker: template.category.toUpperCase(),
      visualHint: template.heroFramework.visualDirection,
      mediaType: template.heroFramework.layout === "fullscreen_image" ? "image" : "abstract",
      mediaPrompt: template.heroFramework.mediaStrategy,
      mediaPosition: template.heroFramework.layout === "immersive" || template.heroFramework.layout === "manifesto" || template.heroFramework.layout === "fullscreen_image" ? "background" : "right",
      overlay: template.heroFramework.layout === "fullscreen_image" ? "gradient" : undefined,
      navStyle: template.heroFramework.layout === "fullscreen_image" ? "overlay" : undefined,
      interactionType: template.interactionMode === "interactive_demo" ? "tabs" : template.interactionMode === "interactive_showcase" ? "carousel" : "none",
      interactiveItems: [
        { title: "核心价值", description: template.tagline, status: "active" },
        { title: "视觉方向", description: template.heroFramework.visualDirection, status: "preview" },
        { title: "行动入口", description: template.heroFramework.ctaStyle, status: "ready" },
      ],
    };
  }

  if (type === "features") {
    const layoutMap: Record<string, string> = {
      "editorial_portfolio": "collage",
      "mobile_campaign_card": "numbered",
      "warm_brand_story": "cards",
      "liquid_glass_studio": "masonry",
      "ai_agent_dark": "grid",
      "dashboard_app_demo": "grid",
    };
    return {
      id: "features",
      type: "features",
      visible: true,
      title: sectionTitle(type),
      description: template.sectionFrameworks.find((item) => item.sectionType === type)?.purpose ?? "展示模板核心能力。",
      layout: (layoutMap[template.id] ?? "grid") as "grid" | "cards" | "list" | "numbered" | "collage" | "masonry",
      interactionType: template.interactionMode === "interactive_demo" ? "tabs" : "none",
      items: [
        { title: "结构明确", description: "按模板框架组织信息，不再生成千篇一律页面。" },
        { title: "视觉统一", description: template.visualRules[0] ?? template.heroFramework.visualDirection },
        { title: "可继续编辑", description: "生成后可替换文案、图片、价格和联系方式。" },
      ],
      tabs: [
        { label: "定位", title: "模板定位", description: template.tagline, highlights: template.copywritingRules.slice(0, 3) },
        { label: "视觉", title: "视觉规则", description: template.heroFramework.visualDirection, highlights: template.visualRules.slice(0, 3) },
      ],
    };
  }

  if (type === "gallery") {
    return {
      id: "gallery",
      type: "gallery",
      visible: true,
      title: sectionTitle(type),
      description: template.sectionFrameworks.find((item) => item.sectionType === type)?.purpose ?? "展示作品或素材方向。",
      layout: template.id === "full_image_brand" ? "full_bleed_grid" : undefined,
      items: Array.from({ length: 6 }, (_, itemIndex) => ({ title: template.id === "full_image_brand" ? ["产品系列", "应用场景", "材质细节", "工艺流程", "空间氛围", "品牌视觉"][itemIndex] : `视觉 ${itemIndex + 1}`, description: template.imageSearchHints[itemIndex % template.imageSearchHints.length], tag: itemIndex === 0 ? "Hero" : "参考", category: template.id === "full_image_brand" ? ["产品系列", "应用场景", "材质工艺"][itemIndex % 3] : undefined })),
    };
  }

  if (type === "dashboard") {
    return {
      id: "dashboard",
      type: "dashboard",
      visible: true,
      title: sectionTitle(type),
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
    };
  }

  if (type === "app_preview") {
    return {
      id: "app-preview",
      type: "app_preview",
      visible: true,
      title: sectionTitle(type),
      description: "像真实产品一样展示多视图交互。",
      layout: template.id === "dashboard_app_demo" ? "sidebar_app" : "split_demo",
      views: ["总览", "工作流", "分析"].map((label, viewIndex) => ({
        id: `view-${viewIndex + 1}`,
        label,
        title: `${label}视图`,
        description: template.interactionRules[viewIndex] ?? "展示该视图下的核心状态。",
        items: [
          { title: "关键状态", description: "当前最需要关注的内容。", status: "active" },
          { title: "下一步", description: "引导用户完成行动。", status: "pending" },
          { title: "结果", description: "展示完成后的收益。", status: "done" },
        ],
      })),
    };
  }

  if (type === "timeline") {
    return {
      id: "timeline",
      type: "timeline",
      visible: true,
      title: sectionTitle(type),
      items: [
        { time: "01", title: "开场", description: "建立情绪和场景。" },
        { time: "02", title: "展开", description: "说明方法、作品或活动流程。" },
        { time: "03", title: "转化", description: "给出预约、购买或联系入口。" },
      ],
    };
  }

  if (type === "pricing") {
    const isRestaurant = template.id === "restaurant_dark_luxury";
    return {
      id: "pricing",
      type: "pricing",
      visible: true,
      title: isRestaurant ? "菜单与套餐" : sectionTitle(type),
      description: isRestaurant ? "私厨菜单和定制晚宴方案" : "提供清晰方案，减少决策成本。",
      featuredPlanIndex: 1,
      layout: template.id === "mobile_campaign_card" ? "table" : "cards",
      items: isRestaurant
        ? [
            { name: "品鉴套餐", price: "¥388/位", description: "六道式品鉴菜单，配精选酒水", features: ["前菜三道", "主菜两道", "甜品与Petit Four", "配酒服务"] },
            { name: "主厨定制", price: "¥688/位", description: "八道式定制晚宴，时令食材优先", features: ["主厨私定菜单", "精选配酒", "餐前鸡尾酒", "专属服务"], highlighted: true },
            { name: "包场私宴", price: "按需报价", description: "8-20人完整私宴体验", features: ["专属空间", "定制菜单", "花艺布置", "全程侍酒师"] },
          ]
        : [
            { name: "体验版", price: "¥99 起", description: "适合初次了解。", features: ["基础咨询", "快速体验", "一次反馈"] },
            { name: "标准版", price: "¥699 起", description: "适合完整推进。", features: ["完整服务", "阶段反馈", "交付支持"], highlighted: true },
            { name: "定制版", price: "按需报价", description: "适合复杂项目。", features: ["专属规划", "深度定制", "长期支持"] },
          ],
    };
  }

  if (type === "testimonials") {
    return {
      id: "testimonials",
      type: "testimonials",
      visible: true,
      title: sectionTitle(type),
      layout: template.id.includes("editorial") || template.id.includes("cinematic") ? "editorial" : "cards",
      items: [
        { name: "用户 A", role: "真实客户", content: "页面结构清楚，风格和业务非常贴近。" },
        { name: "用户 B", role: "合作伙伴", content: "视觉方向明确，后续编辑也很方便。" },
        { name: "用户 C", role: "体验用户", content: "行动入口清晰，适合直接发布前打磨。" },
      ],
    };
  }

  if (type === "process") {
    return {
      id: "process",
      type: "process",
      visible: true,
      title: sectionTitle(type),
      steps: [
        { title: "理解需求", description: "提炼行业、用户和转化目标。" },
        { title: "匹配框架", description: "按模板生成对应结构。" },
        { title: "完善视觉", description: "补充图片方向、图标和交互。" },
      ],
    };
  }

  if (type === "faq") {
    return {
      id: "faq",
      type: "faq",
      visible: true,
      title: sectionTitle(type),
      items: [
        { question: "这个模板会生成不同结构吗？", answer: "会。模板框架会约束 section、Hero、交互和视觉方向。" },
        { question: "图片搜索失败怎么办？", answer: "不会影响生成，页面仍可编辑和发布。" },
        { question: "可以继续改风格吗？", answer: "可以保留模板框架，同时调整颜色、风格和内容。" },
      ],
    };
  }

  if (type === "contact") {
    return { id: "contact", type: "contact", visible: true, title: sectionTitle(type), description: "留下需求，继续沟通下一步。", contactAction: { type: "wechat", label: "添加微信咨询", value: "your-wechat-id" } };
  }

  if (type === "cta") {
    const ctaLayout = template.backgroundMode === "dark_manifesto" || template.backgroundMode === "particle_flow" ? "dark" : template.id === "mobile_campaign_card" ? "banner" : template.id === "cinematic_showcase" ? "minimal" : "panel";
    return { id: "cta", type: "cta", visible: true, title: "用这个模板生成你的页面", description: template.tagline, buttonText: template.id === "restaurant_dark_luxury" ? "立即预约" : "开始生成", buttonAction: "wechat", layout: ctaLayout };
  }

  if (type === "solution" || type === "pain_points") {
    return {
      id: type,
      type,
      visible: true,
      title: sectionTitle(type),
      description: "把用户关心的问题转成清晰答案。",
      items: [
        { title: "降低理解成本", description: "直接说明适合谁、解决什么问题。" },
        { title: "强化信任", description: "用流程、案例和反馈支持主张。" },
        { title: "推动行动", description: "在关键位置给出明确 CTA。" },
      ],
    };
  }

  return null;
}

function buildPreviewData(template: TemplateSeed): PageContent {
  const sections = template.recommendedSections.map((type) => previewSection(type, template)).filter((section): section is PageSection => Boolean(section));
  const navigation = template.id === "full_image_brand"
    ? {
        type: "top" as const,
        items: [
          { id: "nav-brand-story", label: "品牌故事", targetSectionId: "brand-story" },
          { id: "nav-design", label: "设计理念", targetSectionId: "design-philosophy" },
          { id: "nav-products", label: "产品系列", targetSectionId: "product-series" },
          { id: "nav-craft", label: "材质工艺", targetSectionId: "craft" },
          { id: "nav-scenes", label: "应用场景", targetSectionId: "gallery" },
          { id: "nav-contact", label: "联系我们", targetSectionId: "section-contact" },
        ],
      }
    : template.appMode === "dashboard" || template.appMode === "app_preview"
      ? { type: "hybrid" as const, items: sections.slice(0, 5).map((section) => ({ id: section.id ?? section.type, label: sectionTitle(section.type), targetSectionId: section.id ?? section.type })) }
      : undefined;

  return {
    id: `preview-${template.id}`,
    pageTitle: template.previewTitle,
    pageDescription: template.previewDescription,
    pageType: template.pageType,
    layoutPreset: template.layoutPreset,
    backgroundMode: template.backgroundMode,
    interactionMode: template.interactionMode,
    appMode: template.appMode,
    visualMode: true,
    navigation,
    theme: { style: template.style, primaryColor: template.primaryColor, fontStyle: template.style === "elegant" ? "classic" : template.style === "youthful" ? "rounded" : "modern" },
    seo: { title: template.previewTitle, description: template.previewDescription, keywords: [template.name, template.tagline, ...template.imageSearchHints.slice(0, 4)] },
    contactAction: { type: template.pageType === "local_business" ? "phone" : "wechat", label: template.pageType === "local_business" ? "电话预约" : "添加微信咨询", value: "your-contact" },
    sections,
    assets: { sources: [] },
  };
}

function makeTemplate(seed: TemplateSeed): TemplatePreset {
  return {
    ...seed,
    promptGuidance: seed.promptFramework,
    qualityChecklist: seed.qualityChecklist.length ? seed.qualityChecklist : defaultChecklist,
    previewData: buildPreviewData(seed),
  };
}

const templateSeeds: TemplateSeed[] = [
  // ════════════════════════════════════════════════════════════
  // 1. liquid_glass_studio — 独有: soft_gradient + glass + 3D
  // ════════════════════════════════════════════════════════════
  {
    id: "liquid_glass_studio",
    name: "液态玻璃工作室",
    tagline: "浅色玻璃质感的高端产品展示",
    description: "浅色、半透明、3D 质感的品牌展示模板，适合产品和设计工作室。",
    category: "product",
    categories: ["product", "featured"],
    previewStyle: "liquid_glass",
    pageType: "product_service",
    style: "minimal",
    primaryColor: "blue",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "soft_gradient",
    interactionMode: "interactive_showcase",
    appMode: "app_preview",
    recommendedSections: ["hero", "app_preview", "features", "gallery", "testimonials", "cta", "contact"],
    requiredSections: ["hero", "app_preview", "features", "gallery", "cta", "contact"],
    forbiddenSections: ["pain_points", "pricing"],
    heroFramework: {
      layout: "split",
      tone: "高级、克制、未来感",
      visualDirection: "液态玻璃、半透明层叠、柔和高光、悬浮 3D 产品 — 左侧文案右侧透明产品图",
      titleStyle: "短标题，像高端产品发布语",
      subtitleStyle: "强调质感、方法和结果",
      ctaStyle: "主 CTA 克制，辅 CTA 可查看作品",
      mediaStrategy: "大面积 3D 产品/抽象玻璃物体作为视觉焦点 — 右侧或背景透明叠层",
    },
    sectionFrameworks: [
      { sectionType: "app_preview", purpose: "展示产品三视图切换，像真实 App 预览", layoutHint: "三视图切换的轻量产品 demo，带半透明玻璃壳", contentRules: ["每个视图说明一个使用场景", "避免后台系统感过重"], interactionHint: "tabs 切换 + glass glassmorphism shell", imageHint: "glassmorphism interface mockup" },
      { sectionType: "features", purpose: "解释设计/产品价值", layoutHint: "masonry 瀑布流 + 半透明卡片", contentRules: ["每点突出一种质感或能力", "用高端产品语言"], interactionHint: "hover/card reveal" },
      { sectionType: "gallery", purpose: "展示形态、材质和应用场景", layoutHint: "浅色 masonry 大图", contentRules: ["图文短句", "强调材质"], interactionHint: "carousel 或 lightbox" },
    ],
    visualRules: ["浅底软渐变 + 玻璃层叠纹理", "玻璃拟态卡片: backdrop-blur + 浅色边框", "悬浮 3D 视觉焦点", "超大留白节奏", "不使用重阴影黑块", "section 之间用透明过渡而非硬分割"],
    copywritingRules: ["像高端产品介绍", "少用促销词", "强调设计方法和质感", "句子短而精确"],
    interactionRules: ["Hero 使用 split 布局", "app_preview 必须可切换", "Gallery 可轮播", "CTA 保持克制", "禁止 pricing"],
    imageSearchHints: ["liquid glass", "glassmorphism 3d render", "frosted glass product", "translucent tech", "minimal 3d object", "studio design product"],
    iconSearchHints: ["glass icon set", "minimal product icon", "3d translucent icon"],
    promptFramework: "【液态玻璃工作室专属】你不是在生成通用网页！必须：① Hero 使用 split 布局（左文案右玻璃质感 3D 产品图）；② 背景 soft_gradient + 玻璃拟态卡片，section 间透明过渡；③ 必须包含 app_preview、features(masonry)、gallery；④ 文案高端克制，像产品设计发布；⑤ 禁止 pricing、pain_points；⑥ 不使用纯白背景，所有卡片带 backdrop-blur 半透明效果。",
    negativePromptRules: ["不要暗黑 SaaS 风", "不要餐厅/活动海报感", "不要堆砌廉价渐变", "不要复制任何第三方产品图或品牌语", "不要纯白背景贯穿全页", "不要普通卡片堆叠替代玻璃质感"],
    qualityChecklist: [...defaultChecklist, "是否使用了半透明 glass 卡片", "Hero 是否 split 左右布局", "是否有 3D 产品视觉感"],
    previewTitle: "Luma Glass Studio",
    previewDescription: "液态玻璃质感的产品展示与设计工作室页面。",
    previewHeroSubtitle: "用柔和高光、半透明层叠和 3D 产品视觉呈现品牌的未来质感。",
  },
  // ════════════════════════════════════════════════════════════
  // 2. cinematic_showcase — 独有: dark_manifesto + immersive hero + 电影感
  // ════════════════════════════════════════════════════════════
  {
    id: "cinematic_showcase",
    name: "电影感作品展示",
    tagline: "像电影海报一样讲述作品和品牌故事",
    description: "暗色、大图、情绪化叙事，适合摄影师、导演和品牌故事。",
    category: "portfolio",
    categories: ["portfolio", "featured"],
    previewStyle: "cinematic",
    pageType: "personal_profile",
    style: "elegant",
    primaryColor: "black_gold",
    visualMode: true,
    layoutPreset: "manifesto_dark",
    backgroundMode: "dark_manifesto",
    interactionMode: "interactive_showcase",
    appMode: "portfolio_app",
    recommendedSections: ["hero", "gallery", "timeline", "testimonials", "features", "cta", "contact"],
    requiredSections: ["hero", "gallery", "timeline", "contact", "cta"],
    forbiddenSections: ["pricing", "dashboard", "app_preview"],
    heroFramework: {
      layout: "immersive",
      tone: "电影感、低饱和、克制",
      visualDirection: "大幅情绪图、暗部层次、片名式标题、微弱金色高光、letterbox 遮幅感",
      titleStyle: "像片名或影展主标题，字体大而克制",
      subtitleStyle: "用一两句建立故事背景",
      ctaStyle: "克制、不喧宾夺主，放在底部",
      mediaStrategy: "沉浸式全宽背景图，像 film still 或 editorial portrait",
    },
    sectionFrameworks: [
      { sectionType: "gallery", purpose: "呈现代表作品 — 作品放映墙", layoutHint: "宽幅横向轮播，像电影放映序列", contentRules: ["每个作品给一句策展说明", "强调光线、人物、场景或品牌情绪"], interactionHint: "carousel / lightbox", imageHint: "cinematic photography still" },
      { sectionType: "timeline", purpose: "讲作品或品牌故事", layoutHint: "章节式叙事，卷轴感", contentRules: ["像短片脚本推进", "少用销售语言"], interactionHint: "scroll reveal" },
      { sectionType: "testimonials", purpose: "用引语建立可信度", layoutHint: "editorial quote，大幅引语", contentRules: ["评价像媒体短评", "避免夸张硬广"], interactionHint: "carousel" },
    ],
    visualRules: ["暗色低饱和 + 电影遮幅感", "大图优先，文字克制", "金色/暖色点缀", "章节感 + 电影字幕式空间", "gallery 像作品放映墙而非普通网格"],
    copywritingRules: ["像导演阐述或品牌故事", "用视觉和情绪词", "CTA 克制", "避免电商促销口吻"],
    interactionRules: ["Gallery 必须可浏览(横向轮播)", "Timeline 分章节滚动", "Testimonials 用 quote/carousel", "CTA 只保留关键入口"],
    imageSearchHints: ["cinematic portrait", "film still photography", "moody editorial", "low saturation visual", "visual story photography"],
    iconSearchHints: ["film icon", "camera minimal icon", "storyboard icon"],
    promptFramework: "【电影感作品展示专属】你不是在生成通用网页！必须：① Hero 使用 immersive 布局 — 全宽电影感背景、超大标题像片名；② 必须包含 gallery(横向作品放映墙，非普通网格)、timeline(章节叙事)；③ CTA 克制、文字少但情绪强；④ 禁止 pricing、dashboard、app_preview；⑤ 整个页面像电影分镜而非普通官网。",
    negativePromptRules: ["不要普通企业官网", "不要高饱和活动页", "不要大量价格模块", "不要复制电影海报文案或剧照", "不要 dashboard/app_preview", "不要把 gallery 做成普通网格"],
    qualityChecklist: [...defaultChecklist, "Hero 是否 immersive 布局", "Gallery 是否像作品放映墙", "是否低饱和电影感", "文案是否像导演阐述"],
    previewTitle: "Frame No. 07",
    previewDescription: "电影感摄影作品与品牌故事展示。",
    previewHeroSubtitle: "以光线、人物和片段组织作品，让每一屏都像一个有情绪的镜头。",
  },
  // ════════════════════════════════════════════════════════════
  // 3. restaurant_dark_luxury — 独有: dark_manifesto + gold accent + 菜单式
  // ════════════════════════════════════════════════════════════
  {
    id: "restaurant_dark_luxury",
    name: "暗色高级餐厅",
    tagline: "黑金氛围、菜单故事和预约转化",
    description: "黑金、氛围图、菜单与空间故事，适合餐厅、酒吧、私厨和民宿。",
    category: "business",
    categories: ["business", "featured"],
    previewStyle: "restaurant_dark",
    pageType: "local_business",
    style: "elegant",
    primaryColor: "black_gold",
    visualMode: true,
    layoutPreset: "manifesto_dark",
    backgroundMode: "dark_manifesto",
    interactionMode: "interactive_light",
    recommendedSections: ["hero", "features", "gallery", "pricing", "testimonials", "contact", "cta"],
    requiredSections: ["hero", "features", "gallery", "contact", "cta"],
    forbiddenSections: ["dashboard", "app_preview", "timeline"],
    heroFramework: {
      layout: "manifesto",
      tone: "高级、私密、有烟火气",
      visualDirection: "暗色餐厅空间、餐桌烛光、酒杯、木质和金色细节 — 氛围图作背景，标题像餐厅招牌",
      titleStyle: "像餐厅招牌或私厨主题，大而优雅",
      subtitleStyle: "具体写菜单、空间和预约体验",
      ctaStyle: "立即预约/查看菜单，金色按钮",
      mediaStrategy: "首屏必须有氛围图，优先 dark restaurant interior/fine dining",
    },
    sectionFrameworks: [
      { sectionType: "features", purpose: "展示菜单、主厨、酒单或空间卖点", layoutHint: "菜单式分组 — accordion 式", contentRules: ["写具体菜品/酒单/场景", "避免空泛高级感"], interactionHint: "accordion/menu tabs", imageHint: "fine dining dish detail" },
      { sectionType: "gallery", purpose: "展示空间和餐桌氛围", layoutHint: "暗色大图网格 + 金色边框", contentRules: ["空间、餐桌、吧台、菜品至少覆盖三类", "图注具体"], interactionHint: "carousel" },
      { sectionType: "contact", purpose: "给出地址、营业时间和预约方式", layoutHint: "信息卡 + 金色预约 CTA", contentRules: ["必须包含地址/时间/预约提示", "CTA 明确、金色按钮"], interactionHint: "copy phone / anchor" },
    ],
    visualRules: ["黑金配色 — 深色底+金色点缀", "首屏暗色氛围图", "暖光效果和深色背景", "菜单式排版感", "金色边框/分割线", "避免亮色科技感"],
    copywritingRules: ["写餐桌、灯光、香气、菜单", "重视预约和地址", "适合私厨/酒吧/餐厅", "不要像 SaaS"],
    interactionRules: ["菜单可分组(accordion)", "Gallery 可轮播", "联系方式可复制", "CTA 金色按钮指向预约"],
    imageSearchHints: ["luxury restaurant interior dark", "fine dining table setting", "cocktail bar moody", "private dining room ambiance", "gourmet dish plating"],
    iconSearchHints: ["restaurant line icon", "wine glass icon", "reservation icon"],
    promptFramework: "【暗色高级餐厅专属】你不是在生成通用网页！必须：① Hero 使用 manifesto 布局 — 暗色餐厅氛围图背景、金色文字、像招牌标题；② 结构: hero → features(菜单 accordion) → gallery(空间) → pricing(套餐) → testimonials → contact(地址/预约) → cta(金色按钮)；③ 配色黑金，所有 CTA 金色；④ 禁止 dashboard、app_preview、timeline；⑤ pricing 写菜品套餐而非普通价格表。",
    negativePromptRules: ["不要科技 dashboard", "不要活动海报风", "不要复制餐厅品牌名或菜单", "不要无图首屏", "不要蓝色/紫色/粉色科技配色"],
    qualityChecklist: [...defaultChecklist, "Hero 是否暗色氛围图背景", "是否黑金配色", "菜单是否 accordion", "预约 CTA 是否金色"],
    previewTitle: "墨宴 Private Dining",
    previewDescription: "黑金餐厅、私厨或酒吧预约页。",
    previewHeroSubtitle: "在低光、木质与酒香之间，把晚餐变成一场私密的城市仪式。",
  },
  // ════════════════════════════════════════════════════════════
  // 4. ai_agent_dark — 独有: particle_flow + app_preview + 科技蓝
  // ════════════════════════════════════════════════════════════
  {
    id: "ai_agent_dark",
    name: "AI Agent 深色产品",
    tagline: "黑底科技、Agent 工作流和可点击产品 Demo",
    description: "黑底科技、产品 demo、数据状态感，适合 SaaS、AI 工具和智能助手。",
    category: "app",
    categories: ["app", "product", "featured"],
    previewStyle: "agent_dark",
    pageType: "product_service",
    style: "tech",
    primaryColor: "blue",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "particle_flow",
    interactionMode: "interactive_demo",
    appMode: "app_preview",
    recommendedSections: ["hero", "app_preview", "dashboard", "features", "pricing", "faq", "cta", "contact"],
    requiredSections: ["hero", "app_preview", "dashboard", "features", "cta", "contact"],
    forbiddenSections: ["gallery"],
    heroFramework: {
      layout: "visual",
      tone: "技术可信、速度感、产品化",
      visualDirection: "深色 SaaS 界面、神经网络抽象、Agent 状态流 — 粒子背景 + 产品截图感视觉区",
      titleStyle: "直接说明 AI Agent 的结果",
      subtitleStyle: "写自动化任务、集成和可控性",
      ctaStyle: "开始试用/查看 Demo — 蓝青色高光",
      mediaStrategy: "Hero 展示深色产品界面或 Agent 工作流，媒体区放右侧产品壳",
    },
    sectionFrameworks: [
      { sectionType: "app_preview", purpose: "必须展示可点击 Agent Demo — 像产品截图", layoutHint: "tabs/多视图产品壳", contentRules: ["至少 3 个视图", "每个视图有状态和下一步动作", "像真实产品界面"], interactionHint: "tabs + modal", imageHint: "AI agent interface dark" },
      { sectionType: "dashboard", purpose: "展示自动化效果和指标", layoutHint: "指标卡 + 状态面板", contentRules: ["指标要真实具体", "体现效率/准确率/节省时间"], interactionHint: "dashboard cards" },
      { sectionType: "features", purpose: "说明 Agent 能力矩阵", layoutHint: "grid 能力矩阵", contentRules: ["围绕感知/计划/执行/回顾", "避免空泛 AI 术语"], interactionHint: "tabs" },
    ],
    visualRules: ["黑底科技 + particle_flow 粒子背景", "蓝青色高光", "产品界面优先", "强调状态和数据", "grid/矩阵感布局"],
    copywritingRules: ["像 AI 产品官网", "用具体任务场景", "强调可控和集成", "少用玄学 AI 词"],
    interactionRules: ["必须 app_preview 或 dashboard", "必须有 tabs/modal/interactive demo", "CTA 指向试用或 Demo", "交互控制在 3-5 个"],
    imageSearchHints: ["AI agent interface dark", "SaaS dashboard dark", "neural network abstract blue", "product demo screen"],
    iconSearchHints: ["AI agent icon", "automation icon", "workflow icon", "neural icon"],
    promptFramework: "【AI Agent 深色产品专属】你不是在生成通用网页！必须：① 背景 particle_flow 粒子科技动感；② 必须有 app_preview(可点击产品 Demo) + dashboard(指标面板)；③ Hero 使用 visual 布局，右侧放产品界面；④ 配色蓝青+黑底；⑤ 禁止 gallery — 用 app_preview/dashboard 替代视觉区；⑥ 必须体现 tabs/modal/interactive demo 交互。",
    negativePromptRules: ["不要餐厅/生活方式文案", "不要纯静态作品集", "不要缺少产品 demo", "不要复制任何真实 SaaS 截图或 Logo", "不要 gallery 章节", "不要暖色/粉色/金色配色"],
    qualityChecklist: [...defaultChecklist, "是否有 app_preview 可点击 Demo", "是否有 dashboard 指标面板", "背景是否 particle_flow", "Hero 是否有产品界面视觉"],
    previewTitle: "AgentGrid AI",
    previewDescription: "AI Agent 产品官网与交互 Demo。",
    previewHeroSubtitle: "把任务拆解、执行、复盘和协作连接成一条可观测的自动化工作流。",
  },
  // ════════════════════════════════════════════════════════════
  // 5. warm_brand_story — 独有: soft_gradient(pink) + collage hero + 温暖
  // ════════════════════════════════════════════════════════════
  {
    id: "warm_brand_story",
    name: "暖色品牌故事",
    tagline: "温暖生活方式品牌的故事与产品陈列",
    description: "生活方式、包装、手作质感，适合花店、咖啡店、护肤和个人品牌。",
    category: "business",
    categories: ["business", "personal", "featured"],
    previewStyle: "brand_warm",
    pageType: "local_business",
    style: "elegant",
    primaryColor: "pink",
    visualMode: true,
    layoutPreset: "editorial_collage",
    backgroundMode: "soft_gradient",
    interactionMode: "interactive_light",
    recommendedSections: ["hero", "process", "features", "gallery", "testimonials", "contact", "cta"],
    requiredSections: ["hero", "features", "gallery", "testimonials", "contact", "cta"],
    forbiddenSections: ["dashboard", "pricing"],
    heroFramework: {
      layout: "collage",
      tone: "温暖、细腻、生活方式",
      visualDirection: "自然光、包装细节、咖啡/花艺/手作/护肤材质 — 拼贴多张生活方式图",
      titleStyle: "像品牌宣言但柔和",
      subtitleStyle: "讲创始故事、触感和日常场景",
      ctaStyle: "了解故事/预约体验 — 柔粉色按钮",
      mediaStrategy: "Hero collage — 左侧文案右侧多张叠层生活方式图",
    },
    sectionFrameworks: [
      { sectionType: "process", purpose: "讲品牌来源或制作过程", layoutHint: "故事步骤 timeline-like", contentRules: ["像品牌官网而不是销售页", "强调人和手作"], interactionHint: "timeline-like" },
      { sectionType: "features", purpose: "展示产品或服务系列", layoutHint: "温柔卡片/产品陈列 — cards 布局", contentRules: ["讲触感、气味、使用场景", "不要过度促销"], interactionHint: "accordion/light tabs", imageHint: "artisan packaging warm" },
      { sectionType: "gallery", purpose: "展示日常场景和包装", layoutHint: "纸张拼贴 masonry", contentRules: ["图注要温暖具体", "保持柔和"], interactionHint: "masonry" },
    ],
    visualRules: ["暖色软渐变背景 — pink/cream 系", "自然光感", "collage 拼贴布局", "柔和圆角卡片", "避免冷科技风", "温暖纸张感"],
    copywritingRules: ["像品牌官网", "讲故事和生活场景", "不要像促销页", "语气温柔但不空泛"],
    interactionRules: ["Story/process 可轻交互", "Gallery 展示细节", "CTA 温和柔粉色", "Hero collage 叠层"],
    imageSearchHints: ["warm lifestyle brand aesthetic", "artisan packaging natural light", "coffee shop interior warm", "floral studio soft", "handmade product cozy"],
    iconSearchHints: ["handmade icon", "coffee icon", "flower icon", "natural skincare icon"],
    promptFramework: "【暖色品牌故事专属】你不是在生成通用网页！必须：① Hero 使用 collage 布局 — 左侧文案右侧叠层生活方式图；② 背景 soft_gradient 但用 pink/cream 暖色系，不是灰白；③ 结构: hero → process(品牌故事) → features(产品) → gallery(场景) → testimonials → contact → cta；④ 配色粉暖色；⑤ 禁止 pricing、dashboard；⑥ 文案像生活方式品牌官网。",
    negativePromptRules: ["不要黑底科技", "不要强促销倒计时", "不要 SaaS demo", "不要复制品牌故事或包装图", "不要冷灰背景", "不要 pricing"],
    qualityChecklist: [...defaultChecklist, "Hero 是否 collage 布局", "背景是否暖色系", "是否有品牌故事 process", "文案是否温暖品牌语气"],
    previewTitle: "Mori 手作花店",
    previewDescription: "温暖生活方式品牌故事和产品展示。",
    previewHeroSubtitle: "从清晨花材、手作包装到送达时刻，把日常变成柔软的仪式。",
  },
  // ════════════════════════════════════════════════════════════
  // 6. mobile_campaign_card — 独有: plain + orange center hero + 强转化
  // ════════════════════════════════════════════════════════════
  {
    id: "mobile_campaign_card",
    name: "移动营销活动卡",
    tagline: "移动端优先的高转化活动报名页",
    description: "鲜明色块、活动节奏、移动端优先，适合报名、测评和课程营销。",
    category: "event",
    categories: ["event", "featured"],
    previewStyle: "mobile_poster",
    pageType: "event_signup",
    style: "youthful",
    primaryColor: "orange",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "plain",
    interactionMode: "interactive_demo",
    recommendedSections: ["hero", "features", "pricing", "timeline", "faq", "cta", "contact"],
    requiredSections: ["hero", "features", "pricing", "faq", "cta", "contact"],
    forbiddenSections: ["dashboard", "gallery"],
    heroFramework: {
      layout: "center",
      tone: "直接、高能、强转化",
      visualDirection: "手机海报感、大胆橙黄色块、活动倒计时、大标题居中",
      titleStyle: "短促有冲击力，居中对齐",
      subtitleStyle: "直接说明收益、时间、适合人群",
      ctaStyle: "立即报名/领取名额 — 橙色大按钮，多次出现",
      mediaStrategy: "移动端活动海报或橙色色块+emoji 视觉",
    },
    sectionFrameworks: [
      { sectionType: "features", purpose: "快速说明活动权益", layoutHint: "编号卡片 + 高信息密度", contentRules: ["信息密度高", "每点不超过两行"], interactionHint: "grid_switch/accordion", imageHint: "campaign card mobile" },
      { sectionType: "pricing", purpose: "推动报名购买", layoutHint: "table 对比布局突出主方案", contentRules: ["突出限时和权益", "价格明确"], interactionHint: "sticky CTA" },
      { sectionType: "faq", purpose: "处理报名顾虑", layoutHint: "accordion 折叠", contentRules: ["回答具体", "移动端易读"], interactionHint: "accordion" },
    ],
    visualRules: ["移动端优先 — 大字体大按钮", "大胆橙色/黄色色块", "高信息密度", "圆角卡片海报感", "多 CTA 穿插", "背景用 plain 白色但 section 用色块区分"],
    copywritingRules: ["强转化", "短句", "突出时间/权益/名额", "不要品牌故事长文"],
    interactionRules: ["FAQ 必须 accordion", "CTA 多次出现(至少 3 次)", "Pricing table 突出主推", "移动端按钮易点按(至少 48px)"],
    imageSearchHints: ["mobile campaign design orange", "event poster bold", "colorful landing page card", "app campaign banner"],
    iconSearchHints: ["campaign icon", "ticket icon", "countdown icon", "mobile event icon"],
    promptFramework: "【移动营销活动卡专属】你不是在生成通用网页！必须：① Hero 使用 center 布局 — 居中大标题 + 橙色色块 + 倒计时感；② 背景 plain 白底但 section 用大胆色块区分；③ 结构: hero → features(编号卡片) → pricing(table对比) → timeline → faq(accordion) → cta(banner) → contact；④ CTA 必须在页面出现至少 3 次；⑤ 禁止 dashboard、gallery；⑥ 文案高转化、短句、移动端优先。",
    negativePromptRules: ["不要长篇品牌故事", "不要暗黑 SaaS", "不要低转化作品集", "不要复制活动海报素材", "不要 gallery", "不要温和/克制的文案语气"],
    qualityChecklist: [...defaultChecklist, "Hero 是否 center 居中", "CTA 是否出现 3 次以上", "FAQ 是否 accordion", "是否移动端优先密度"],
    previewTitle: "7 天增长训练营",
    previewDescription: "移动端活动报名与课程促销页面。",
    previewHeroSubtitle: "用 7 天完成定位、内容和转化动作，适合正在启动的个人品牌。",
  },
  // ════════════════════════════════════════════════════════════
  // 7. editorial_portfolio — 独有: paper_collage + collage hero + 杂志感
  // ════════════════════════════════════════════════════════════
  {
    id: "editorial_portfolio",
    name: "杂志拼贴作品集",
    tagline: "纸张拼贴、策展语气和作品陈列",
    description: "纸张、拼贴、项目陈列和策展语气，适合设计师、摄影师、艺术家。",
    category: "portfolio",
    categories: ["portfolio", "personal"],
    previewStyle: "editorial_collage",
    pageType: "personal_profile",
    style: "elegant",
    primaryColor: "black_gold",
    visualMode: true,
    layoutPreset: "editorial_collage",
    backgroundMode: "paper_collage",
    interactionMode: "interactive_showcase",
    appMode: "portfolio_app",
    recommendedSections: ["hero", "gallery", "features", "timeline", "testimonials", "contact", "cta"],
    requiredSections: ["hero", "gallery", "features", "contact", "cta"],
    forbiddenSections: ["pricing", "dashboard", "app_preview"],
    heroFramework: {
      layout: "collage",
      tone: "杂志、策展、设计师视角",
      visualDirection: "纸张纹理、项目拼贴、版式切割、留白和编号 — 像杂志封面",
      titleStyle: "像杂志封面标题，可带编号",
      subtitleStyle: "说明创作方向和项目类型",
      ctaStyle: "查看作品/联系合作 — 黑色按钮",
      mediaStrategy: "Hero 使用 collage，右侧叠层纸张感卡片，编号感强",
    },
    sectionFrameworks: [
      { sectionType: "gallery", purpose: "必须展示作品集 — 策展式陈列", layoutHint: "editorial collage/masonry", contentRules: ["每个项目像策展说明", "标注项目类型或方向"], interactionHint: "carousel/lightbox", imageHint: "creative portfolio editorial" },
      { sectionType: "features", purpose: "展示创作方法或服务能力", layoutHint: "杂志栏目 — collage 错位卡片", contentRules: ["像栏目摘要", "避免普通卡片堆叠"], interactionHint: "tabs" },
      { sectionType: "testimonials", purpose: "编辑式引语", layoutHint: "editorial quote — 大幅引语", contentRules: ["像媒体评语", "语气克制"], interactionHint: "carousel" },
    ],
    visualRules: ["必须有 paper_collage 背景纹理", "必须有 gallery(策展式)", "纸张纹理/错位卡片", "不规则拼贴", "像杂志不要像普通卡片", "编号/页码感"],
    copywritingRules: ["像策展说明", "强调项目方法和 art direction", "不要销售腔", "标题可有编号感"],
    interactionRules: ["Gallery 可浏览(策展式)", "Testimonials editorial", "Hero collage", "项目可展开"],
    imageSearchHints: ["editorial portfolio layout", "magazine collage design", "paper texture background", "creative portfolio spread", "art direction curation"],
    iconSearchHints: ["portfolio icon", "magazine icon", "layout icon", "art direction icon"],
    promptFramework: "【杂志拼贴作品集专属】你不是在生成通用网页！必须：① 背景 paper_collage — 纸张纹理+错位卡片感；② Hero 使用 collage 布局 — 像杂志封面；③ 必须包含 gallery(策展式作品陈列) + features(collage 栏目卡片) + testimonials(editorial quote)；④ 禁止 pricing、dashboard、app_preview；⑤ features 和 gallery 都用 collage/masonry 而非普通 grid；⑥ 版式像杂志不要像普通卡片。",
    negativePromptRules: ["不要 SaaS dashboard", "不要移动活动促销", "不要普通企业官网", "不要复制作品或摄影素材", "不要普通 grid 卡片替代 collage", "不要 pricing"],
    qualityChecklist: [...defaultChecklist, "背景是否 paper_collage", "Hero 是否 collage 布局", "Features/gallery 是否错位拼贴", "是否有杂志编号感"],
    previewTitle: "Studio Issue 24",
    previewDescription: "杂志拼贴风设计师/摄影师作品集。",
    previewHeroSubtitle: "以项目、纸张、编号和策展文字组织作品，让页面像一本可浏览的作品杂志。",
  },
  // ════════════════════════════════════════════════════════════
  // 8. full_image_brand — 独有: image_fullscreen + full bleed photography
  // ════════════════════════════════════════════════════════════
  {
    id: "full_image_brand",
    name: "全图品牌官网",
    tagline: "全屏大图、品牌故事和产品系列陈列",
    description: "图片驱动的高级品牌官网模板，适合包装、香氛、餐厅、民宿、摄影和生活方式品牌。",
    category: "product",
    categories: ["product", "business", "portfolio", "featured"],
    previewStyle: "full_image_brand",
    pageType: "product_service",
    style: "elegant",
    primaryColor: "black_gold",
    visualMode: true,
    layoutPreset: "full_image_brand",
    backgroundMode: "image_fullscreen",
    interactionMode: "interactive_showcase",
    recommendedSections: ["hero", "solution", "features", "gallery", "process", "contact", "cta"],
    requiredSections: ["hero", "gallery", "contact", "cta"],
    forbiddenSections: ["dashboard", "pricing"],
    heroFramework: {
      layout: "fullscreen_image",
      tone: "quiet luxury",
      visualDirection: "full bleed product/lifestyle photography, warm natural light, refined material detail, no logo, no watermark",
      titleStyle: "oversized elegant Chinese title",
      subtitleStyle: "restrained brand narrative",
      ctaStyle: "understated rectangular button",
      mediaStrategy: "background image",
    },
    sectionFrameworks: [
      { sectionType: "solution", purpose: "品牌故事与设计理念", layoutHint: "editorial text with generous whitespace", contentRules: ["必须写品牌故事", "必须写设计理念", "文字克制，像品牌官网"], interactionHint: "anchor scroll", imageHint: "warm brand lifestyle photo" },
      { sectionType: "features", purpose: "产品系列与材质工艺说明", layoutHint: "product_grid / image_grid，图片和短文并重", contentRules: ["至少 3 个产品系列", "必须体现材质/工艺", "不要普通功能卡片"], interactionHint: "hover reveal", imageHint: "minimal product still life" },
      { sectionType: "gallery", purpose: "应用场景大图网格", layoutHint: "full_bleed_grid 三列大图，hover 显示文字", contentRules: ["必须包含产品系列、材质工艺、应用场景", "每个图注短而高级"], interactionHint: "modal lightbox", imageHint: "restaurant interior atmosphere / luxury packaging photography" },
      { sectionType: "process", purpose: "材质、工艺和制作流程", layoutHint: "quiet editorial process", contentRules: ["用 3-4 步说明从材料到成品", "不要流程软件感"], interactionHint: "anchor scroll" },
      { sectionType: "contact", purpose: "联系/预约 CTA", layoutHint: "minimal contact block", contentRules: ["预约、合作或到店联系方式清晰", "CTA 克制高级"], interactionHint: "copy/contact" },
    ],
    visualRules: ["首屏使用整屏图片背景", "导航覆盖在图片上方", "文字压在图片左侧或中左", "后续区块以图片网格为主", "不要普通卡片堆叠", "CTA 克制高级", "浅色纸感背景承接首屏"],
    copywritingRules: ["像高端品牌官网", "句子短、留白多", "必须出现品牌故事、设计理念、产品系列、材质工艺、应用场景、联系我们", "不复制任何第三方文案或品牌名", "少用促销词"],
    interactionRules: ["navigation 必须存在且指向锚点", "gallery 必须 full_bleed_grid 并可打开详情", "Hero 下箭头滚动到下一节", "图片失败时显示高级 fallback", "CTA 使用矩形按钮"],
    imageSearchHints: ["luxury packaging photography", "perfume product photography", "warm brand lifestyle photo", "restaurant interior atmosphere", "artisan packaging design", "minimal product still life"],
    iconSearchHints: ["minimal brand icon", "material craft icon", "packaging line icon"],
    promptFramework: "【全图品牌官网专属】你不是在生成普通转化页！必须：① layoutPreset='full_image_brand'，backgroundMode='image_fullscreen'；② Hero 使用 fullscreen_image，整屏图片背景，导航覆盖在图片上方，文字压在图片左侧或中左；③ hero.mediaType='image'，mediaPosition='background'；④ 必须生成 navigation，锚点为品牌故事、设计理念、产品系列、材质工艺、应用场景、联系我们；⑤ 必须生成 gallery，layout='full_bleed_grid'；⑥ 后续区块以图片网格和大留白为主，不要普通卡片堆叠；⑦ 必须写品牌故事、设计理念、产品系列、材质工艺、应用场景、联系我们；⑧ CTA 克制高级，矩形按钮；⑨ 不复制任何第三方代码、图片、文案、Logo 或品牌素材。",
    negativePromptRules: ["不要普通 SaaS 卡片堆叠", "不要营销活动页", "不要 dashboard/app_preview", "不要复制第三方品牌名、文案、Logo 或图片", "不要全站套同一张背景图", "不要圆滚滚 CTA"],
    qualityChecklist: [...defaultChecklist, "Hero 是否 fullscreen_image", "导航是否 overlay 且锚点可滚动", "Gallery 是否 full_bleed_grid", "是否包含品牌故事/设计理念/产品系列/材质工艺/应用场景/联系我们", "CTA 是否克制矩形"],
    previewTitle: "澄境包装研究所",
    previewDescription: "高级包装、香氛、餐厅或生活方式品牌官网。",
    previewHeroSubtitle: "以材质、光线和留白呈现产品系列，让品牌故事从第一张大图开始。",
  },
  // ════════════════════════════════════════════════════════════
  // 9. dashboard_app_demo — 独有: particle_flow + sidebar + purple
  // ════════════════════════════════════════════════════════════
  {
    id: "dashboard_app_demo",
    name: "仪表盘应用 Demo",
    tagline: "真实 SaaS 后台预览与多视图切换",
    description: "应用壳、指标卡片、可点击 demo，适合 SaaS、管理系统和 AI 工具。",
    category: "app",
    categories: ["app", "product"],
    previewStyle: "dynamic_visual",
    pageType: "product_service",
    style: "tech",
    primaryColor: "purple",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "particle_flow",
    interactionMode: "interactive_demo",
    appMode: "dashboard",
    recommendedSections: ["hero", "dashboard", "app_preview", "features", "pricing", "faq", "cta", "contact"],
    requiredSections: ["hero", "dashboard", "app_preview", "features", "pricing", "cta", "contact"],
    forbiddenSections: ["gallery"],
    heroFramework: {
      layout: "visual",
      tone: "真实 SaaS、清晰、效率导向",
      visualDirection: "后台界面、紫色指标卡、侧边导航壳 — 右侧放产品截图壳",
      titleStyle: "产品官网式结果标题",
      subtitleStyle: "写团队效率、数据和工作流",
      ctaStyle: "查看 Demo/开始试用 — 紫色按钮",
      mediaStrategy: "Hero 展示 dashboard UI 壳，右侧放 app 预览图",
    },
    sectionFrameworks: [
      { sectionType: "dashboard", purpose: "必须呈现核心指标和状态 — 像真实后台首页", layoutHint: "紫色 metrics + cards + 侧边栏壳", contentRules: ["指标真实", "体现业务价值"], interactionHint: "hover/cards", imageHint: "analytics dashboard purple" },
      { sectionType: "app_preview", purpose: "必须多视图切换 — 侧边导航", layoutHint: "sidebar_app — 左侧导航+右侧内容区", contentRules: ["至少 3 个视图", "每个视图展示真实任务或数据"], interactionHint: "tabs/navigation", imageHint: "admin panel sidebar" },
      { sectionType: "features", purpose: "解释 SaaS 核心能力", layoutHint: "grid 产品功能矩阵", contentRules: ["面向团队和管理者", "不要空泛"], interactionHint: "tabs" },
    ],
    visualRules: ["必须有 app_preview(sidebar_app)", "必须有 dashboard(metrics+cards)", "必须有 navigation(侧边或顶部)", "后台产品壳感", "紫蓝科技色", "数据指标真实感"],
    copywritingRules: ["像真实 SaaS 产品", "指标和场景具体", "强调效率/协作/可视化", "不要生活方式语气"],
    interactionRules: ["必须多视图切换(侧边导航)", "navigation 必须存在", "dashboard cards 可交互", "CTA 指向 demo/试用"],
    imageSearchHints: ["SaaS dashboard UI purple", "analytics dashboard metrics", "admin panel sidebar", "kanban board app", "workflow automation"],
    iconSearchHints: ["dashboard icon", "analytics icon", "kanban icon", "admin panel icon"],
    promptFramework: "【仪表盘应用 Demo 专属】你不是在生成通用网页！必须：① 背景 particle_flow + 紫色科技感；② 必须有 dashboard(指标面板) + app_preview(sidebar_app 侧边导航布局)；③ app_preview 必须 sidebar_app 布局，有多视图切换；④ 必须有 navigation；⑤ 禁止 gallery — 用仪表盘替代视觉展示；⑥ 配色紫蓝科技色，数据指标真实；⑦ Hero 使用 visual 布局，右侧放产品截图壳。",
    negativePromptRules: ["不要餐厅/品牌故事", "不要纯作品集", "不要缺少导航", "不要复制真实后台截图或 Logo", "不要 gallery", "不要暖色/粉色配色"],
    qualityChecklist: [...defaultChecklist, "是否有 dashboard 仪表盘", "app_preview 是否 sidebar_app", "是否有 navigation", "是否紫色科技配色"],
    previewTitle: "FlowBoard Ops",
    previewDescription: "管理系统、SaaS 后台和 AI 工具的可点击产品 Demo。",
    previewHeroSubtitle: "把任务、指标、成员和风险集中在一个可操作的后台视图里。",
  },
];

export const templatePresets: TemplatePreset[] = templateSeeds.map(makeTemplate);

export function getTemplateById(templateId?: string | null): TemplatePreset | null {
  if (!templateId) return null;
  return templatePresets.find((template) => template.id === templateId) ?? null;
}

export function isTemplateId(templateId: unknown): templateId is string {
  return typeof templateId === "string" && getTemplateById(templateId) !== null;
}
