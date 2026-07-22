"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { PageContent } from "@/types/page";

function subscribeToStorage() {
  return () => undefined;
}

function getStoredPageTitle() {
  const raw = window.localStorage.getItem("currentPageContent");

  if (!raw) {
    return "";
  }

  try {
    const content = JSON.parse(raw) as PageContent;
    return content.pageTitle || "未命名网页";
  } catch {
    return "";
  }
}

export default function EditorPlaceholderPage() {
  const pageTitle = useSyncExternalStore(subscribeToStorage, getStoredPageTitle, () => "");
  const hasPage = pageTitle.length > 0;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
        {hasPage ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">编辑器开发中</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">网页已生成</h1>
              <p className="text-base text-slate-600">{pageTitle}</p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/preview"
                className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                查看预览
              </Link>
              <Link
                href="/generate"
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                重新生成
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">还没有生成网页，请先创建一个。</h1>
              <p className="text-base text-slate-600">生成成功后会临时保存到当前浏览器。</p>
            </div>
            <Link
              href="/generate"
              className="inline-flex h-11 items-center justify-center rounded-full bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              去生成网页
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
