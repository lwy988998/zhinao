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

export interface BaseSection {
  id: string;
  type: string;
  title?: string;
  description?: string;
  visible: boolean;
}

export interface HeroSection extends BaseSection {
  type: "hero";
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
}

export interface FeaturesSection extends BaseSection {
  type: "features";
  title: string;
  description?: string;
  items: Array<{ title: string; description: string }>;
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
  plans: Array<{
    name: string;
    price: string;
    description: string;
    features: string[];
  }>;
}

export interface TestimonialsSection extends BaseSection {
  type: "testimonials";
  title: string;
  description?: string;
  items: Array<{ name: string; role?: string; content: string }>;
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
  description?: string;
  contactAction: ContactAction;
}

export interface CTASection extends BaseSection {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
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
