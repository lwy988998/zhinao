"use client";

import { useState } from "react";
import type { PricingSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { scrollToContact } from "@/lib/actionUtils";

type Props = {
  section: PricingSection;
  theme: ThemeClasses;
};

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

function PlanDetailModal({
  plan,
  onClose,
  theme,
}: {
  plan: Plan;
  onClose: () => void;
  theme: ThemeClasses;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 pb-4 pt-16 backdrop-blur-sm sm:items-center sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{plan.name}</h3>
            <p className="mt-1 text-3xl font-bold text-slate-900">{plan.price}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>

        <div className="mt-5 space-y-2.5">
          <p className="text-sm font-semibold text-slate-900">包含权益</p>
          {plan.features.map((f) => (
            <div key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => { scrollToContact(); onClose(); }}
            className={`inline-flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white transition-all active:scale-[0.97] ${theme.bg} ${theme.buttonHover}`}
          >
            咨询此方案
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-600 transition-all active:scale-[0.97] hover:bg-slate-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  plan,
  isFeatured,
  theme,
}: {
  plan: Plan;
  isFeatured: boolean;
  theme: ThemeClasses;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <article
        className={`relative rounded-2xl border p-6 ${
          isFeatured
            ? `border-slate-300 bg-white shadow-xl ${theme.ring} scale-[1.02]`
            : "border-slate-200/60 bg-white shadow-sm"
        }`}
      >
        {isFeatured ? (
          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-xs font-semibold text-white ${theme.bg}`}>
            推荐
          </span>
        ) : null}

        <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${isFeatured ? theme.text : "text-slate-900"}`}>
            {plan.price}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500">{plan.description}</p>

        <ul className="mt-5 space-y-2.5">
          {plan.features.slice(0, isFeatured ? plan.features.length : 4).map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
              <svg className={`mt-0.5 h-4 w-4 shrink-0 ${isFeatured ? theme.text : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
          {!isFeatured && plan.features.length > 4 ? (
            <li className="text-xs text-slate-400 pl-6">+{plan.features.length - 4} 项更多权益</li>
          ) : null}
        </ul>

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 transition-all active:scale-[0.97] hover:border-slate-400 hover:bg-slate-50 cursor-pointer"
          >
            了解详情
          </button>
          {isFeatured ? (
            <button
              type="button"
              onClick={scrollToContact}
              className={`inline-flex h-11 flex-1 items-center justify-center rounded-full text-sm font-medium text-white transition-all active:scale-[0.97] cursor-pointer ${theme.bg} ${theme.buttonHover}`}
            >
              立即选择
            </button>
          ) : null}
        </div>
      </article>

      {modalOpen ? <PlanDetailModal plan={plan} onClose={() => setModalOpen(false)} theme={theme} /> : null}
    </>
  );
}

export function PricingSectionView({ section, theme }: Props) {
  const plans = section.items?.length ? section.items : section.plans ?? [];
  const layout = section.layout ?? "cards";
  const featuredIdx = section.featuredPlanIndex;
  const normalisedFeatured =
    typeof featuredIdx === "number" && featuredIdx >= 0 && featuredIdx < plans.length
      ? featuredIdx
      : plans.findIndex((p) => p.highlighted);

  return (
    <SectionShell bg="bg-white">
      {/* Header */}
      <div className="mb-10 space-y-3 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          {section.title}
        </h2>
        {section.description ? (
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-500">
            {section.description}
          </p>
        ) : null}
      </div>

      {/* ── Cards layout ── */}
      {layout === "cards" && (
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => {
            const isFeatured = normalisedFeatured === i;
            return (
              <PricingCard key={plan.name} plan={plan} isFeatured={isFeatured} theme={theme} />
            );
          })}
        </div>
      )}

      {/* ── Table layout (horizontal comparison) ── */}
      {layout === "table" && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50">
                <th className="px-5 py-4 font-semibold text-slate-900">方案</th>
                <th className="px-5 py-4 font-semibold text-slate-900">价格</th>
                <th className="px-5 py-4 font-semibold text-slate-900">说明</th>
                <th className="px-5 py-4 font-semibold text-slate-900">功能亮点</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, i) => {
                const isFeatured = normalisedFeatured === i;
                return (
                  <tr
                    key={plan.name}
                    className={`border-b border-slate-100 last:border-0 ${
                      isFeatured ? `${theme.softBg}` : "bg-white"
                    }`}
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900">{plan.name}</span>
                      {isFeatured ? (
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium text-white ${theme.bg}`}>
                          推荐
                        </span>
                      ) : null}
                    </td>
                    <td className={`px-5 py-4 font-bold ${isFeatured ? theme.text : "text-slate-900"}`}>
                      {plan.price}
                    </td>
                    <td className="px-5 py-4 text-slate-500">{plan.description}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {plan.features.slice(0, 3).join(" · ")}
                      {plan.features.length > 3 ? " …" : ""}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={scrollToContact}
                        className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-xs font-medium text-white transition active:scale-95 cursor-pointer ${theme.bg} ${theme.buttonHover}`}
                      >
                        {isFeatured ? "立即选择" : "咨询"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
