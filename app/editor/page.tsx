"use client";

import { useState } from "react";
import Link from "next/link";
import type { PageContent } from "@/types/page";
import { isValidPageContent } from "@/lib/pageValidation";
import { Button } from "@/components/ui/Button";
import { PageEditor } from "@/components/editor/PageEditor";

type LoadState =
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "ready"; content: PageContent };

function loadContent(): LoadState {
  try {
    const raw = localStorage.getItem("currentPageContent");
    if (!raw) return { status: "empty" };

    const parsed = JSON.parse(raw);
    if (!isValidPageContent(parsed)) return { status: "invalid" };

    return { status: "ready", content: parsed as PageContent };
  } catch {
    return { status: "invalid" };
  }
}

export default function EditorPage() {
  const [state] = useState<LoadState>(loadContent);

  if (state.status === "empty") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
        <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">暂无编辑内容</h1>
              <p className="text-base text-slate-600">请先通过 AI 生成网页，再进入编辑器调整内容和样式。</p>
            </div>
            <Link href="/generate">
              <Button size="lg">去生成网页</Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (state.status === "invalid") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
        <section className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950">数据格式异常</h1>
              <p className="text-base text-slate-600">已保存的页面数据结构不正确，无法正常编辑。请重新生成一个新的页面。</p>
            </div>
            <Link href="/generate">
              <Button size="lg">重新生成</Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <PageEditor initialContent={state.content} />;
}
