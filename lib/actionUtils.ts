/**
 * Shared browser-action utilities for section components.
 * Only import in "use client" components.
 */

/** Smooth-scroll to a section by id, falls back to footer or first scrollable ancestor */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
    return true;
  }
  // Fallback: try footer
  const footer = document.querySelector("footer");
  if (footer) {
    footer.scrollIntoView({ behavior: "smooth" });
    return true;
  }
  return false;
}

/** Scroll to contact or CTA section (common CTA target) */
export function scrollToContact(): boolean {
  return (
    scrollToSection("section-contact") ||
    scrollToSection("section-cta")
  );
}

/** Copy text to clipboard and show a transient toast */
export function copyText(text: string, label?: string): boolean {
  try {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast(label ? `已复制: ${label}` : "已复制到剪贴板");
    return true;
  } catch {
    showToast("复制失败");
    return false;
  }
}

/** Check if a string looks like an external URL */
export function isExternalUrl(value: string): boolean {
  return /^(https?:|mailto:|tel:)/i.test(value);
}

/** Open a URL or trigger a phone/email action */
export function openLink(value: string): boolean {
  try {
    if (/^tel:/i.test(value)) {
      window.location.href = value;
      return true;
    }
    if (/^mailto:/i.test(value)) {
      window.location.href = value;
      return true;
    }
    if (/^https?:/i.test(value)) {
      window.open(value, "_blank", "noopener,noreferrer");
      return true;
    }
    // Plain text — copy it
    return copyText(value);
  } catch {
    return false;
  }
}

/** Attempt phone: copy + try tel: link */
export function handlePhone(value: string): void {
  const cleaned = value.replace(/[^\d+]/g, "");
  if (cleaned) {
    copyText(value, "电话");
    try { window.location.href = `tel:${cleaned}`; } catch { /* ignore */ }
  } else {
    copyText(value, "电话");
  }
}

/** Attempt email: copy + try mailto: */
export function handleEmail(value: string): void {
  copyText(value, "邮箱");
  try { window.location.href = `mailto:${value}`; } catch { /* ignore */ }
}

// ── Toast ──

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function showToast(message: string): void {
  if (typeof document === "undefined") return;

  // Remove existing toast
  const existing = document.getElementById("__section_toast");
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);

  const toast = document.createElement("div");
  toast.id = "__section_toast";
  toast.className =
    "fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-medium text-white shadow-lg animate-in fade-in slide-in-from-bottom-2";
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 200ms";
    setTimeout(() => toast.remove(), 200);
    toastTimer = null;
  }, 2000);
}
