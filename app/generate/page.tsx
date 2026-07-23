"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingSteps } from "@/components/ui/LoadingSteps";
import { Selector } from "@/components/ui/Selector";
import type { ContactActionType, PageContent, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

type GenerateResponse =
  | { success: true; data: PageContent }
  | { success: false; error: string };

const loadingSteps = [
  "正在理解你的需求...",
  "正在规划网页结构...",
  "正在生成页面文案...",
  "正在设计视觉风格...",
  "正在渲染网页预览...",
];

const pageTypeOptions = [
  { value: "personal_profile", label: "个人介绍页", description: "展示个人经历、服务、价格和联系方式。" },
  { value: "product_service", label: "产品服务页", description: "介绍产品卖点、服务流程和咨询入口。" },
  { value: "local_business", label: "门店介绍页", description: "适合工作室、餐饮、美业、线下门店。" },
  { value: "event_signup", label: "活动报名页", description: "呈现活动亮点、时间地点和报名动作。" },
  { value: "course_sales", label: "课程销售页", description: "展示课程收益、价格、评价和报名方式。" },
];

const styleOptions = [
  { value: "minimal", label: "极简干净" },
  { value: "business", label: "商务专业" },
  { value: "elegant", label: "温柔高级" },
  { value: "tech", label: "科技未来" },
  { value: "youthful", label: "活泼年轻" },
];

const colorOptions = [
  { value: "blue", label: "蓝色", color: "#2563eb" },
  { value: "green", label: "绿色", color: "#059669" },
  { value: "purple", label: "紫色", color: "#7c3aed" },
  { value: "orange", label: "橙色", color: "#ea580c" },
  { value: "black_gold", label: "黑金", color: "#111827" },
  { value: "pink", label: "粉色", color: "#db2777" },
];

const actionOptions = [
  { value: "wechat", label: "添加微信" },
  { value: "phone", label: "电话咨询" },
  { value: "form", label: "提交报名" },
  { value: "link", label: "了解产品" },
  { value: "email", label: "邮件联系" },
];

// ── Labels for config summary ──
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

// ── Valid values sets for param validation ──
const VALID_PAGE_TYPES = new Set<string>(["personal_profile", "product_service", "local_business", "event_signup", "course_sales"]);
const VALID_STYLES = new Set<string>(["minimal", "business", "elegant", "tech", "youthful"]);
const VALID_COLORS = new Set<string>(["blue", "green", "purple", "orange", "black_gold", "pink"]);
const VALID_CONTACTS = new Set<string>(["wechat", "phone", "form", "link", "email"]);

function validatePageType(v: string | null): PageType {
  return v && VALID_PAGE_TYPES.has(v) ? (v as PageType) : "product_service";
}

function validateStyle(v: string | null): ThemeStyle {
  return v && VALID_STYLES.has(v) ? (v as ThemeStyle) : "minimal";
}

function validateColor(v: string | null): PrimaryColor {
  return v && VALID_COLORS.has(v) ? (v as PrimaryColor) : "blue";
}

function validateContact(v: string | null): ContactActionType {
  return v && VALID_CONTACTS.has(v) ? (v as ContactActionType) : "wechat";
}

function GenerateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  // Read query params once on mount
  const queryPrompt = useMemo(() => {
    const q = searchParams?.get("prompt");
    return q ? decodeURIComponent(q) : null;
  }, [searchParams]);

  const queryPageType = validatePageType(searchParams?.get("pageType") ?? null);
  const queryStyle = validateStyle(searchParams?.get("style") ?? null);
  const queryColor = validateColor(searchParams?.get("primaryColor") ?? null);
  const queryContact = validateContact(searchParams?.get("contactAction") ?? null);
  const queryVisual = (searchParams?.get("visualMode") ?? null) === "1";

  // Whether we have at least one param from homepage
  const hasQueryParams = useMemo(
    () => Boolean(queryPrompt ?? searchParams?.get("pageType") ?? searchParams?.get("style") ?? searchParams?.get("primaryColor") ?? searchParams?.get("contactAction")),
    [queryPrompt, searchParams],
  );

  const [userInput, setUserInput] = useState(() => queryPrompt ?? "");
  const [pageType, setPageType] = useState<PageType>(queryPageType);
  const [style, setStyle] = useState<ThemeStyle>(queryStyle);
  const [primaryColor, setPrimaryColor] = useState<PrimaryColor>(queryColor);
  const [contactAction, setContactAction] = useState<ContactActionType>(queryContact);
  const [inputError, setInputError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Mark as initialized after first render
  useEffect(() => {
    initializedRef.current = true;
  }, []);

  // Loading step animation
  useEffect(() => {
    if (!isLoading) return;
    const timer = window.setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, loadingSteps.length - 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  // Config summary
  const configSummary = useMemo(() => {
    const parts = [
      PAGE_TYPE_LABELS[pageType],
      STYLE_LABELS[style],
      COLOR_LABELS[primaryColor],
      CONTACT_LABELS[contactAction],
    ];
    if (queryVisual) parts.push("视觉增强");
    return parts.join(" · ");
  }, [pageType, style, primaryColor, contactAction, queryVisual]);

  function validate() {
    const trimmed = userInput.trim();
    if (trimmed.length < 10) {
      setInputError("请提供至少 10 个字符的需求描述");
      return false;
    }
    if (trimmed.length > 1000) {
      setInputError("需求描述不能超过 1000 个字符");
      return false;
    }
    setInputError("");
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitError("");
    setIsLoading(true);
    setCurrentStep(0);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: queryVisual ? `[视觉增强] ${userInput.trim()}` : userInput.trim(),
          pageType,
          style,
          primaryColor,
          contactAction,
        }),
      });

      const payload = (await response.json()) as GenerateResponse;
      if (!response.ok || !payload.success) {
        setSubmitError(payload.success ? "AI 生成失败，请稍后重试" : payload.error);
        return;
      }

      window.localStorage.setItem("currentPageContent", JSON.stringify(payload.data));
      router.push("/editor");
    } catch {
      setSubmitError("AI 生成失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold text-slate-950">
            智脑
          </Link>
          <Link href="/" className="text-sm text-slate-600 transition hover:text-slate-950">
            返回首页
          </Link>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-slate-500">生成配置</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">描述你的网页，交给 AI 生成</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            填写页面用途和偏好后，系统会调用真实 AI API 生成结构化 PageContent。
          </p>
        </div>

        {/* Source hint: when params came from homepage */}
        {hasQueryParams ? (
          <div className="mb-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span className="text-base">🏠</span>
            <span>已根据首页选择预填生成配置，你可以继续修改。</span>
          </div>
        ) : null}

        {/* Config summary bar */}
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm sm:gap-3">
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">将生成</span>
          <span className="font-medium text-slate-900">{configSummary}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <Input
            label="网页需求"
            type="textarea"
            rows={6}
            required
            maxLength={1000}
            value={userInput}
            onChange={setUserInput}
            error={inputError}
            placeholder="例如：我是一个瑜伽老师，想做一个个人介绍页，用来展示课程、价格、学员评价和微信二维码，风格温柔高级。"
          />

          <Selector
            label="页面类型"
            options={pageTypeOptions}
            value={pageType}
            onChange={(value) => setPageType(value as PageType)}
          />

          <Selector
            label="视觉风格"
            options={styleOptions}
            value={style}
            onChange={(value) => setStyle(value as ThemeStyle)}
          />

          <Selector
            label="主色调"
            type="color"
            options={colorOptions}
            value={primaryColor}
            onChange={(value) => setPrimaryColor(value as PrimaryColor)}
          />

          <Selector
            label="目标动作"
            options={actionOptions}
            value={contactAction}
            onChange={(value) => setContactAction(value as ContactActionType)}
          />

          {submitError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {submitError}
            </div>
          ) : null}

          {isLoading ? <LoadingSteps steps={loadingSteps} currentStep={currentStep} /> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? "正在生成..." : "生成网页"}
            </Button>
            {submitError ? (
              <span className="text-sm text-slate-500">修改需求后可以直接重试，也可以原样再次提交。</span>
            ) : null}
          </div>
        </form>
      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 text-slate-900">
          <div className="flex items-center justify-center py-32">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          </div>
        </main>
      }
    >
      <GenerateForm />
    </Suspense>
  );
}
