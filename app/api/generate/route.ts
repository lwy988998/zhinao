import { NextRequest, NextResponse } from "next/server";
import { generatePageContent } from "@/lib/ai";
import { applyFoundImages, findPageImages } from "@/lib/assetSearch";
import { enrichPageWithImages } from "@/lib/image";
import { enrichInteractiveContent } from "@/lib/pagePostProcess";
import { getTemplateById } from "@/lib/templates";
import type { ContactActionType, PageType, PrimaryColor, ThemeStyle } from "@/types/page";

type GenerateParams = {
  userInput: string;
  pageType: PageType;
  style: ThemeStyle;
  primaryColor: PrimaryColor;
  contactAction: ContactActionType;
  visualMode: boolean;
  templateId?: string;
  forceFallback?: boolean;
};

const pageTypes: PageType[] = ["personal_profile", "product_service", "local_business", "event_signup", "course_sales"];
const styles: ThemeStyle[] = ["minimal", "business", "elegant", "tech", "youthful"];
const primaryColors: PrimaryColor[] = ["blue", "green", "purple", "orange", "black_gold", "pink"];
const contactActions: ContactActionType[] = ["wechat", "phone", "form", "link", "email"];

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}

function isOneOf<T extends string>(value: unknown, options: T[]): value is T {
  return typeof value === "string" && options.includes(value as T);
}

function validateRequestBody(body: unknown): { success: true; data: GenerateParams } | { success: false; error: string } {
  if (!isRecord(body)) {
    return { success: false, error: "请求体格式不正确" };
  }

  if (typeof body.userInput !== "string" || body.userInput.trim().length < 10) {
    return { success: false, error: "请提供至少 10 个字符的需求描述" };
  }

  if (body.userInput.trim().length > 1000) {
    return { success: false, error: "需求描述不能超过 1000 个字符" };
  }

  if (!isOneOf(body.pageType, pageTypes)) {
    return { success: false, error: "页面类型不合法" };
  }

  if (!isOneOf(body.style, styles)) {
    return { success: false, error: "视觉风格不合法" };
  }

  if (!isOneOf(body.primaryColor, primaryColors)) {
    return { success: false, error: "主色调不合法" };
  }

  if (!isOneOf(body.contactAction, contactActions)) {
    return { success: false, error: "目标动作不合法" };
  }

  const templateId = typeof body.templateId === "string" && body.templateId.trim()
    ? body.templateId.trim()
    : undefined;
  const template = getTemplateById(templateId);

  if (templateId && !template) {
    return { success: false, error: "模板不存在" };
  }

  return {
    success: true,
    data: {
      userInput: body.userInput.trim(),
      pageType: template?.pageType ?? body.pageType,
      style: template?.style ?? body.style,
      primaryColor: template?.primaryColor ?? body.primaryColor,
      contactAction: body.contactAction,
      visualMode: template?.visualMode ?? body.visualMode === true,
      templateId,
      forceFallback: body.forceFallback === true,
    },
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "请求体格式不正确" }, { status: 400 });
  }

  const validation = validateRequestBody(body);

  if (!validation.success) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
  }

  try {
    const generated = await generatePageContent(validation.data);
    const warnings = [...generated.meta.warnings];

    // Post-process: ensure interactive content is never empty
    const withContent = enrichInteractiveContent(generated.content);

    let enriched = withContent;

    if (validation.data.visualMode || validation.data.templateId) {
      try {
        const template = getTemplateById(validation.data.templateId);
        const found = await findPageImages({
          pageTitle: enriched.pageTitle,
          pageType: enriched.pageType,
          templateId: validation.data.templateId,
          imageSearchHints: template?.imageSearchHints,
        });
        enriched = applyFoundImages(enriched, found);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`[asset-search] non-fatal=${message.slice(0, 120)}`);
        warnings.push("图片搜索暂不可用，已跳过图片来源补全。");
      }
    }

    // Enrich with AI-generated images when no searched hero image is available.
    if (!enriched.assets?.heroImageUrl) {
      try {
        enriched = await enrichPageWithImages(enriched);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(`[image] non-fatal=${message.slice(0, 120)}`);
        warnings.push("图片生成暂不可用，已保留可编辑页面。");
      }
    }

    return NextResponse.json({
      success: true,
      data: enriched,
      meta: {
        provider: generated.meta.provider,
        providerTried: generated.meta.providerTried,
        warnings,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("/api/generate", message);

    // 透传安全诊断错误，其他错误归为通用提示
    const safeMessages = ["AI API 未配置", "AI 上游", "[primary]", "[fallback]"];
    const clientMessage = safeMessages.some((prefix) => message.startsWith(prefix))
      ? message
      : "AI 生成失败，请稍后重试";

    return NextResponse.json(
      { success: false, error: clientMessage, meta: { providerTried: [], warnings: ["生成链路异常，请检查服务配置。"] } },
      { status: 500 },
    );
  }
}
