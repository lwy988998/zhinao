import { PageRenderer } from "@/components/PageRenderer";
import { mockPageContent } from "@/data/mockPage";

export default function PreviewPage() {
  return (
    <div>
      <div className="border-b border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-medium text-slate-900">Mock 页面预览</span>
          <span>当前页面由结构化 PageContent 渲染生成</span>
        </div>
      </div>
      <PageRenderer content={mockPageContent} mode="preview" />
    </div>
  );
}
