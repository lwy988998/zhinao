import { NextResponse } from "next/server";
import { getPublishedPage, isSafeId } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pageId: string }> },
) {
  const { pageId } = await params;

  if (!isSafeId(pageId)) {
    return NextResponse.json({ success: false, error: "页面 ID 无效" }, { status: 400 });
  }

  const record = await getPublishedPage(pageId);

  if (!record) {
    return NextResponse.json({ success: false, error: "页面不存在" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: record.content });
}
