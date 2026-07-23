export type PageType =
  | "personal_profile"
  | "product_service"
  | "local_business"
  | "event_signup"
  | "course_sales";

export type ThemeStyle = "minimal" | "business" | "elegant" | "tech" | "youthful";

export type PrimaryColor = "blue" | "green" | "purple" | "orange" | "black_gold" | "pink";

export type ContactActionType = "wechat" | "phone" | "form" | "link" | "email";

// ── Layout variants ──

export type HeroLayout = "center" | "split" | "visual" | "manifesto" | "collage" | "immersive";
export type FeaturesLayout = "grid" | "cards" | "list" | "numbered" | "collage" | "masonry";
export type TestimonialsLayout = "cards" | "quote" | "avatars" | "editorial";
export type CTALayout = "banner" | "panel" | "dark" | "minimal";
export type PricingLayout = "cards" | "table";

export type BackgroundMode = "plain" | "soft_gradient" | "dark_manifesto" | "paper_collage" | "particle_flow";

// ── Shared design hint ──

export interface DesignHint {
  /** Background override for this section — AI can set e.g. "soft", "dark", "gradient", "none" */
  bg?: string;
  /** Nominal spacing tier: "compact" | "normal" | "airy" */
  spacing?: string;
}

// ── Theme / SEO / Contact ──

export interface PageTheme {
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  fontStyle: "modern" | "classic" | "rounded";
}

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface ContactAction {
  type: ContactActionType;
  label: string;
  value: string;
}

// ── Pricing item ──

type PricingItem = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

// ── Section types ──

export interface BaseSection {
  id?: string;
  type: string;
  title?: string;
  description?: string;
  visible?: boolean;
  /** Optional design hint the AI can set to guide the renderer */
  design?: DesignHint;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  image?: string;
  // Legacy aliases
  primaryButtonText?: string;
  secondaryButtonText?: string;
  // Layout & visual enrichments
  layout?: HeroLayout;
  badge?: string;
  kicker?: string; // small label above title, e.g. "ISSUE 01"
  stats?: Array<{ label: string; value: string }>;
  visualHint?: string; // e.g. "geometric shapes", "soft gradient", "photo left"
}

export interface FeaturesSection extends BaseSection {
  type: "features";
  title: string;
  subtitle?: string;
  description?: string;
  items: Array<{ title: string; description: string; icon?: string }>;
  layout?: FeaturesLayout;
  highlightIndex?: number; // 0-based — which card to emphasise
}

export interface PainPointsSection extends BaseSection {
  type: "pain_points";
  title: string;
  description?: string;
  items: Array<{ title: string; description: string }>;
}

export interface SolutionSection extends BaseSection {
  type: "solution";
  title: string;
  description: string;
  items: Array<{ title: string; description: string }>;
}

export interface ProcessSection extends BaseSection {
  type: "process";
  title: string;
  description?: string;
  steps: Array<{ title: string; description: string }>;
}

export interface PricingSection extends BaseSection {
  type: "pricing";
  title: string;
  description?: string;
  items: PricingItem[];
  plans?: PricingItem[]; // legacy
  layout?: PricingLayout;
  featuredPlanIndex?: number;
}

export interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  title: string;
  description?: string;
  items: Array<{ name: string; role?: string; content: string; avatar?: string }>;
  layout?: TestimonialsLayout;
}

export interface FAQSection extends BaseSection {
  type: "faq";
  title: string;
  description?: string;
  items: Array<{ question: string; answer: string }>;
}

export interface ContactSection extends BaseSection {
  type: "contact";
  title: string;
  description: string;
  wechat?: string;
  phone?: string;
  email?: string;
  address?: string;
  qrcode?: string;
  contactAction?: ContactAction;
}

export interface CTASection extends BaseSection {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
  buttonAction: string;
  layout?: CTALayout;
}

// ── Union ──

export type PageSection =
  | HeroSection
  | FeaturesSection
  | PainPointsSection
  | SolutionSection
  | ProcessSection
  | PricingSection
  | TestimonialsSection
  | FAQSection
  | ContactSection
  | CTASection;

export interface PageContent {
  id?: string;
  pageTitle: string;
  pageDescription: string;
  pageType: PageType;
  theme: PageTheme;
  seo: PageSEO;
  contactAction: ContactAction;
  sections: PageSection[];
  createdAt?: string;
  updatedAt?: string;
  /** Selected layout preset id — drives renderer defaults for hero bg, card style, rhythm */
  layoutPreset?: string;
  /** Background mode — visual background style for the entire page */
  backgroundMode?: "plain" | "soft_gradient" | "dark_manifesto" | "paper_collage" | "particle_flow";
}
