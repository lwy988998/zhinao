import type { PageContent } from "@/types/page";

export const mockPageContent: PageContent = {
  id: "mock-yoga-teacher-profile",
  pageTitle: "林悦瑜伽个人介绍页",
  pageDescription: "面向都市女性的私教瑜伽与身心平衡课程介绍页。",
  pageType: "personal_profile",
  theme: {
    style: "elegant",
    primaryColor: "pink",
    fontStyle: "modern",
  },
  seo: {
    title: "林悦瑜伽 | 私教瑜伽与身心平衡课程",
    description: "林悦老师提供一对一私教瑜伽、产后修复、肩颈舒缓和身心放松课程，帮助学员建立稳定、温柔、可持续的练习习惯。",
    keywords: ["瑜伽老师", "私教瑜伽", "产后修复", "肩颈舒缓", "身心平衡"],
  },
  contactAction: {
    type: "wechat",
    label: "添加微信预约体验课",
    value: "linyue-yoga",
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      visible: true,
      title: "林悦瑜伽，陪你找回身体的柔软与力量",
      subtitle: "8 年教学经验，专注都市女性体态调整、压力释放与长期练习陪伴。",
      primaryButtonText: "预约体验课",
      secondaryButtonText: "了解课程安排",
    },
    {
      id: "features",
      type: "features",
      visible: true,
      title: "适合你的温柔练习方式",
      description: "不追求高难度体式，更关注身体感受、呼吸节奏和可持续的改变。",
      items: [
        {
          title: "一对一私教评估",
          description: "根据体态、运动基础和生活习惯定制练习计划，避免盲目跟练。",
        },
        {
          title: "小班精细指导",
          description: "每班 6 人以内，及时调整动作细节，兼顾氛围与个体差异。",
        },
        {
          title: "课后练习建议",
          description: "提供简单可执行的居家练习，让身体改善持续发生。",
        },
      ],
    },
    {
      id: "process",
      type: "process",
      visible: true,
      title: "从第一次咨询到稳定练习",
      description: "用清晰流程减少压力，让你知道每一步会发生什么。",
      steps: [
        {
          title: "沟通目标",
          description: "了解你的身体状态、时间安排和想改善的问题。",
        },
        {
          title: "体验评估",
          description: "通过一次体验课观察体态、柔韧性、核心力量和呼吸模式。",
        },
        {
          title: "制定方案",
          description: "匹配私教、小班或主题课程，明确频率和阶段目标。",
        },
        {
          title: "持续跟进",
          description: "记录练习反馈，按身体变化调整课程重点。",
        },
      ],
    },
    {
      id: "pricing",
      type: "pricing",
      visible: true,
      title: "课程与价格",
      description: "可先预约体验课，再决定是否进入长期练习。",
      plans: [
        {
          name: "单次体验课",
          price: "¥99",
          description: "适合第一次了解课程和老师风格。",
          features: ["60 分钟基础评估", "一节体验练习", "课后练习建议"],
        },
        {
          name: "一对一私教",
          price: "¥360/节",
          description: "适合需要体态调整、产后修复或专项改善的学员。",
          features: ["专属练习方案", "动作细节调整", "阶段复盘反馈"],
        },
        {
          name: "精品小班课",
          price: "¥168/节",
          description: "适合希望稳定练习，同时享受小班氛围的学员。",
          features: ["6 人以内小班", "固定主题课程", "适合零基础加入"],
        },
      ],
    },
    {
      id: "testimonials",
      type: "testimonials",
      visible: true,
      title: "学员反馈",
      description: "真实的改变通常来自稳定、舒服、能坚持的练习。",
      items: [
        {
          name: "陈女士",
          role: "互联网产品经理",
          content: "练了两个月后，肩颈紧张明显缓解，晚上也更容易入睡。林悦老师不会催促你做到极限，而是让你更理解自己的身体。",
        },
        {
          name: "Mia",
          role: "新手妈妈",
          content: "产后核心很弱，一开始很担心跟不上。老师给的动作循序渐进，安全感很强。",
        },
        {
          name: "周同学",
          role: "自由职业者",
          content: "小班课氛围很好，每次练完都觉得身体打开了，也更愿意把运动变成日常。",
        },
      ],
    },
    {
      id: "faq",
      type: "faq",
      visible: true,
      title: "常见问题",
      description: "预约前你可能想了解这些。",
      items: [
        {
          question: "零基础可以参加吗？",
          answer: "可以。课程会根据你的基础调整强度，体验课也会先做简单评估。",
        },
        {
          question: "需要自己准备瑜伽垫吗？",
          answer: "工作室会提供基础练习垫和辅具，你也可以带自己习惯使用的装备。",
        },
        {
          question: "私教课多久能看到变化？",
          answer: "通常 4 到 6 周能感受到体态、呼吸或疼痛紧张程度的变化，具体取决于练习频率和身体状态。",
        },
      ],
    },
    {
      id: "contact",
      type: "contact",
      visible: true,
      title: "预约咨询",
      description: "添加微信后请备注“瑜伽体验课”，我会根据你的时间安排合适课程。",
      contactAction: {
        type: "wechat",
        label: "微信咨询：linyue-yoga",
        value: "linyue-yoga",
      },
    },
    {
      id: "cta",
      type: "cta",
      visible: true,
      title: "从一节温柔的体验课开始",
      description: "不用等状态完美再开始，先给身体一个被认真照顾的机会。",
      buttonText: "立即预约体验课",
    },
  ],
  createdAt: "2026-07-21T14:17:00+08:00",
  updatedAt: "2026-07-21T14:17:00+08:00",
};
