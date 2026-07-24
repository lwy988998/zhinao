"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AssetSource, GallerySection, PageContent } from "@/types/page";
import {
  updatePageField,
  updateThemeStyle,
  updateThemeColor,
  updateHeroField,
  updateCTAField,
  updateContactField,
  updateSectionTitle,
  updateSectionDescription,
  toggleSectionVisible,
  moveSectionUp,
  moveSectionDown,
} from "@/lib/editorUtils";
import { PageRenderer } from "@/components/PageRenderer";
import { Input } from "@/components/ui/Input";
import { Selector } from "@/components/ui/Selector";

//
// Constants
//

const STYLE_OPTIONS = [
  { value: "minimal", label: "极简干净" },
  { value: "business", label: "商务专业" },
  { value: "elegant", label: "温柔高级" },
  { value: "tech", label: "科技未来" },
  { value: "youthful", label: "活泼年轻" },
];

const COLOR_OPTIONS = [
  { value: "blue", label: "蓝色", color: "#2563eb" },
  { value: "green", label: "绿色", color: "#059669" },
  { value: "purple", label: "紫色", color: "#7c3aed" },
  { value: "orange", label: "橙色", color: "#ea580c" },
  { value: "black_gold", label: "黑金", color: "#111827" },
  { value: "pink", label: "粉色", color: "#db2777" },
];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero 首屏",
  features: "功能特点",
  pain_points: "痛点分析",
  solution: "解决方案",
  process: "流程步骤",
  pricing: "价格方案",
  testimonials: "学员评价",
  faq: "常见问题",
  contact: "联系方式",
  cta: "CTA 行动号召",
  app_preview: "应用预览",
  dashboard: "仪表盘",
  timeline: "时间线",
  gallery: "作品图库",
};

//
// Helpers
//

function getSectionDisplayTitle(section: PageContent["sections"][number], index: number): string {
  const label = SECTION_LABELS[section.type] ?? section.type;
  const title = (section as unknown as Record<string, unknown>).title as string | undefined;
  return title ? `${index + 1}. ${label} — ${title}` : `${index + 1}. ${label}`;
}

function hasDescription(section: PageContent["sections"][number]): boolean {
  return (
    section.type === "hero" ||
    section.type === "solution" ||
    section.type === "contact" ||
    section.type === "cta"
  );
}

function hasSubtitle(section: PageContent["sections"][number]): boolean {
  return section.type === "features";
}

type CollapsibleProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

function Collapsible({ title, defaultOpen = false, children }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-800"
      >
        <span>{title}</span>
        <span className="text-slate-400 transition-transform" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>
      {open ? <div className="border-t border-slate-100 px-4 pb-4 pt-3">{children}</div> : null}
    </div>
  );
}

//
// Main component
//

type Props = {
  initialContent: PageContent;
};

type PublishState = "idle" | "publishing" | "success" | "error";

type PublishResult = {
  pageId: string;
  editToken: string;
  publicUrl: string;
  editUrl: string;
};

export function PageEditor({ initialContent }: Props) {
  const [content, setContent] = useState<PageContent>(initialContent);
  const [publishState, setPublishState] = useState<PublishState>("idle");
  const [publishResult, setPublishResult] = useState<PublishResult | null>(null);
  const [publishError, setPublishError] = useState("");
  // Check for edit token from /edit/[editToken] flow
  const [hasEditToken] = useState(() => {
    try {
      return !!localStorage.getItem("currentEditToken");
    } catch {
      return false;
    }
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [copyLabel, setCopyLabel] = useState("复制公开链接");
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroIdx = content.sections.findIndex((s) => s.type === "hero");
  const ctaIdx = content.sections.findIndex((s) => s.type === "cta");
  const contactIdx = content.sections.findIndex((s) => s.type === "contact");
  const gallerySections = content.sections
    .map((section, index) => ({ section, index }))
    .filter((entry): entry is { section: GallerySection; index: number } => entry.section.type === "gallery");

  const heroSection = heroIdx >= 0 ? (content.sections[heroIdx] as import("@/types/page").HeroSection) : null;
  const ctaSection = ctaIdx >= 0 ? (content.sections[ctaIdx] as import("@/types/page").CTASection) : null;
  const contactSection = contactIdx >= 0 ? (content.sections[contactIdx] as import("@/types/page").ContactSection) : null;

  const update = useCallback((fn: (c: PageContent) => PageContent) => {
    setContent((prev) => fn(prev));
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToastMessage(""), 2200);
  }, []);

  const createUserSource = useCallback((type: AssetSource["type"], imageUrl: string): AssetSource => ({
    id: `user-${type ?? "asset"}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: "用户自定义图片",
    source: "user",
    url: imageUrl,
    imageUrl,
    provider: "user",
    createdAt: new Date().toISOString(),
  }), []);

  useEffect(() => {
    try {
      localStorage.setItem("currentPageContent", JSON.stringify(content));
    } catch {
      // localStorage unavailable — safe to ignore in preview-only contexts
    }
  }, [content]);

  const replaceHeroImage = useCallback((url: string, options?: { silent?: boolean; source?: AssetSource }) => {
    update((current) => {
      const trimmed = url.trim();
      const sections = current.sections.map((section) => {
        if (section.type !== "hero") return section;
        return {
          ...section,
          mediaUrl: trimmed || undefined,
          mediaType: trimmed ? "image" as const : "none" as const,
          mediaFit: trimmed ? (section.mediaFit ?? "cover") : section.mediaFit,
        };
      });
      const nextSources = trimmed && options?.source
        ? [...(current.assets?.sources ?? []), options.source]
        : current.assets?.sources;
      return {
        ...current,
        assets: {
          ...(current.assets ?? {}),
          heroImageUrl: trimmed || undefined,
          coverImageUrl: trimmed || current.assets?.collageImageUrls?.[0],
          sources: nextSources,
        },
        sections,
      };
    });
    if (!options?.silent) showToast(url.trim() ? "Hero 图片已更新" : "Hero 图片已清空");
  }, [showToast, update]);

  const replaceGalleryImage = useCallback((sectionIndex: number, itemIndex: number, url: string, options?: { silent?: boolean; source?: AssetSource }) => {
    update((current) => {
      const trimmed = url.trim();
      const sections = current.sections.map((section, idx) => {
        if (idx !== sectionIndex || section.type !== "gallery") return section;
        return {
          ...section,
          items: section.items.map((item, i) => i === itemIndex ? { ...item, imageUrl: trimmed || undefined } : item),
        };
      });
      const collageImageUrls = sections
        .filter((section): section is GallerySection => section.type === "gallery")
        .flatMap((section) => section.items.map((item) => item.imageUrl).filter((item): item is string => Boolean(item)));
      const nextSources = trimmed && options?.source
        ? [...(current.assets?.sources ?? []), options.source]
        : current.assets?.sources;
      return {
        ...current,
        sections,
        assets: {
          ...(current.assets ?? {}),
          collageImageUrls: collageImageUrls.length ? collageImageUrls : undefined,
          coverImageUrl: current.assets?.heroImageUrl ?? collageImageUrls[0],
          sources: nextSources,
        },
      };
    });
    if (!options?.silent) showToast(url.trim() ? "Gallery 图片已更新" : "Gallery 图片已清空");
  }, [showToast, update]);

  const applySourceAsHero = useCallback((source: AssetSource) => {
    const imageUrl = source.imageUrl ?? source.url;
    if (!imageUrl) {
      showToast("这条来源没有图片 URL");
      return;
    }
    replaceHeroImage(imageUrl, { silent: true });
    showToast("已使用该来源图作为 Hero");
  }, [replaceHeroImage, showToast]);

  const disableSourceImage = useCallback((source: AssetSource) => {
    const imageUrl = source.imageUrl ?? source.url;
    update((current) => {
      const sections = current.sections.map((section) => {
        if (section.type === "hero" && imageUrl && section.mediaUrl === imageUrl) {
          return { ...section, mediaUrl: undefined, mediaType: "none" as const };
        }
        if (section.type === "gallery" && imageUrl) {
          return {
            ...section,
            items: section.items.map((item) => item.imageUrl === imageUrl ? { ...item, imageUrl: undefined } : item),
          };
        }
        return section;
      });
      const collageImageUrls = sections
        .filter((section): section is GallerySection => section.type === "gallery")
        .flatMap((section) => section.items.map((item) => item.imageUrl).filter((item): item is string => Boolean(item)));
      const sources = (current.assets?.sources ?? []).map((item) => {
        const sameIdentity = source.id && item.id === source.id;
        const sameImage = imageUrl && (item.imageUrl === imageUrl || item.url === imageUrl);
        return sameIdentity || sameImage ? { ...item, disabled: true } : item;
      });
      const heroImageUrl = current.assets?.heroImageUrl === imageUrl ? undefined : current.assets?.heroImageUrl;
      return {
        ...current,
        sections,
        assets: {
          ...(current.assets ?? {}),
          heroImageUrl,
          collageImageUrls: collageImageUrls.length ? collageImageUrls : undefined,
          coverImageUrl: heroImageUrl ?? collageImageUrls[0],
          sources,
        },
      };
    });
    showToast("已禁用这张图片");
  }, [showToast, update]);

  const copyImageUrl = useCallback(async (source: AssetSource) => {
    const imageUrl = source.imageUrl ?? source.url;
    if (!imageUrl) {
      showToast("这条来源没有图片 URL");
      return;
    }
    try {
      await navigator.clipboard.writeText(imageUrl);
      showToast("图片 URL 已复制");
    } catch {
      showToast("复制失败，请手动复制");
    }
  }, [showToast]);

  async function handlePublish() {
    setPublishState("publishing");
    setPublishError("");

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        setPublishError(payload.error ?? "发布失败，请稍后重试");
        setPublishState("error");
        return;
      }

      setPublishResult(payload.data);
      setPublishState("success");
    } catch {
      setPublishError("网络错误，请稍后重试");
      setPublishState("error");
    }
  }

  async function handleSaveToServer() {
    setSaveState("saving");
    setSaveMessage("");

    try {
      const token = localStorage.getItem("currentEditToken");
      if (!token) {
        setSaveState("error");
        setSaveMessage("未找到编辑令牌");
        return;
      }

      const response = await fetch(`/api/edit/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.success) {
        setSaveState("error");
        setSaveMessage(payload?.error ?? "保存失败");
        return;
      }

      setSaveState("saved");
      setSaveMessage("已保存到服务器");
    } catch {
      setSaveState("error");
      setSaveMessage("网络错误，保存失败");
    }

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      setSaveState("idle");
      setSaveMessage("");
    }, 3000);
  }

  async function handleCopyLink() {
    if (!publishResult) return;

    const fullUrl = `${window.location.origin}${publishResult.publicUrl}`;

    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopyLabel("已复制！");
    } catch {
      setCopyLabel("复制失败，请手动复制");
    }

    if (copyTimeout.current) clearTimeout(copyTimeout.current);
    copyTimeout.current = setTimeout(() => setCopyLabel("复制公开链接"), 2000);
  }

  const heroBtnText =
    heroSection
      ? (heroSection.buttonText ?? heroSection.primaryButtonText ?? "")
      : "";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      {/* ── Left: editing panel ── */}
      <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-r border-slate-200 bg-white p-4 lg:w-[420px] lg:max-h-screen">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-950">页面编辑器</h2>
          <p className="text-xs text-slate-500">修改后自动保存到当前浏览器</p>
        </div>

        {/* Publish / Save buttons */}
        {publishState === "success" && publishResult ? (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 space-y-3">
            <p className="text-sm font-semibold text-green-800">✅ 发布成功</p>
            <div className="space-y-2 text-xs text-slate-600">
              <div>
                <span className="font-medium text-slate-800">公开页面：</span>
                <a
                  href={publishResult.publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-600 underline break-all"
                >
                  {window.location.origin}{publishResult.publicUrl}
                </a>
              </div>
              <div>
                <span className="font-medium text-slate-800">编辑链接：</span>
                <span className="ml-1 text-slate-500 break-all select-all">
                  {window.location.origin}{publishResult.editUrl}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-xs font-medium text-white transition hover:bg-slate-800"
              >
                {copyLabel}
              </button>
              <a
                href={publishResult.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:border-slate-400"
              >
                打开公开页面
              </a>
              <button
                type="button"
                onClick={() => setPublishState("idle")}
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:border-slate-400"
              >
                继续编辑
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishState === "publishing"}
              className="inline-flex h-9 items-center justify-center rounded-full bg-slate-950 px-4 text-xs font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {publishState === "publishing" ? "发布中..." : "🚀 发布页面"}
            </button>
            {hasEditToken ? (
              <button
                type="button"
                onClick={handleSaveToServer}
                disabled={saveState === "saving"}
                className={`inline-flex h-9 items-center justify-center rounded-full border px-4 text-xs font-medium transition disabled:opacity-60 ${
                  saveState === "saved"
                    ? "border-green-300 bg-green-50 text-green-700"
                    : saveState === "error"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
                }`}
              >
                {saveState === "saving" ? "保存中..." : saveState === "saved" ? "✅ 已保存" : saveState === "error" ? "❌ 失败" : "💾 保存修改"}
              </button>
            ) : null}
          </div>
        )}

        {publishError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{publishError}</p>
        ) : null}

        {saveMessage ? (
          <p className={`rounded-xl border px-3 py-2 text-xs ${
            saveState === "saved"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}>{saveMessage}</p>
        ) : null}

        {toastMessage ? (
          <p className="rounded-xl border border-slate-200 bg-slate-950 px-3 py-2 text-xs text-white shadow-sm">{toastMessage}</p>
        ) : null}

        {/* Page Info */}
        <Collapsible title="📄 页面信息" defaultOpen>
          <div className="space-y-3">
            <Input
              label="页面标题"
              value={content.pageTitle}
              onChange={(v) => update((c) => updatePageField(c, "pageTitle", v))}
              maxLength={60}
            />
            <Input
              label="页面简介"
              type="textarea"
              rows={3}
              value={content.pageDescription}
              onChange={(v) => update((c) => updatePageField(c, "pageDescription", v))}
              maxLength={200}
            />
          </div>
        </Collapsible>

        {/* Theme */}
        <Collapsible title="🎨 主题设置">
          <div className="space-y-3">
            <Selector
              label="视觉风格"
              options={STYLE_OPTIONS}
              value={content.theme.style}
              onChange={(v) => update((c) => updateThemeStyle(c, v as typeof c.theme.style))}
            />
            <Selector
              label="主色调"
              type="color"
              options={COLOR_OPTIONS}
              value={content.theme.primaryColor}
              onChange={(v) => update((c) => updateThemeColor(c, v as typeof c.theme.primaryColor))}
            />
          </div>
        </Collapsible>

        {/* Hero Edit */}
        {heroSection ? (
          <Collapsible title="🦸 Hero 首屏">
            <div className="space-y-3">
              <Input
                label="标题"
                value={heroSection.title}
                onChange={(v) => update((c) => updateHeroField(c, "title", v))}
                maxLength={80}
              />
              <Input
                label="副标题"
                type="textarea"
                rows={2}
                value={heroSection.subtitle}
                onChange={(v) => update((c) => updateHeroField(c, "subtitle", v))}
                maxLength={150}
              />
              <Input
                label="按钮文字"
                value={heroBtnText}
                onChange={(v) => update((c) => updateHeroField(c, "buttonText", v))}
                maxLength={20}
              />
              <Input
                label="按钮动作"
                value={heroSection.buttonAction}
                onChange={(v) => update((c) => updateHeroField(c, "buttonAction", v))}
                maxLength={30}
              />
            </div>
          </Collapsible>
        ) : null}

        {/* Image Edit */}
        <Collapsible title="🖼️ 图片替换">
          <div className="space-y-4">
            <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-700">Hero 图片 URL</p>
              {heroSection?.mediaUrl || content.assets?.heroImageUrl ? (
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                  <img src={heroSection?.mediaUrl ?? content.assets?.heroImageUrl} alt="Hero 预览" className="h-28 w-full object-cover" />
                </div>
              ) : (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white text-xs text-slate-400">当前使用占位视觉</div>
              )}
              <input
                type="url"
                value={heroSection?.mediaUrl ?? content.assets?.heroImageUrl ?? ""}
                onChange={(event) => replaceHeroImage(event.target.value, { silent: true })}
                placeholder="https://example.com/hero.jpg"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const url = heroSection?.mediaUrl ?? content.assets?.heroImageUrl ?? "";
                    replaceHeroImage(url, { source: url ? createUserSource("hero", url) : undefined });
                  }}
                  className="inline-flex h-8 items-center justify-center rounded-full bg-slate-950 px-3 text-xs font-medium text-white transition hover:bg-slate-800"
                >
                  替换 Hero 图片
                </button>
                <button
                  type="button"
                  onClick={() => replaceHeroImage("")}
                  className="inline-flex h-8 items-center justify-center rounded-full border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 transition hover:border-slate-400"
                >
                  清空图片
                </button>
              </div>
            </div>

            {gallerySections.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-medium text-slate-700">Gallery 图片</p>
                {gallerySections.map(({ section, index }) => (
                  <div key={section.id ?? `gallery-${index}`} className="space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-xs font-medium text-slate-500">{section.title ?? "作品图库"}</p>
                    {section.items.map((item, itemIndex) => (
                      <div key={`${item.title}-${itemIndex}`} className="space-y-1 rounded-lg bg-slate-50 p-2">
                        <label className="text-[11px] font-medium text-slate-500">{item.title || `图片 ${itemIndex + 1}`}</label>
                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-16 w-full rounded-md object-cover" /> : null}
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={item.imageUrl ?? ""}
                            onChange={(event) => replaceGalleryImage(index, itemIndex, event.target.value, { silent: true })}
                            placeholder="https://example.com/gallery.jpg"
                            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => replaceGalleryImage(index, itemIndex, "")}
                            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-500 transition hover:text-slate-900"
                          >
                            清空
                          </button>
                          <button
                            type="button"
                            onClick={() => item.imageUrl ? replaceGalleryImage(index, itemIndex, item.imageUrl, { source: createUserSource("gallery", item.imageUrl) }) : showToast("请先输入图片 URL")}
                            className="shrink-0 rounded-lg bg-slate-950 px-2 text-xs text-white transition hover:bg-slate-800"
                          >
                            替换
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">当前页面没有 Gallery 模块。</p>
            )}

            <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-700">图片来源</p>
                <span className="text-[11px] text-slate-400">{content.assets?.sources?.length ?? 0} 条</span>
              </div>
              {content.assets?.sources?.length ? (
                <div className="space-y-2">
                  {content.assets.sources.map((source, index) => {
                    const imageUrl = source.imageUrl ?? source.url;
                    const typeLabel = source.type === "hero" ? "Hero" : source.type === "gallery" ? "Gallery" : source.type === "cover" ? "Cover" : source.type === "icon" ? "Icon" : "图片";
                    return (
                      <div key={source.id ?? `${source.url}-${index}`} className={`space-y-2 rounded-lg border p-2 ${source.disabled ? "border-slate-200 bg-slate-50 opacity-60" : "border-slate-200 bg-slate-50"}`}>
                        <div className="flex gap-2">
                          {imageUrl ? <img src={imageUrl} alt={source.title ?? "图片来源"} className="h-14 w-16 shrink-0 rounded-md object-cover" /> : null}
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-white">{typeLabel}</span>
                              {source.provider ? <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600">{source.provider}</span> : null}
                              {source.disabled ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] text-red-600">已禁用</span> : null}
                            </div>
                            <p className="truncate text-xs font-medium text-slate-800">{source.title ?? "未命名图片"}</p>
                            <p className="truncate text-[11px] text-slate-500">{source.licenseHint ?? "未提供 licenseHint"}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => showToast("已打开来源链接")}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 transition hover:text-slate-950"
                            >
                              打开来源
                            </a>
                          ) : null}
                          <button type="button" onClick={() => copyImageUrl(source)} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] text-slate-600 transition hover:text-slate-950">复制图片 URL</button>
                          <button type="button" onClick={() => applySourceAsHero(source)} className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] text-white transition hover:bg-slate-800">用作 Hero</button>
                          <button type="button" onClick={() => disableSourceImage(source)} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] text-red-600 transition hover:border-red-300">禁用这张图</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">暂无自动图片来源。用户替换图片后也会记录在这里。</p>
              )}
            </div>
          </div>
        </Collapsible>

        {/* CTA Edit */}
        {ctaSection ? (
          <Collapsible title="📢 CTA 行动号召">
            <div className="space-y-3">
              <Input
                label="标题"
                value={ctaSection.title ?? ""}
                onChange={(v) => update((c) => updateCTAField(c, "title", v))}
                maxLength={80}
              />
              <Input
                label="描述"
                type="textarea"
                rows={2}
                value={ctaSection.description ?? ""}
                onChange={(v) => update((c) => updateCTAField(c, "description", v))}
                maxLength={150}
              />
              <Input
                label="按钮文字"
                value={ctaSection.buttonText ?? ""}
                onChange={(v) => update((c) => updateCTAField(c, "buttonText", v))}
                maxLength={20}
              />
              <Input
                label="按钮动作"
                value={ctaSection.buttonAction ?? ""}
                onChange={(v) => update((c) => updateCTAField(c, "buttonAction", v))}
                maxLength={30}
              />
            </div>
          </Collapsible>
        ) : null}

        {/* Contact Edit */}
        {contactSection ? (
          <Collapsible title="📞 联系方式">
            <div className="space-y-3">
              <Input
                label="标题"
                value={contactSection.title ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "title", v))}
                maxLength={60}
              />
              <Input
                label="描述"
                type="textarea"
                rows={2}
                value={contactSection.description ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "description", v))}
                maxLength={150}
              />
              <Input
                label="微信号"
                value={contactSection.wechat ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "wechat", v))}
                maxLength={50}
              />
              <Input
                label="手机号"
                value={contactSection.phone ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "phone", v))}
                maxLength={30}
              />
              <Input
                label="邮箱"
                value={contactSection.email ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "email", v))}
                maxLength={60}
              />
              <Input
                label="地址"
                value={contactSection.address ?? ""}
                onChange={(v) => update((c) => updateContactField(c, "address", v))}
                maxLength={120}
              />
            </div>
          </Collapsible>
        ) : null}

        {/* Section Management */}
        <Collapsible title="📋 模块管理" defaultOpen>
          <div className="space-y-2">
            {content.sections.map((section, idx) => {
              const visible = section.visible !== false;
              const isHero = section.type === "hero";
              const isCta = section.type === "cta";
              const isFirst = idx === 0;
              const isLast = idx === content.sections.length - 1;

              return (
                <div
                  key={section.id ?? `${section.type}-${idx}`}
                  className={`rounded-xl border p-3 text-sm transition ${
                    visible ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-slate-900">
                        {getSectionDisplayTitle(section, idx)}
                      </p>

                      {/* Generic title edit */}
                      {section.title !== undefined ? (
                        <input
                          type="text"
                          value={section.title ?? ""}
                          onChange={(e) =>
                            update((c) => updateSectionTitle(c, idx, e.target.value))
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
                          placeholder="模块标题"
                        />
                      ) : null}

                      {/* Generic description / subtitle edit */}
                      {hasDescription(section) || hasSubtitle(section) ? (
                        <input
                          type="text"
                          value={
                            hasSubtitle(section)
                              ? ((section as unknown as Record<string, unknown>).subtitle as string) ?? ""
                              : ((section as unknown as Record<string, unknown>).description as string) ?? ""
                          }
                          onChange={(e) =>
                            update((c) => updateSectionDescription(c, idx, e.target.value))
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 focus:border-slate-400 focus:outline-none"
                          placeholder={hasSubtitle(section) ? "副标题" : "描述"}
                        />
                      ) : null}
                    </div>

                    {/* Controls */}
                    <div className="flex shrink-0 items-center gap-1">
                      {/* Visibility toggle */}
                      {!isHero && !isCta ? (
                        <button
                          type="button"
                          onClick={() => update((c) => toggleSectionVisible(c, idx))}
                          title={visible ? "隐藏" : "显示"}
                          className="rounded-md p-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          {visible ? "👁" : "🚫"}
                        </button>
                      ) : (
                        <span className="p-1 text-xs text-slate-300" title="不可隐藏">
                          👁
                        </span>
                      )}

                      {/* Move up */}
                      <button
                        type="button"
                        disabled={isFirst || isHero}
                        onClick={() => update((c) => moveSectionUp(c, idx))}
                        title="上移"
                        className="rounded-md p-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ▲
                      </button>

                      {/* Move down */}
                      <button
                        type="button"
                        disabled={isLast || isCta}
                        onClick={() => update((c) => moveSectionDown(c, idx))}
                        title="下移"
                        className="rounded-md p-1 text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Collapsible>
      </aside>

      {/* ── Right: preview ── */}
      <div className="flex-1 bg-slate-100 overflow-auto">
        <div className="mx-auto max-w-5xl px-2 py-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <PageRenderer content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}
