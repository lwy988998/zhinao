import { NextRequest, NextResponse } from "next/server";
import { getPublishedPageByEditToken, updatePublishedPageByEditToken, isSafeId } from "@/lib/storage";
import { isValidPageContent } from "@/lib/pageValidation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ editToken: string }> },
) {
  const { editToken } = await params;

  if (!isSafeId(editToken)) {
    return NextResponse.json({ success: false, error: "编辑令牌无效" }, { status: 400 });
  }

  const record = await getPublishedPageByEditToken(editToken);

  if (!record) {
    return NextResponse.json({ success: false, error: "页面不存在" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: record.content });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ editToken: string }> },
) {
  const { editToken } = await params;

  if (!isSafeId(editToken)) {
    return NextResponse.json({ success: false, error: "编辑令牌无效" }, { status: 400 });
  }

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
    const updated = await updatePublishedPageByEditToken(editToken, content);

    if (!updated) {
      return NextResponse.json({ success: false, error: "页面不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated.content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    console.error("/api/edit/[editToken] POST", message);
    return NextResponse.json({ success: false, error: "保存失败，请稍后重试" }, { status: 500 });
  }
}
