import type { PageType } from "@/types/page";

export type InteractionMode = "static" | "interactive_light" | "interactive_showcase" | "interactive_demo";

type SectionInteraction =
  | "tabs"
  | "accordion"
  | "carousel"
  | "modal"
  | "sticky"
  | "copy_action"
  | "grid_switch"
  | "anchor";

export type InteractionPreset = {
  id: InteractionMode;
  name: string;
  description: string;
  suitablePageTypes: PageType[];
  allowedInteractionTypes: SectionInteraction[];
  promptGuidance: string;
};

const staticPreset: InteractionPreset = {
  id: "static",
  name: "静态展示",
  description: "默认静态页面，适合普通介绍页和极简信息展示。",
  suitablePageTypes: ["personal_profile", "product_service", "local_business", "event_signup", "course_sales"],
  allowedInteractionTypes: [],
  promptGuidance: `保持简洁静态展示，仅 FAQ 可使用 accordion；不要强行添加复杂交互。`,
};

const interactiveLight: InteractionPreset = {
  id: "interactive_light",
  name: "轻交互",
  description: "适合产品页、服务页、课程页，提供 tabs、accordion、copy action 等轻反馈。",
  suitablePageTypes: ["product_service", "course_sales", "local_business", "personal_profile"],
  allowedInteractionTypes: ["tabs", "accordion", "copy_action", "anchor"],
  promptGuidance: `生成轻量交互结构：features 可用 tabs 或 accordion，FAQ 用 accordion，CTA 可用 copy_action 或 anchor。交互要克制，移动端易点按。`,
};

const interactiveShowcase: InteractionPreset = {
  id: "interactive_showcase",
  name: "展示型交互",
  description: "适合作品集、门店、课程页，突出切换、轮播和详情弹层。",
  suitablePageTypes: ["personal_profile", "local_business", "course_sales", "event_signup"],
  allowedInteractionTypes: ["carousel", "tabs", "modal", "accordion", "anchor"],
  promptGuidance: `生成展示型交互结构：hero 或 testimonials 可用 carousel，features/testimonials 可用 tabs，CTA 可用 modal，FAQ 继续用 accordion。适合让用户点开案例、切换场景和查看详情。`,
};

const interactiveDemo: InteractionPreset = {
  id: "interactive_demo",
  name: "演示型交互",
  description: "适合 AI 工具、产品演示、创意页，提供 sticky、tabs、modal、carousel、copy action。",
  suitablePageTypes: ["product_service", "event_signup", "course_sales"],
  allowedInteractionTypes: ["sticky", "tabs", "modal", "carousel", "copy_action", "accordion", "grid_switch", "anchor"],
  promptGuidance: `生成更强的演示型交互：hero 可用 sticky/tabs/modal/copy_action，features 用 tabs 或 grid_switch，testimonials 可用 carousel，CTA 用 modal 或 copy_action。页面应像可点击的产品原型，但交互数量控制在 3-5 个。`,
};

export const interactionPresets: Record<InteractionMode, InteractionPreset> = {
  static: staticPreset,
  interactive_light: interactiveLight,
  interactive_showcase: interactiveShowcase,
  interactive_demo: interactiveDemo,
};

export function getInteractionPreset(id: string): InteractionPreset | undefined {
  return interactionPresets[id as InteractionMode];
}

export function getAllInteractionPresets(): InteractionPreset[] {
  return Object.values(interactionPresets);
}

export function interactionPresetsForPrompt(): string {
  return getAllInteractionPresets()
    .map(
      (preset) =>
        `- ${preset.id}（${preset.name}）：适用于 ${preset.suitablePageTypes.join(" / ")}；支持 ${preset.allowedInteractionTypes.join(" / ") || "none"}。${preset.promptGuidance}`,
    )
    .join("\n");
}
