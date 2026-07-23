"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; editToken: string };

export default function EditPage() {
  const params = useParams<{ editToken: string }>();
  const editToken = params?.editToken ?? "";
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/edit/${editToken}`);

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          setState({
            status: "error",
            message: payload?.error ?? "无法加载页面",
          });
          return;
        }

        const payload = await response.json();

        if (!cancelled) {
          try {
            localStorage.setItem("currentPageContent", JSON.stringify(payload.data));
            localStorage.setItem("currentEditToken", editToken);
          } catch {
            // ignore localStorage errors
          }

          setState({ status: "ready", editToken });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "网络错误，请稍后重试" });
        }
      }
    }

    if (editToken) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [editToken]);

  if (!editToken) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
        <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-950">无效链接</h1>
          <p className="mt-2 text-sm text-slate-500">编辑链接格式不正确。</p>
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                返回首页
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
        <p className="text-sm text-slate-500">加载页面数据...</p>
      </main>
    );
  }

  if (state.status === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
        <section className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center">
          <h1 className="text-lg font-semibold text-slate-950">加载失败</h1>
          <p className="mt-2 text-sm text-slate-500">{state.message}</p>
          <div className="mt-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                返回首页
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-2xl border border-green-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-2xl">
            ✅
          </div>
          <h1 className="text-xl font-semibold text-slate-950">已加载可编辑页面</h1>
          <p className="text-sm text-slate-500">
            页面数据已保存到当前浏览器，可以进入编辑器修改。
          </p>
          <Link href="/editor">
            <Button size="lg">进入编辑器</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
