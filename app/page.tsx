import Link from "next/link";

const featureCards = [
  { title: "一句话生成", description: "输入需求，AI 自动整理结构、文案和模块。" },
  { title: "手机端优先", description: "先看移动端效果，适合微信内打开和分享。" },
  { title: "在线编辑", description: "生成后可继续调整文案和布局，再发布。" },
  { title: "一键发布", description: "后续接入发布链路后直接拿到公开链接。" },
  { title: "适合微信分享", description: "页面结构轻量清晰，适配社交传播场景。" },
];

const scenarioCards = [
  { title: "个人介绍页", description: "老师、咨询师、创作者、自由职业者都适用。" },
  { title: "产品服务页", description: "展示产品卖点、价格、案例和转化入口。" },
  { title: "门店介绍页", description: "适合门店、工作室、场馆做基础展示。" },
  { title: "活动报名页", description: "报名表单、活动亮点和流程可以一次生成。" },
  { title: "课程销售页", description: "适合训练营、课程、私教和陪跑产品。" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight text-slate-950">
            智脑
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <a href="#features" className="transition hover:text-slate-950">
              功能特点
            </a>
            <a href="#scenarios" className="transition hover:text-slate-950">
              适用场景
            </a>
            <Link href="/generate" className="font-medium text-slate-950 transition hover:text-slate-700">
              开始生成
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              真实 AI 生成网页 JSON
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                一句话生成可发布网页
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                不用代码，不用设计。输入需求，AI 自动生成手机端效果优秀的网页，支持一键发布和分享。
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/generate"
                className="inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                开始生成网页
              </Link>
              <a
                href="#example"
                className="inline-flex h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                查看示例
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-slate-500">示例输入</p>
              <blockquote className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700 sm:text-base">
                “我是一个瑜伽老师，帮我做一个个人介绍页，展示课程、价格、学员评价和微信二维码，风格温柔高级。”
              </blockquote>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">页面类型</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">个人介绍页</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">视觉风格</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">温柔高级</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">主色调</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">粉色</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">目标动作</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">添加微信</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">产品优势</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">更少操作，更快得到可用网页</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featureCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="scenarios" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-500">适用场景</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">先服务真实需求，再补完整能力</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {scenarioCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="example" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="space-y-4 text-center sm:text-left">
            <p className="text-sm font-medium text-slate-500">示例输入</p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">把需求说清楚，剩下的交给 AI</h2>
            <p className="max-w-3xl text-base leading-7 text-slate-600">
              输入你的身份、页面用途、风格、主色和目标动作，系统会生成结构化网页 JSON，再交给前端渲染。
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="rounded-3xl bg-slate-950 px-6 py-10 text-center text-white shadow-sm sm:px-10 sm:py-14">
          <div className="mx-auto max-w-3xl space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">现在就生成你的第一个网页</h2>
            <p className="text-sm leading-7 text-white/80 sm:text-base">
              先把真实 AI 生成链路跑通，再逐步补齐编辑、发布和分享能力。
            </p>
            <Link
              href="/generate"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
            >
              免费开始
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
