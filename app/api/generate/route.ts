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
    const data = await generatePageContent(validation.data);

    // Post-process: ensure interactive content is never empty
    const withContent = enrichInteractiveContent(data);

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
      }
    }

    // Enrich with AI-generated images when no searched hero image is available.
    if (!enriched.assets?.heroImageUrl) {
      enriched = await enrichPageWithImages(enriched);
    }

    return NextResponse.json({ success: true, data: enriched });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("/api/generate", message);

    // 透传安全诊断错误，其他错误归为通用提示
    const safeMessages = ["AI API 未配置", "AI 上游", "[primary]", "[fallback]"];
    const clientMessage = safeMessages.some((prefix) => message.startsWith(prefix))
      ? message
      : "AI 生成失败，请稍后重试";

    return NextResponse.json(
      { success: false, error: clientMessage },
      { status: 500 },
    );
  }
}
