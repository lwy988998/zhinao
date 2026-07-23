"use client";

import type { ContactActionType, ContactSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";
import { copyText, handlePhone, handleEmail, scrollToContact } from "@/lib/actionUtils";

type Props = {
  section: ContactSection;
  theme: ThemeClasses;
};

function getContactLabel(type: ContactActionType) {
  switch (type) {
    case "wechat": return "微信";
    case "phone": return "电话";
    case "email": return "邮箱";
    case "link": return "链接";
    case "form": return "表单";
    default: return "联系";
  }
}

function getContactIcon(type: ContactActionType) {
  switch (type) {
    case "wechat": return "💬";
    case "phone": return "📞";
    case "email": return "✉️";
    case "link": return "🔗";
    case "form": return "📋";
    default: return "📍";
  }
}

type ContactItem = { label: string; value: string; icon: string; type?: string };

function ContactCard({ item, theme }: { item: ContactItem; theme: ThemeClasses }) {
  const handleClick = () => {
    if (item.label === "电话") {
      handlePhone(item.value);
    } else if (item.label === "邮箱") {
      handleEmail(item.value);
    } else {
      copyText(item.value, item.label);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex w-full items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 active:scale-[0.98] cursor-pointer"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-lg transition-colors group-hover:bg-slate-200">
        {item.icon}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-medium ${theme.text}`}>{item.label}</p>
        <p className="mt-1 text-base font-semibold text-slate-900 truncate">{item.value}</p>
        <p className="mt-0.5 text-xs text-slate-400">点击{item.label === "电话" ? "复制并拨号" : item.label === "邮箱" ? "复制并发送邮件" : "复制"}</p>
      </div>
    </button>
  );
}

export function ContactSectionView({ section, theme }: Props) {
  const action = section.contactAction;
  const contacts: ContactItem[] = [
    section.wechat ? { label: "微信", value: section.wechat, icon: "💬" } : null,
    section.phone ? { label: "电话", value: section.phone, icon: "📞" } : null,
    section.email ? { label: "邮箱", value: section.email, icon: "✉️" } : null,
    section.address ? { label: "地址", value: section.address, icon: "📍" } : null,
  ].filter((item): item is ContactItem => item !== null);

  const handleMainAction = () => {
    if (action?.value) {
      if (action.type === "email") {
        handleEmail(action.value);
      } else if (action.type === "phone") {
        handlePhone(action.value);
      } else {
        copyText(action.value, action.type === "wechat" ? "微信号" : action.label);
      }
    } else {
      scrollToContact();
    }
  };

  return (
    <SectionShell bg="bg-slate-50">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10 space-y-3 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {section.title}
          </h2>
          {section.description ? (
            <p className="text-base leading-relaxed text-slate-500">{section.description}</p>
          ) : null}
        </div>

        {/* Contact cards */}
        {contacts.length > 0 ? (
          <div className="mb-8 grid gap-4 sm:grid-cols-2">
            {contacts.map((item) => (
              <ContactCard key={item.label} item={item} theme={theme} />
            ))}
          </div>
        ) : null}

        {/* Main contact action */}
        {action ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6 text-center shadow-sm">
            <div className="mb-3 flex justify-center">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${theme.softBg} text-xl`}>
                {getContactIcon(action.type)}
              </div>
            </div>
            <p className={`text-sm font-medium ${theme.text}`}>{getContactLabel(action.type)}</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{action.label}</p>
            <p className="mt-1 text-sm text-slate-500">{action.value}</p>
            <button
              type="button"
              onClick={handleMainAction}
              className={`mt-5 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-white transition-all active:scale-[0.97] cursor-pointer ${theme.bg} ${theme.buttonHover} shadow-sm`}
            >
              {action.label}
            </button>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
