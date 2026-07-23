import { NextRequest, NextResponse } from "next/server";
import { savePublishedPage } from "@/lib/storage";
import { isValidPageContent } from "@/lib/pageValidation";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "请求体格式不正确" }, { status: 400 });
  }

  const content = body && typeof body === "object" && "content" in body ? (body as Record<string, unknown>).content : undefined;

  if (!isValidPageContent(content)) {
    return NextResponse.json({ success: false, error: "页面数据无效" }, { status: 400 });
  }

  try {
    const result = await savePublishedPage(content);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("/api/publish", message);
    return NextResponse.json({ success: false, error: "发布失败，请稍后重试" }, { status: 500 });
  }
}
