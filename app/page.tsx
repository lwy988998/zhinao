export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500">智脑</p>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                一句话生成可发布网页
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                不用代码，不用设计。输入你的需求，AI 自动生成适合手机浏览的网页，并支持一键发布和分享。
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                开始生成网页
              </button>
              <span className="text-sm text-slate-500">MVP 开发中</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
