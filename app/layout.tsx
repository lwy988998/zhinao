import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "智脑 - 一句话生成可发布网页",
  description: "不用代码，不用设计，输入一句话生成可发布和分享的网页",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
