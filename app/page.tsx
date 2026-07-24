"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { templatePresets } from "@/lib/templates";
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
  { label: "个人介绍页", prompt: "我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。", pageType: "personal_profile", style: "elegant", primaryColor: "pink", contactAction: "wechat" },
  { label: "门店介绍页", prompt: "帮我生成一个咖啡店介绍页，展示门店环境、手冲菜单、到店路线和顾客评价，风格温暖亲切。", pageType: "local_business", style: "elegant", primaryColor: "green", contactAction: "phone" },
  { label: "课程销售页", prompt: "帮我做一个AI绘画训练营销售页，包含课程大纲、价格、讲师介绍、学员评价和报名按钮。", pageType: "course_sales", style: "business", primaryColor: "orange", contactAction: "form" },
  { label: "产品服务页", prompt: "帮我做一个SaaS产品服务页，突出用户痛点、解决方案、功能亮点和预约咨询入口。", pageType: "product_service", style: "tech", primaryColor: "blue", contactAction: "link" },
  { label: "活动报名页", prompt: "帮我做一个线下沙龙活动报名页，展示活动亮点、嘉宾、流程和报名按钮。", pageType: "event_signup", style: "youthful", primaryColor: "purple", contactAction: "form" },
  { label: "作品集页面", prompt: "帮我做一个设计师作品集页面，展示项目案例、设计理念和联系方式，风格现代干净。", pageType: "personal_profile", style: "elegant", primaryColor: "black_gold", contactAction: "email" },
];

const EXAMPLES = [
  "做一个瑜伽老师个人主页，温柔高级，突出课程和微信咨询",
  "做一个咖啡店介绍页，展示环境、菜单、地址和联系方式",
  "做一个训练营销售页，包含课程大纲、价格、学员评价和报名按钮",
  "做一个产品服务页，突出痛点、解决方案和预约咨询",
];

// ── Recent history ──
const HISTORY_KEY = "zhinao_recent";
const MAX_HISTORY = 3;

type HistoryEntry = {
  prompt: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
  createdAt: number;
};

function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

function saveHistory(entry: HistoryEntry) {
  try {
    const existing = loadHistory();
    const next = [entry, ...existing].slice(0, MAX_HISTORY);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable — safe to ignore
  }
}

// ── Helpers ──

function showToast(text: string) {
  const toast = document.createElement("div");
  toast.className =
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-lg";
  toast.textContent = text;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function inferFromPrompt(text: string): {
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
} {
  let pageType: PageType = "product_service";
  let style: ThemeStyle = "minimal";
  let primaryColor: PrimaryColor = "blue";
  let contactAction: ContactActionType = "wechat";

  // ── PageType inference ──
  if (/课程|训练营|教学|培训|学习/i.test(text)) {
    pageType = "course_sales";
  } else if (/活动|沙龙|峰会|讲座|线下活动|发布会/i.test(text)) {
    pageType = "event_signup";
  } else if (/门店|店|咖啡|美甲|餐厅|美食|美业|工作室|店铺/i.test(text)) {
    pageType = "local_business";
  } else if (/作品集|摄影|设计师|个人介绍|个人主页|简历|瑜伽|老师|教练/i.test(text)) {
    pageType = "personal_profile";
  } else if (/产品|SaaS|服务|工具|软件|平台|系统/i.test(text)) {
    pageType = "product_service";
  }

  // ── Style inference ──
  if (/温柔|温暖|亲切|高级|优雅|干净|现代/i.test(text)) style = "elegant";
  else if (/科技|AI|智能|数字|未来|技术/i.test(text)) style = "tech";
  else if (/商务|专业|企业|公司/i.test(text)) style = "business";
  else if (/活泼|年轻|有趣|创意|活力|潮流/i.test(text)) style = "youthful";

  // ── Color inference ──
  if (/黑金|黑色|金色|暗|奢华/i.test(text)) primaryColor = "black_gold";
  else if (/粉|温柔|女性|可爱/i.test(text)) primaryColor = "pink";
  else if (/绿|自然|有机|健康|环保/i.test(text)) primaryColor = "green";
  else if (/紫|创意|艺术|创新/i.test(text)) primaryColor = "purple";
  else if (/橙|活力|热情|美食/i.test(text)) primaryColor = "orange";
  else if (/科技|AI|智能/i.test(text)) primaryColor = "blue";

  // ── ContactAction inference ──
  if (/微信|二维码|扫码/i.test(text)) contactAction = "wechat";
  else if (/电话|拨打|热线/i.test(text)) contactAction = "phone";
  else if (/报名|提交|注册|表单/i.test(text)) contactAction = "form";
  else if (/邮箱|邮件/i.test(text)) contactAction = "email";
  else if (/了解|试用|产品|服务|咨询/i.test(text)) contactAction = "link";

  return { pageType, style, primaryColor, contactAction };
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
    document.getElementById("home-examples")?.scrollIntoView({ behavior: "smooth" });
  };
  const items = [
    { icon: "✦", label: "创建", href: "/generate", active: true },
    { icon: "▦", label: "模板", href: "/templates", active: false },
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
          const content = (<><span className="text-sm">{item.icon}</span><span>{item.label}</span></>);
          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none transition ${item.active ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}`}>
                {content}
              </Link>
            );
          }
          return (
            <button key={item.label} type="button" onClick={item.onClick} className="flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none text-slate-500 transition hover:bg-slate-50 hover:text-slate-700" aria-label={item.label}>
              {content}
            </button>
          );
        })}
      </nav>
      <button type="button" onClick={() => showToast("登录功能即将上线")} className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none text-slate-400 transition hover:text-slate-600" aria-label="登录">
        <span className="text-sm">👤</span><span>登录</span>
      </button>
    </aside>
  );
}

function MobileNav() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
      <Link href="/" className="text-lg font-bold tracking-tight text-slate-900">智脑</Link>
      <div className="flex items-center gap-2">
        <Link href="/templates" className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300">模板</Link>
        <Link href="/generate" className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white transition hover:bg-slate-800">创建</Link>
      </div>
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

  // Recent history — loaded once via initializer
  const [recentHistory] = useState<HistoryEntry[]>(loadHistory);

  // Prompt highlight pulse — cleared inline via timeout
  const [promptFlashed, setPromptFlashed] = useState(false);
  const flashPrompt = useCallback(() => {
    setPromptFlashed(true);
    setTimeout(() => setPromptFlashed(false), 700);
  }, []);

  // Quick tag selected index
  const [activeTag, setActiveTag] = useState<number | null>(null);

  // ── Summary ──
  const summaryText = useMemo(() => {
    const parts = [PAGE_TYPE_LABELS[pageType], STYLE_LABELS[style], COLOR_LABELS[primaryColor], CONTACT_LABELS[contactAction]];
    if (visualMode) parts.push("视觉增强");
    return "当前：" + parts.join(" · ");
  }, [pageType, style, primaryColor, contactAction, visualMode]);

  // ── Navigate ──
  const goToGenerate = useCallback((text?: string) => {
    const q = (text ?? prompt).trim();
    const params = new URLSearchParams();
    if (q) params.set("prompt", q);
    params.set("pageType", pageType);
    params.set("style", style);
    params.set("primaryColor", primaryColor);
    params.set("contactAction", contactAction);
    if (visualMode) params.set("visualMode", "1");

    // Save to recent history
    saveHistory({ prompt: q, pageType, style, primaryColor, contactAction, createdAt: Date.now() });

    const qs = params.toString();
    router.push("/generate" + (qs ? `?${qs}` : ""));
  }, [prompt, pageType, style, primaryColor, contactAction, visualMode, router]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      (document.querySelector("textarea") as HTMLTextAreaElement)?.focus();
      showToast("请输入你的网页需求");
      return;
    }
    goToGenerate();
  }, [prompt, goToGenerate]);

  const handleModeChange = useCallback((mode: (typeof MODES)[number]) => {
    setActiveMode(mode.key);
    setPageType(mode.pageType);
    setContactAction(mode.contactAction);
  }, []);

  // ── Quick tag ──
  const handleTagClick = useCallback((tag: (typeof QUICK_TAGS)[number], idx: number) => {
    setPrompt(tag.prompt);
    setPageType(tag.pageType);
    setStyle(tag.style);
    setPrimaryColor(tag.primaryColor);
    setContactAction(tag.contactAction);
    flashPrompt();
    setActiveTag(idx);
    showToast(`已选择：${tag.label}模板`);
  }, [flashPrompt]);

  // ── Example click ──
  const handleExampleClick = useCallback((text: string) => {
    setPrompt(text);
    const inferred = inferFromPrompt(text);
    setPageType(inferred.pageType);
    setStyle(inferred.style);
    setPrimaryColor(inferred.primaryColor);
    setContactAction(inferred.contactAction);
    flashPrompt();
    setActiveTag(null);
  }, [flashPrompt]);

  // ── Recent history click ──
  const handleHistoryClick = useCallback((entry: HistoryEntry) => {
    setPrompt(entry.prompt);
    setPageType(entry.pageType);
    setStyle(entry.style);
    setPrimaryColor(entry.primaryColor);
    setContactAction(entry.contactAction);
    flashPrompt();
    setActiveTag(null);
    showToast("已恢复配置，可修改后重新生成");
  }, [flashPrompt]);

  // ── Toolbar ──
  const handleToolAuto = useCallback(() => {
    if (!prompt.trim()) { showToast("请先输入需求描述"); return; }
    const inferred = inferFromPrompt(prompt);
    setPageType(inferred.pageType);
    setStyle(inferred.style);
    setPrimaryColor(inferred.primaryColor);
    setContactAction(inferred.contactAction);
    showToast("已根据需求自动匹配配置");
  }, [prompt]);

  const handleToolVisual = useCallback(() => {
    setVisualMode((v) => { const next = !v; showToast(next ? "已开启视觉增强模式" : "已关闭视觉增强模式"); return next; });
  }, []);

  const handleToolStyle = useCallback(() => {
    setStyle((s) => { const next = cycleValue(s, STYLE_CYCLE); showToast(`风格：${STYLE_LABELS[next]}`); return next; });
  }, []);

  const handleToolPageType = useCallback(() => {
    setPageType((p) => { const next = cycleValue(p, PAGE_TYPE_CYCLE); showToast(`页面类型：${PAGE_TYPE_LABELS[next]}`); return next; });
  }, []);

  const handleToolContact = useCallback(() => {
    setContactAction((c) => { const next = cycleValue(c, CONTACT_CYCLE); showToast(`联系方式：${CONTACT_LABELS[next]}`); return next; });
  }, []);

  const TOOLS = [
    { icon: "⚡", label: "自动", onClick: handleToolAuto, active: false },
    { icon: "🖼️", label: "图片", onClick: handleToolVisual, active: visualMode },
    { icon: "🎨", label: "风格", onClick: handleToolStyle, active: false },
    { icon: "📄", label: "页面类型", onClick: handleToolPageType, active: false },
    { icon: "📞", label: "联系方式", onClick: handleToolContact, active: false },
  ];

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AnnouncementBar />
        <MobileNav />
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 lg:py-14">
          <div className="w-full max-w-2xl space-y-6 sm:space-y-8">

            {/* ── Hero ── */}
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">从一个想法，到一个可分享网页</h1>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-500 sm:text-base">输入你的需求，智脑会生成页面结构、文案和视觉风格，并支持编辑、发布和分享。</p>
            </div>

            {/* ── Mode toggle ── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {MODES.map((m) => (
                <button key={m.key} type="button" onClick={() => handleModeChange(m)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition sm:text-sm ${activeMode === m.key ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"}`}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 transition sm:text-sm">
                <span className="mr-1 text-slate-300">▸</span>{summaryText}
              </span>
            </div>

            {/* ── Prompt workspace ── */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className={`relative rounded-2xl border bg-white shadow-lg transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-slate-200 ${promptFlashed ? "border-slate-400 shadow-md ring-1 ring-slate-300" : "border-slate-200"}`}>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。"
                  rows={4} maxLength={1000}
                  className="w-full resize-none rounded-2xl bg-transparent px-5 py-4 text-sm text-slate-900 placeholder-slate-400 outline-none sm:px-6 sm:py-5 sm:text-base" />
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    {TOOLS.map((t) => (
                      <button key={t.label} type="button" onClick={t.onClick}
                        className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition ${t.active ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`} aria-label={t.label}>
                        <span className="text-[13px]">{t.icon}</span>
                        <span className="hidden sm:inline">{t.label}</span>
                      </button>
                    ))}
                  </div>
                  <button type="submit" className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-800 active:scale-95 sm:h-10 sm:w-10" aria-label="发送生成请求">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8L14.5 1.5L8 14.5L6.5 9.5L1.5 8Z" fill="currentColor" /><path d="M6.5 9.5L9.5 6.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                </div>
              </div>
            </form>

            {/* ── Quick tags ── */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {QUICK_TAGS.map((tag, idx) => (
                <button key={tag.label} type="button" onClick={() => handleTagClick(tag, idx)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition ${activeTag === idx ? "border-slate-900 bg-slate-100 text-slate-900 font-medium" : "border-dashed border-slate-300 bg-white/60 text-slate-600 hover:border-slate-400 hover:bg-white hover:text-slate-900"}`}>
                  {tag.label}
                </button>
              ))}
            </div>

            {/* ── Featured templates ── */}
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/75 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">精选模板</p>
                <Link href="/templates" className="text-xs font-medium text-slate-500 transition hover:text-slate-900">查看全部</Link>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {templatePresets.slice(0, 3).map((template) => (
                  <Link
                    key={template.id}
                    href={`/generate?templateId=${template.id}&visualMode=1`}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition hover:border-slate-300 hover:shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-900">{template.name}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{template.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Recent history ── */}
            {recentHistory.length > 0 ? (
              <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">最近创建</p>
                <div className="space-y-1.5">
                  {recentHistory.map((entry, i) => (
                    <button key={i} type="button" onClick={() => handleHistoryClick(entry)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50">
                      <span className="shrink-0 text-xs text-slate-300">🕐</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700 truncate">{entry.prompt}</p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {PAGE_TYPE_LABELS[entry.pageType]} · {STYLE_LABELS[entry.style]} · {formatTime(entry.createdAt)}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-slate-300">复用 →</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* ── Examples ── */}
            <div id="home-examples" className="space-y-2">
              <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-400">试试这些</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} type="button" onClick={() => handleExampleClick(ex)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-[13px] leading-relaxed text-slate-600 transition hover:border-slate-300 hover:text-slate-900 hover:shadow-sm">
                    &ldquo;{ex}&rdquo;
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-[11px] text-slate-400 sm:text-xs">页面由 AI 生成，发布前请自行检查内容准确性。</p>
          </div>
        </main>
      </div>
    </div>
  );
}
