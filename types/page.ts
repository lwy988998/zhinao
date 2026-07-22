export type PageType =
  | "personal_profile"
  | "product_service"
  | "local_business"
  | "event_signup"
  | "course_sales";

export type ThemeStyle = "minimal" | "business" | "elegant" | "tech" | "youthful";

export type PrimaryColor = "blue" | "green" | "purple" | "orange" | "black_gold" | "pink";

export type ContactActionType = "wechat" | "phone" | "form" | "link" | "email";

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

type PricingItem = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export interface BaseSection {
  id?: string;
  type: string;
  title?: string;
  description?: string;
  visible?: boolean;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonAction: string;
  image?: string;
  /** Legacy aliases kept so existing mock previews can continue to render. */
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface FeaturesSection extends BaseSection {
  type: "features";
  title: string;
  subtitle?: string;
  description?: string;
  items: Array<{ title: string; description: string; icon?: string }>;
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
  /** Legacy alias kept for old preview data. */
  plans?: PricingItem[];
}

export interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  title: string;
  description?: string;
  items: Array<{ name: string; role?: string; content: string; avatar?: string }>;
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
  /** Legacy section-level action; new PRD uses PageContent.contactAction. */
  contactAction?: ContactAction;
}

export interface CTASection extends BaseSection {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
  buttonAction: string;
}

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
}
