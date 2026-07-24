import type { PageType, PrimaryColor, ThemeStyle } from "@/types/page";

export type TemplateCategory = "featured" | "business" | "personal" | "product" | "event" | "portfolio" | "app";

export type TemplatePreviewStyle =
  | "liquid_glass"
  | "cinematic"
  | "restaurant_dark"
  | "agent_dark"
  | "brand_warm"
  | "mobile_poster"
  | "editorial_collage"
  | "dynamic_visual";

export type TemplatePreset = {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  categories: TemplateCategory[];
  previewStyle: TemplatePreviewStyle;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  visualMode: boolean;
  layoutPreset: string;
  backgroundMode: string;
  promptGuidance: string;
  imageSearchHints: string[];
  recommendedSections: string[];
};

export const templatePresets: TemplatePreset[] = [
  {
    id: "liquid_glass_studio",
    name: "液态玻璃工作室",
    description: "浅色、半透明、3D 质感的品牌展示模板，适合产品和设计工作室。",
    category: "featured",
    categories: ["featured", "product"],
    previewStyle: "liquid_glass",
    pageType: "product_service",
    style: "minimal",
    primaryColor: "blue",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "soft_gradient",
    promptGuidance: "生成浅色液态玻璃质感页面，使用半透明卡片、柔和高光、3D 产品展示感。Hero 强调品牌一句话价值，后续安排产品亮点、使用场景、案例、价格或咨询 CTA。",
    imageSearchHints: ["minimal product studio hero image", "glassmorphism product render", "clean 3d product display"],
    recommendedSections: ["hero", "features", "app_preview", "gallery", "testimonials", "cta", "contact"],
  },
  {
    id: "cinematic_showcase",
    name: "电影感作品展示",
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
    promptGuidance: "生成电影海报式暗色页面，Hero 使用强烈标题、kicker、沉浸式背景图；模块像品牌短片脚本一样推进，突出作品、方法、代表案例和联系入口。",
    imageSearchHints: ["cinematic portfolio photography", "film director showcase still", "moody brand story image"],
    recommendedSections: ["hero", "gallery", "timeline", "testimonials", "cta", "contact"],
  },
  {
    id: "restaurant_dark_luxury",
    name: "暗色高级餐厅",
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
    promptGuidance: "生成暗色高级餐厅页面，重视空间氛围、招牌菜、预约信息、地址和顾客评价。文案要具体到餐桌、灯光、香气、菜单结构，避免空泛商业套话。",
    imageSearchHints: ["luxury restaurant interior", "fine dining table atmosphere", "dark restaurant bar interior"],
    recommendedSections: ["hero", "features", "gallery", "testimonials", "contact", "cta"],
  },
  {
    id: "ai_agent_dark",
    name: "AI Agent 深色产品",
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
    promptGuidance: "生成深色 AI Agent 产品页，必须包含 app_preview 或 dashboard demo，体现任务流、自动化、数据监控、集成能力和试用 CTA。",
    imageSearchHints: ["ai agent dashboard interface", "futuristic ai assistant abstract", "saas dark dashboard screenshot aesthetic"],
    recommendedSections: ["hero", "app_preview", "dashboard", "features", "pricing", "faq", "cta", "contact"],
  },
  {
    id: "warm_brand_story",
    name: "暖色品牌故事",
    description: "生活方式、包装、手作质感，适合花店、咖啡店、护肤和个人品牌。",
    category: "business",
    categories: ["business", "personal", "featured"],
    previewStyle: "brand_warm",
    pageType: "local_business",
    style: "elegant",
    primaryColor: "pink",
    visualMode: true,
    layoutPreset: "editorial_collage",
    backgroundMode: "paper_collage",
    promptGuidance: "生成暖色生活方式品牌页，强调创始故事、产品触感、包装细节、客户场景和购买/预约入口。结构像一篇精致杂志专题。",
    imageSearchHints: ["warm lifestyle brand packaging", "artisan coffee flower shop details", "natural skincare product lifestyle"],
    recommendedSections: ["hero", "features", "gallery", "testimonials", "process", "contact", "cta"],
  },
  {
    id: "mobile_campaign_card",
    name: "移动营销活动卡",
    description: "鲜明色块、活动节奏、移动端优先，适合报名、测评和课程营销。",
    category: "event",
    categories: ["event", "featured"],
    previewStyle: "mobile_poster",
    pageType: "event_signup",
    style: "youthful",
    primaryColor: "orange",
    visualMode: true,
    layoutPreset: "dynamic_visual",
    backgroundMode: "soft_gradient",
    promptGuidance: "生成移动端海报式活动页，使用强对比色块、短句、倒计时感、嘉宾/流程/权益/报名 CTA，模块紧凑且适合手机阅读。",
    imageSearchHints: ["event campaign poster colorful", "mobile landing page campaign visual", "workshop registration hero image"],
    recommendedSections: ["hero", "features", "timeline", "pricing", "faq", "cta", "contact"],
  },
  {
    id: "editorial_portfolio",
    name: "杂志拼贴作品集",
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
    promptGuidance: "生成杂志拼贴风作品集，优先生成 gallery，项目描述要像策展说明，包含创作方法、客户/项目类型、联系入口。",
    imageSearchHints: ["editorial portfolio collage", "designer portfolio project photography", "magazine layout creative work"],
    recommendedSections: ["hero", "gallery", "features", "timeline", "testimonials", "contact", "cta"],
  },
  {
    id: "dashboard_app_demo",
    name: "仪表盘应用 Demo",
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
    promptGuidance: "生成 app-like 产品页，Hero 后必须安排 dashboard 和 app_preview，展示真实指标、状态卡、工作流和集成价值，整体像可点击产品 demo。",
    imageSearchHints: ["saas dashboard app interface", "analytics dashboard product demo", "ai tool workflow dashboard"],
    recommendedSections: ["hero", "dashboard", "app_preview", "features", "pricing", "faq", "cta", "contact"],
  },
];

export function getTemplateById(templateId?: string | null): TemplatePreset | null {
  if (!templateId) return null;
  return templatePresets.find((template) => template.id === templateId) ?? null;
}

export function isTemplateId(templateId: unknown): templateId is string {
  return typeof templateId === "string" && getTemplateById(templateId) !== null;
}
