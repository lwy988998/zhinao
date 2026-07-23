import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPage } from "@/lib/storage";
import { isValidPageContent } from "@/lib/pageValidation";
import { PageRenderer } from "@/components/PageRenderer";

type Props = {
  params: Promise<{ pageId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageId } = await params;
  const record = await getPublishedPage(pageId);

  if (!record || !isValidPageContent(record.content)) {
    return { title: "页面不存在" };
  }

  return {
    title: record.content.seo.title || record.content.pageTitle,
    description: record.content.seo.description || record.content.pageDescription,
  };
}

export default async function PublicPage({ params }: Props) {
  const { pageId } = await params;
  const record = await getPublishedPage(pageId);

  if (!record || !isValidPageContent(record.content)) {
    notFound();
  }

  return (
    <div>
      <PageRenderer content={record.content} mode="public" />
      <footer className="border-t border-slate-200 bg-slate-50 py-4 text-center">
        <p className="text-xs text-slate-400">由智脑生成</p>
      </footer>
    </div>
  );
}
