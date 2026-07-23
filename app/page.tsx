"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ContactActionType, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

// ── Data ──

const MODES = [
  { key: "generate", label: "网页生成", pageType: "product_service" as PageType, contactAction: "link" as ContactActionType },
  { key: "convert", label: "转化页", pageType: "product_service" as PageType, contactAction: "link" as ContactActionType },
  { key: "personal", label: "个人主页", pageType: "personal_profile" as PageType, contactAction: "wechat" as ContactActionType },
  { key: "event", label: "活动页", pageType: "event_signup" as PageType, contactAction: "form" as ContactActionType },
] as const;

const PAGE_TYPE_LABELS: Record<PageType, string> = {
  personal_profile: "个人介绍页",
  product_service: "产品服务页",
  local_business: "门店介绍页",
  event_signup: "活动报名页",
  course_sales: "课程销售页",
};

const STYLE_LABELS: Record<ThemeStyle, string> = {
  minimal: "极简干净",
  business: "商务专业",
  elegant: "温柔高级",
  tech: "科技未来",
  youthful: "活泼年轻",
};

const COLOR_LABELS: Record<PrimaryColor, string> = {
  blue: "蓝色",
  green: "绿色",
  purple: "紫色",
  orange: "橙色",
  black_gold: "黑金",
  pink: "粉色",
};

const CONTACT_LABELS: Record<ContactActionType, string> = {
  wechat: "添加微信",
  phone: "电话咨询",
  form: "提交报名",
  link: "了解产品",
  email: "邮件联系",
};

const STYLE_CYCLE: ThemeStyle[] = ["minimal", "business", "elegant", "tech", "youthful"];
const COLOR_CYCLE: PrimaryColor[] = ["blue", "green", "purple", "orange", "black_gold", "pink"];
const PAGE_TYPE_CYCLE: PageType[] = ["product_service", "personal_profile", "local_business", "event_signup", "course_sales"];
const CONTACT_CYCLE: ContactActionType[] = ["wechat", "phone", "form", "link", "email"];

type QuickTagConfig = {
  prompt: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
};

const QUICK_TAGS: (QuickTagConfig & { label: string })[] = [
  {
    label: "个人介绍页",
    prompt: "我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。",
    pageType: "personal_profile",
    style: "elegant",
    primaryColor: "pink",
    contactAction: "wechat",
  },
  {
    label: "门店介绍页",
    prompt: "帮我生成一个咖啡店介绍页，展示门店环境、手冲菜单、到店路线和顾客评价，风格温暖亲切。",
    pageType: "local_business",
    style: "elegant",
    primaryColor: "green",
    contactAction: "phone",
  },
  {
    label: "课程销售页",
    prompt: "帮我做一个AI绘画训练营销售页，包含课程大纲、价格、讲师介绍、学员评价和报名按钮。",
    pageType: "course_sales",
    style: "business",
    primaryColor: "orange",
    contactAction: "form",
  },
  {
    label: "产品服务页",
    prompt: "帮我做一个SaaS产品服务页，突出用户痛点、解决方案、功能亮点和预约咨询入口。",
    pageType: "product_service",
    style: "tech",
    primaryColor: "blue",
    contactAction: "link",
  },
  {
    label: "活动报名页",
    prompt: "帮我做一个线下沙龙活动报名页，展示活动亮点、嘉宾、流程和报名按钮。",
    pageType: "event_signup",
    style: "youthful",
    primaryColor: "purple",
    contactAction: "form",
  },
  {
    label: "作品集页面",
    prompt: "帮我做一个设计师作品集页面，展示项目案例、设计理念和联系方式，风格现代干净。",
    pageType: "personal_profile",
    style: "elegant",
    primaryColor: "black_gold",
    contactAction: "email",
  },
];

const EXAMPLES = [
  "做一个瑜伽老师个人主页，温柔高级，突出课程和微信咨询",
  "做一个咖啡店介绍页，展示环境、菜单、地址和联系方式",
  "做一个训练营销售页，包含课程大纲、价格、学员评价和报名按钮",
  "做一个产品服务页，突出痛点、解决方案和预约咨询",
];

// ── Helpers ──

function showToast(text: string) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-lg";
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function inferFromPrompt(text: string): { pageType: PageType; style: ThemeStyle; contactAction: ContactActionType } {
  let pageType: PageType = "product_service";
  let style: ThemeStyle = "minimal";
  let contactAction: ContactActionType = "wechat";

  // Infer pageType
  if (/瑜伽|老师|教练|作品集|设计师|个人|介绍|简历/.test(text)) pageType = "personal_profile";
  if (/咖啡|门店|餐厅|美业|工作室|店/.test(text)) pageType = "local_business";
  if (/课程|训练营|报名|学习|教学|培训/.test(text)) pageType = "course_sales";
  if (/产品|SaaS|服务|工具|软件|平台|系统/.test(text)) pageType = "product_service";
  if (/活动|沙龙|峰会|线下|发布会/.test(text)) pageType = "event_signup";

  // Infer style
  if (/温柔|温暖|亲切|高级|优雅/.test(text)) style = "elegant";
  else if (/科技|AI|智能|数字|未来/.test(text)) style = "tech";
  else if (/商务|专业|企业/.test(text)) style = "business";
  else if (/活泼|年轻|有趣|创意|活力/.test(text)) style = "youthful";

  // Infer contactAction
  if (/微信|二维码/.test(text)) contactAction = "wechat";
  else if (/电话|拨打/.test(text)) contactAction = "phone";
  else if (/报名|提交|注册/.test(text)) contactAction = "form";
  else if (/产品|了解|试用/.test(text)) contactAction = "link";
  else if (/邮箱|邮件/.test(text)) contactAction = "email";

  return { pageType, style, contactAction };
}

function cycleValue<T>(current: T, list: readonly T[]): T {
  const idx = list.indexOf(current);
  return list[(idx + 1) % list.length];
}

// ── Sub-components ──

function AnnouncementBar() {
  return (
    <div className="flex items-center justify-center gap-2 border-b border-white/10 bg-white/3 px-4 py-2 text-center text-xs text-slate-600 backdrop-blur-sm sm:text-sm">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
      智脑 MVP 已上线：输入一句话，生成可编辑、可发布、可分享的网页
    </div>
  );
}

function Sidebar() {
  const scrollToExamples = () => {
    const el = document.getElementById("home-examples");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const items = [
    { icon: "✦", label: "创建", href: "/generate", active: true },
    { icon: "◇", label: "示例", href: null, active: false, onClick: scrollToExamples },
    { icon: "⬆", label: "发布", href: "/editor", active: false },
    { icon: "⚙", label: "设置", href: null, active: false, onClick: () => showToast("设置功能即将上线") },
  ];

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4 md:flex lg:w-20">
      <Link href="/" className="mb-6 flex flex-col items-center gap-0.5 text-slate-900">
        <span className="text-xl font-bold leading-none tracking-tight">智脑</span>
        <span className="text-[10px] leading-none text-slate-400">zhinao</span>
      </Link>

      <nav className="flex flex-1 flex-col items-center gap-1">
        {items.map((item) => {
          const content = (
            <>
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </>
          );
          if (item.href) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none transition ${
                  item.active
                    ? "bg-slate-100 text-slate-900 font-medium"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                {content}
              </Link>
            );
          }
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              aria-label={item.label}
            >
              {content}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => showToast("登录功能即将上线")}
        className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none text-slate-400 transition hover:text-slate-600"
        aria-label="登录"
      >
        <span className="text-sm">👤</span>
        <span>登录</span>
      </button>
    </aside>
  );
}

function MobileNav() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
      <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">
        智脑
      </Link>
      <Link
        href="/generate"
        className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800"
      >
        创建
      </Link>
    </header>
  );
}

// ── Main Page ──

export default function Home() {
  const router = useRouter();

  // ── Full creation state ──
  const [prompt, setPrompt] = useState("");
  const [activeMode, setActiveMode] = useState<string>("generate");
  const [pageType, setPageType] = useState<PageType>("product_service");
  const [style, setStyle] = useState<ThemeStyle>("minimal");
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>("blue");
  const [contactAction, setContactAction] = useState<ContactActionType>("wechat");
  const [visualMode, setVisualMode] = useState(false);

  // ── Current selection summary ──
  const summaryText = useMemo(() => {
    const parts = [
      PAGE_TYPE_LABELS[pageType],
      STYLE_LABELS[style],
      COLOR_LABELS[primaryColor],
      CONTACT_LABELS[contactAction],
    ];
    if (visualMode) parts.push("视觉增强");
    return "当前：" + parts.join(" · ");
  }, [pageType, style, primaryColor, contactAction, visualMode]);

  // ── Navigate to /generate with all params ──
  const goToGenerate = useCallback(
    (text?: string) => {
      const q = (text ?? prompt).trim();
      const params = new URLSearchParams();

      if (q) params.set("prompt", q);
      params.set("pageType", pageType);
      params.set("style", style);
      params.set("primaryColor", primaryColor);
      params.set("contactAction", contactAction);
      if (visualMode) params.set("visualMode", "1");

      const qs = params.toString();
      router.push("/generate" + (qs ? `?${qs}` : ""));
    },
    [prompt, pageType, style, primaryColor, contactAction, visualMode, router],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!prompt.trim()) {
        // Focus textarea and show hint
        const ta = document.querySelector("textarea");
        if (ta) ta.focus();
        showToast("请输入你的网页需求");
        return;
      }
      goToGenerate();
    },
    [prompt, goToGenerate],
  );

  // ── Handle mode toggle ──
  const handleModeChange = useCallback((mode: (typeof MODES)[number]) => {
    setActiveMode(mode.key);
    setPageType(mode.pageType);
    setContactAction(mode.contactAction);
  }, []);

  // ── Handle quick tag ──
  const handleTagClick = useCallback((tag: (typeof QUICK_TAGS)[number]) => {
    setPrompt(tag.prompt);
    setPageType(tag.pageType);
    setStyle(tag.style);
    setPrimaryColor(tag.primaryColor);
    setContactAction(tag.contactAction);
    showToast(`已选择：${tag.label}模板`);
  }, []);

  // ── Handle example click ──
  const handleExampleClick = useCallback((text: string) => {
    setPrompt(text);
    // Infer settings from example text
    const inferred = inferFromPrompt(text);
    setPageType(inferred.pageType);
    setStyle(inferred.style);
    setContactAction(inferred.contactAction);
  }, []);

  // ── Toolbar actions ──
  const handleToolAuto = useCallback(() => {
    if (!prompt.trim()) {
      showToast("请先输入需求描述");
      return;
    }
    const inferred = inferFromPrompt(prompt);
    setPageType(inferred.pageType);
    setStyle(inferred.style);
    setContactAction(inferred.contactAction);
    showToast("已根据需求自动匹配配置");
  }, [prompt]);

  const handleToolVisual = useCallback(() => {
    setVisualMode((v) => {
      const next = !v;
      showToast(next ? "已开启视觉增强模式" : "已关闭视觉增强模式");
      return next;
    });
  }, []);

  const handleToolStyle = useCallback(() => {
    setStyle((s) => {
      const next = cycleValue(s, STYLE_CYCLE);
      showToast(`风格：${STYLE_LABELS[next]}`);
      return next;
    });
  }, []);

  const handleToolPageType = useCallback(() => {
    setPageType((p) => {
      const next = cycleValue(p, PAGE_TYPE_CYCLE);
      showToast(`页面类型：${PAGE_TYPE_LABELS[next]}`);
      return next;
    });
  }, []);

  const handleToolContact = useCallback(() => {
    setContactAction((c) => {
      const next = cycleValue(c, CONTACT_CYCLE);
      showToast(`联系方式：${CONTACT_LABELS[next]}`);
      return next;
    });
  }, []);

  const TOOLS = [
    { icon: "⚡", label: "自动", onClick: handleToolAuto, active: false },
    { icon: "🖼️", label: "图片", onClick: handleToolVisual, active: visualMode },
    { icon: "🎨", label: "风格", onClick: handleToolStyle, active: false },
    { icon: "📄", label: "页面类型", onClick: handleToolPageType, active: false },
    { icon: "📞", label: "联系方式", onClick: handleToolContact, active: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AnnouncementBar />
        <MobileNav />

        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
          <div className="w-full max-w-2xl space-y-6 sm:space-y-8">

            {/* ── Hero headline ── */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                从一个想法，到一个可分享网页
              </h1>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">
                输入你的需求，智脑会生成页面结构、文案和视觉风格，并支持编辑、发布和分享。
              </p>
            </div>

            {/* ── Mode toggle pills ── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => handleModeChange(m)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition sm:text-sm ${
                    activeMode === m.key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── Selection summary (visible after interaction) ── */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 transition sm:text-sm">
                <span className="mr-1 text-slate-300">▸</span>
                {summaryText}
              </span>
            </div>

            {/* ── Prompt input workspace ── */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-lg transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-slate-200">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。"
                  rows={4}
                  maxLength={1000}
                  className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none sm:px-6 sm:py-5 sm:text-base"
                />

                {/* Toolbar */}
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    {TOOLS.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={t.onClick}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition ${
                          t.active
                            ? "bg-slate-100 text-slate-900 font-medium"
                            : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                        aria-label={t.label}
                      >
                        <span className="text-[13px]">{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 active:scale-95 sm:h-10 sm:w-10"
                    aria-label="发送生成请求"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.5 8L14.5 1.5L8 14.5L6.5 9.5L1.5 8Z" fill="currentColor" />
                      <path d="M6.5 9.5L9.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            {/* ── Quick tags ── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_TAGS.map((tag) => (
                <button
                  key={tag.label}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-full border border-dashed border-slate-300 bg-white/60 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* ── Examples ── */}
            <div id="home-examples" className="space-y-2">
              <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">
                试试这些
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleExampleClick(ex)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-[13px] leading-relaxed text-slate-600 transition hover:border-slate-300 hover:text-slate-900 hover:shadow-sm"
                  >
                    &ldquo;{ex}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            {/* ── Footer notice ── */}
            <p className="text-center text-[11px] text-slate-400 sm:text-xs">
              页面由 AI 生成，发布前请自行检查内容准确性。
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
