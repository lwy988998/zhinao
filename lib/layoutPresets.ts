import type { CTALayout, FeaturesLayout, HeroLayout, PageSection, PageType, TestimonialsLayout } from "@/types/page";

export type LayoutPreset = {
  id: string;
  name: string;
  suitablePageTypes: PageType[];
  /** Hero layout preference */
  heroLayout: HeroLayout;
  /** Overall page rhythm — influences background alternation & spacing */
  sectionRhythm: "calm" | "conversion" | "editorial" | "dynamic";
  /** Visual density — how much content per row */
  visualDensity: "light" | "medium" | "rich";
  /** Ordered recommended section types (AI should vary, this is guidance) */
  preferredSections: PageSection["type"][];
  /** Which sections MUST be present (beyond hero/cta/contact) */
  requiredSections: PageSection["type"][];
  /** Background style for sections */
  backgroundStyle: "soft_alternating" | "bold_blocks" | "white_only" | "dark_accent";
  /** Card style */
  cardStyle: "elevated" | "subtle" | "bordered" | "colorful";
  /** Default CTA style */
  ctaStyle: CTALayout;
  /** Default testimonials style */
  testimonyStyle: TestimonialsLayout;
  /** Default features style */
  featureStyle: FeaturesLayout;
  /** Prompt guidance text — appended to AI system prompt when this preset is active */
  promptGuidance: string;
};

// ── Preset 1: Personal Brand — Elegant ──

const personalBrandElegant: LayoutPreset = {
  id: "personal_brand_elegant",
  name: "个人品牌 · 温柔高级",
  suitablePageTypes: ["personal_profile"],
  heroLayout: "center",
  sectionRhythm: "calm",
  visualDensity: "light",
  preferredSections: [
    "hero", "features", "testimonials", "process", "pricing", "contact", "cta",
  ],
  requiredSections: ["testimonials"],
  backgroundStyle: "soft_alternating",
  cardStyle: "bordered",
  ctaStyle: "panel",
  testimonyStyle: "quote",
  featureStyle: "cards",
  promptGuidance: `打造一个温暖、可信、有品牌感的个人介绍页：
- 首屏用 hero.layout="center"，配一个 badge（如"8年经验·1000+学员"）
- 用 hero.stats 展示关键数字（教学年限、服务人数、课程满意度）
- testimonials.layout 必须用 "quote"，每条评价至少 30 字，带真实感细节
- features 用 cards 布局，highlightIndex 设 0（第一个亮点突出）
- 页面节奏宽松（calm），section 间大量留白
- 配色柔和（pink/purple/cream 系），不要深色背景
- 文案温暖但不煽情，像真正的个人品牌主理人`,
};

// ── Preset 2: Local Business — Warm ──

const localBusinessWarm: LayoutPreset = {
  id: "local_business_warm",
  name: "门店介绍 · 亲切温暖",
  suitablePageTypes: ["local_business"],
  heroLayout: "visual",
  sectionRhythm: "editorial",
  visualDensity: "medium",
  preferredSections: [
    "hero", "features", "testimonials", "process", "pricing", "contact", "cta",
  ],
  requiredSections: ["process", "contact"],
  backgroundStyle: "bold_blocks",
  cardStyle: "elevated",
  ctaStyle: "banner",
  testimonyStyle: "cards",
  featureStyle: "grid",
  promptGuidance: `创造一个有温度、让人想"到店看看"的门店介绍页：
- 首屏用 hero.layout="visual"，必须有 hero.badge（如"开业3年·静安人气小店"）
- hero.stats 至少 2 项（如"服务人次"、"好评率"、"开店年数"）
- contact 模块必须详细：地址、电话、营业时间都要有
- process 展示到店/预约流程（如"扫码预约→到店→体验→反馈"）
- features 用 grid 布局展示服务/菜单/环境亮点
- testimonials 用 cards 布局，每条带 emoji 表情点缀
- 背景用 bold_blocks 风格，每 2 个 section 切换一次浅色主题背景
- CTA 用 banner 布局，强调"一键导航"或"立即预约"
- 文案亲切、口语化，像小店老板自己在介绍`,
};

// ── Preset 3: Course Sales — Compact & Converting ──

const courseSalesCompact: LayoutPreset = {
  id: "course_sales_compact",
  name: "课程销售 · 紧凑转化",
  suitablePageTypes: ["course_sales"],
  heroLayout: "split",
  sectionRhythm: "conversion",
  visualDensity: "rich",
  preferredSections: [
    "hero", "pain_points", "features", "testimonials", "process", "pricing", "faq", "contact", "cta",
  ],
  requiredSections: ["pain_points", "pricing", "testimonials"],
  backgroundStyle: "white_only",
  cardStyle: "colorful",
  ctaStyle: "banner",
  testimonyStyle: "quote",
  featureStyle: "cards",
  promptGuidance: `构建一个有转化力的课程销售页，让访客想要立即报名：
- 首屏用 hero.layout="split"，左边文案右边视觉区
- hero.badge 带紧迫感（如"仅剩12席·11月开班"）
- hero 必须包含 stats．至少含"名额"、"开课时间"、"价格"等信息
- pain_points 要尖锐、真实，让目标用户产生共鸣
- pricing 必须设 featuredPlanIndex 标记推荐方案，推荐方案用主色强调
- testimonials 用 quote 布局，每条至少 50 字，带学员真实细节
- features 用 cards 布局，highlightIndex 突出最核心课程亮点
- CTA 用 banner 布局，文案强转化（"立即锁定名额"而非"了解更多"）
- FAQ 针对常见犹豫点：价格、退费、零基础、学习周期
- 全页节奏紧凑（conversion），减少不必要的留白
- pageTitle 要像课程品牌名，不是功能描述`,
};

// ── Preset 4: Product Service — Modern Business ──

const productServiceModern: LayoutPreset = {
  id: "product_service_modern",
  name: "产品服务 · 商务现代",
  suitablePageTypes: ["product_service"],
  heroLayout: "split",
  sectionRhythm: "editorial",
  visualDensity: "medium",
  preferredSections: [
    "hero", "pain_points", "solution", "features", "testimonials", "pricing", "faq", "contact", "cta",
  ],
  requiredSections: ["pain_points", "solution", "pricing"],
  backgroundStyle: "soft_alternating",
  cardStyle: "elevated",
  ctaStyle: "banner",
  testimonyStyle: "cards",
  featureStyle: "cards",
  promptGuidance: `打造一个专业、可信赖的产品服务页，像真正的 SaaS 或企业服务官网：
- 首屏用 hero.layout="split"，左边品牌文案右边视觉区
- hero.badge 展示权威背书（如"已服务200+企业"、 "SOC2认证"）
- hero.stats 至少 2 项：客户数、数据安全指标、上线时间等
- pain_points 和 solution 必须前后衔接：先痛点后方案
- features 用 cards 布局，highlightIndex 突出核心差异化功能
- pricing 用 cards 布局，featuredPlanIndex 标记推荐方案
- cta 用 banner 布局，文案转化为先
- 整页节奏偏 editorial，有数据区和引用强调
- 文案专业、克制、有数据支撑，不夸张
- 配色选 blue/purple 系，传达安全/可信/技术感`,
};

// ── Preset 5: Event Campaign — Dynamic ──

const eventCampaignDynamic: LayoutPreset = {
  id: "event_campaign_dynamic",
  name: "活动报名 · 活力醒目",
  suitablePageTypes: ["event_signup"],
  heroLayout: "visual",
  sectionRhythm: "dynamic",
  visualDensity: "rich",
  preferredSections: [
    "hero", "features", "process", "testimonials", "faq", "contact", "cta",
  ],
  requiredSections: ["process"],
  backgroundStyle: "bold_blocks",
  cardStyle: "colorful",
  ctaStyle: "banner",
  testimonyStyle: "cards",
  featureStyle: "grid",
  promptGuidance: `构建一个有冲击力的活动报名页，让浏览者 30 秒内决定参与：
- 首屏用 hero.layout="visual"，视觉冲击力强
- hero.badge 带紧迫感（"限时免费·仅200席"）
- hero.stats 必须 3 项以上：时间、地点、名额、嘉宾数
- features 展示活动亮点，用 grid 布局，highlightIndex 突出最吸引人的点
- process 展示活动议程/流程（如"签到·嘉宾分享·圆桌讨论·自由社交"）
- 不要放 pricing 模块（活动页面通常不标价）
- testimonials 放往期活动回顾或参与者感言，用 cards 布局
- cta 用 banner 布局，大按钮 + 紧迫文案（"立即报名·锁定席位"）
- FAQ 回答"报名后能否退款""如何入场"等问题
- 配色选 orange/pink 系，传达活力和紧迫感
- 背景用 bold_blocks 风格，大胆的颜色块切换`,
};

// ── Master preset map ──

export const layoutPresets: Record<string, LayoutPreset> = {
  personal_brand_elegant: personalBrandElegant,
  local_business_warm: localBusinessWarm,
  course_sales_compact: courseSalesCompact,
  product_service_modern: productServiceModern,
  event_campaign_dynamic: eventCampaignDynamic,
};

/** Returns all presets, sorted by id */
export function getAllPresets(): LayoutPreset[] {
  return Object.values(layoutPresets).sort((a, b) => a.id.localeCompare(b.id));
}

/** Find a preset by id; returns undefined when not found */
export function getPreset(id: string): LayoutPreset | undefined {
  return layoutPresets[id];
}

/** Recommend presets for a given pageType (returns all matching) */
export function getPresetsForPageType(pageType: PageType): LayoutPreset[] {
  return getAllPresets().filter((p) => p.suitablePageTypes.includes(pageType));
}

/** Build a compact string listing all presets for the AI prompt */
export function presetsForPrompt(): string {
  return getAllPresets()
    .map(
      (p) =>
        `- ${p.id}（${p.name}）：适用于 ${p.suitablePageTypes.join(" / ")}↵  hero:${p.heroLayout} | rhythm:${p.sectionRhythm} | bg:${p.backgroundStyle} | sections:${p.preferredSections.join("→")}`,
    )
    .join("\n");
}
