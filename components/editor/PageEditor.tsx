"use client";

import { useCallback, useRef, useState } from "react";
import type { PageContent } from "@/types/page";
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
  const [isSaving, setIsSaving] = useState(false);
  const [copyLabel, setCopyLabel] = useState("复制公开链接");
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroIdx = content.sections.findIndex((s) => s.type === "hero");
  const ctaIdx = content.sections.findIndex((s) => s.type === "cta");
  const contactIdx = content.sections.findIndex((s) => s.type === "contact");

  const heroSection = heroIdx >= 0 ? (content.sections[heroIdx] as import("@/types/page").HeroSection) : null;
  const ctaSection = ctaIdx >= 0 ? (content.sections[ctaIdx] as import("@/types/page").CTASection) : null;
  const contactSection = contactIdx >= 0 ? (content.sections[contactIdx] as import("@/types/page").ContactSection) : null;

  const update = useCallback((fn: (c: PageContent) => PageContent) => {
    setContent((prev) => fn(prev));
  }, []);

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
    setIsSaving(true);

    try {
      const token = localStorage.getItem("currentEditToken");
      if (!token) return;

      const response = await fetch(`/api/edit/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        console.warn("Save to server failed:", payload?.error ?? "unknown");
      }
    } catch {
      console.warn("Save to server failed: network error");
    } finally {
      setIsSaving(false);
    }
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
                disabled={isSaving}
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-xs font-medium text-slate-700 transition hover:border-slate-400 disabled:opacity-60"
              >
                {isSaving ? "保存中..." : "💾 保存修改"}
              </button>
            ) : null}
          </div>
        )}

        {publishError ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{publishError}</p>
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
