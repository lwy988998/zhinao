"use client";

import { FormEvent, useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ── Data ──

const MODES = [
  { key: "generate", label: "网页生成" },
  { key: "convert", label: "转化页" },
  { key: "personal", label: "个人主页" },
  { key: "event", label: "活动页" },
] as const;

const QUICK_TAGS = [
  { label: "个人介绍页", prompt: "我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。" },
  { label: "门店介绍页", prompt: "帮我生成一个咖啡店介绍页，展示门店环境、手冲菜单、到店路线和顾客评价，风格温暖亲切。" },
  { label: "课程销售页", prompt: "帮我做一个AI绘画训练营销售页，包含课程大纲、价格、讲师介绍、学员评价和报名按钮。" },
  { label: "产品服务页", prompt: "帮我做一个SaaS产品服务页，突出用户痛点、解决方案、功能亮点和预约咨询入口。" },
  { label: "活动报名页", prompt: "帮我做一个线下沙龙活动报名页，展示活动亮点、嘉宾、流程和报名按钮。" },
  { label: "作品集页面", prompt: "帮我做一个设计师作品集页面，展示项目案例、设计理念和联系方式，风格现代干净。" },
];

const EXAMPLES = [
  "做一个瑜伽老师个人主页，温柔高级，突出课程和微信咨询",
  "做一个咖啡店介绍页，展示环境、菜单、地址和联系方式",
  "做一个训练营销售页，包含课程大纲、价格、学员评价和报名按钮",
  "做一个产品服务页，突出痛点、解决方案和预约咨询",
];

const TOOLS = [
  { icon: "⚡", label: "自动" },
  { icon: "🖼️", label: "图片" },
  { icon: "🎨", label: "风格" },
  { icon: "📄", label: "页面类型" },
  { icon: "📞", label: "联系方式" },
];

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
  const items = [
    { icon: "✦", label: "创建", href: "/generate", active: true },
    { icon: "◇", label: "示例", href: "#", active: false },
    { icon: "⬆", label: "发布", href: "#", active: false },
    { icon: "⚙", label: "设置", href: "#", active: false },
  ];

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center border-r border-slate-200 bg-white py-4 md:flex lg:w-20">
      {/* Logo */}
      <Link href="/" className="mb-6 flex flex-col items-center gap-0.5 text-slate-900">
        <span className="text-xl font-bold leading-none tracking-tight">智脑</span>
        <span className="text-[10px] leading-none text-slate-400">zhinao</span>
      </Link>

      {/* Nav */}
      <nav className="flex flex-1 flex-col items-center gap-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none transition ${
              item.active
                ? "bg-slate-100 text-slate-900 font-medium"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Login placeholder */}
      <Link
        href="#"
        className="flex flex-col items-center gap-0.5 rounded-xl px-1 py-2.5 text-[11px] leading-none text-slate-400 hover:text-slate-600"
      >
        <span className="text-sm">👤</span>
        <span>登录</span>
      </Link>
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
  const [prompt, setPrompt] = useState("");
  const [activeMode, setActiveMode] = useState<string>("generate");

  const goToGenerate = useCallback(
    (text?: string) => {
      const q = (text ?? prompt).trim();
      if (q.length === 0) {
        router.push("/generate");
      } else {
        router.push(`/generate?prompt=${encodeURIComponent(q)}`);
      }
    },
    [prompt, router],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      goToGenerate();
    },
    [goToGenerate],
  );

  const handleTagClick = useCallback((text: string) => {
    setPrompt(text);
  }, []);

  const handleExampleClick = useCallback(
    (text: string) => {
      setPrompt(text);
    },
    [],
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Left sidebar — desktop */}
      <Sidebar />

      {/* Main area */}
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
                  onClick={() => setActiveMode(m.key)}
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
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
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
                  onClick={() => handleTagClick(tag.prompt)}
                  className="rounded-full border border-dashed border-slate-300 bg-white/60 px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-400 hover:bg-white hover:text-slate-900"
                >
                  {tag.label}
                </button>
              ))}
            </div>

            {/* ── Examples ── */}
            <div className="space-y-2">
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
