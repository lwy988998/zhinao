"use client";

import type { CTASection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { InteractiveModal } from "@/components/interactive/InteractiveModal";

type Props = {
  section: CTASection;
  theme: ThemeClasses;
};

/**
 * Scroll to the #section-contact or #section-cta target when a CTA button
 * is clicked on a public/rendered page.
 */
function scrollToAction() {
  const contactEl =
    document.getElementById("section-contact") ??
    document.getElementById("section-cta") ??
    document.querySelector("footer");
  if (contactEl) {
    contactEl.scrollIntoView({ behavior: "smooth" });
  }
}

export function CTASectionView({ section, theme }: Props) {
  const layout = section.layout ?? "banner";
  const interactionType = section.interactionType ?? "none";

  // ── Shared CTA button ──
  const renderButton = (variant: "light" | "dark" | "accent" = "accent") => {
    const className =
      variant === "light"
        ? "inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-semibold text-slate-950 transition-all active:scale-[0.97] hover:bg-slate-100 cursor-pointer"
        : variant === "dark"
        ? "inline-flex h-12 items-center justify-center rounded-full bg-slate-950 px-8 text-sm font-semibold text-white transition-all active:scale-[0.97] hover:bg-slate-800 cursor-pointer"
        : `inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white transition-all active:scale-[0.97] ${theme.bg} ${theme.buttonHover} shadow-sm hover:shadow-md cursor-pointer`;

    if (interactionType === "modal" && section.modalTitle) {
      return (
        <InteractiveModal
          triggerLabel={section.buttonText}
          title={section.modalTitle}
          description={section.modalDescription}
          highlights={section.modalHighlights}
          items={section.modalItems}
          actionLabel={section.modalActionLabel}
          actionValue={section.modalActionValue}
          triggerClassName={className}
        />
      );
    }

    return (
      <button type="button" onClick={scrollToAction} className={className}>
        {section.buttonText}
      </button>
    );
  };

  // ── Dark layout ──
  if (layout === "dark") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="flex flex-col items-center text-center py-6 sm:py-12">
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{section.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/60">{section.description}</p>
          <div className="mt-6">{renderButton("light")}</div>
        </div>
      </SectionShell>
    );
  }

  // ── Minimal layout ──
  if (layout === "minimal") {
    return (
      <SectionShell bg="bg-transparent">
        <div className="flex flex-col items-center text-center py-6 sm:py-12">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{section.title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">{section.description}</p>
          <div className="mt-6">{renderButton("dark")}</div>
        </div>
      </SectionShell>
    );
  }

  // ── Banner layout ──
  if (layout === "banner" || !layout) {
    return (
      <SectionShell bg={theme.bg} className="text-white">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{section.title}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{section.description}</p>
          <div className="mt-6">{renderButton("light")}</div>
        </div>
      </SectionShell>
    );
  }

  // ── Panel layout ──
  return (
    <SectionShell bg="bg-white">
      <div className={`rounded-2xl border p-8 text-center sm:p-10 ${theme.border} bg-gradient-to-br ${theme.gradient}`}>
        <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
        <p className="mt-4 mx-auto max-w-xl text-base leading-relaxed text-slate-500">{section.description}</p>
        <div className="mt-6">{renderButton("dark")}</div>
      </div>
    </SectionShell>
  );
}
