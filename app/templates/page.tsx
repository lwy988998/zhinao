import Link from "next/link";
import { TemplatesClient } from "./TemplatesClient";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold text-slate-950">智脑</Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/generate" className="transition hover:text-slate-950">生成</Link>
            <Link href="/" className="transition hover:text-slate-950">首页</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-500">模板库</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">选择模板，让 AI 按风格生成网页</h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600">每个模板只定义通用设计方向、结构建议和搜图线索，不包含第三方网站素材。</p>
          </div>
          <Link href="/generate" className="inline-flex h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition hover:border-slate-400">直接生成</Link>
        </div>

        <TemplatesClient />
      </div>
    </main>
  );
}
