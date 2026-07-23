import type { ContactActionType, ContactSection } from "@/types/page";
import type { ThemeClasses } from "@/lib/theme";
import { SectionShell } from "./SectionShell";

type Props = {
  section: ContactSection;
  theme: ThemeClasses;
};

function getContactLabel(type: ContactActionType) {
  switch (type) {
    case "wechat":
      return "微信";
    case "phone":
      return "电话";
    case "email":
      return "邮箱";
    case "link":
      return "链接";
    case "form":
      return "表单";
    default:
      return "联系";
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

export function ContactSectionView({ section, theme }: Props) {
  const action = section.contactAction;
  const contacts = [
    section.wechat ? { label: "微信", value: section.wechat, icon: "💬" } : null,
    section.phone ? { label: "电话", value: section.phone, icon: "📞" } : null,
    section.email ? { label: "邮箱", value: section.email, icon: "✉️" } : null,
    section.address ? { label: "地址", value: section.address, icon: "📍" } : null,
  ].filter((item): item is { label: string; value: string; icon: string } => item !== null);

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
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">
                  {item.icon}
                </div>
                <div>
                  <p className={`text-sm font-medium ${theme.text}`}>{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{item.value}</p>
                </div>
              </div>
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
              className={`mt-5 inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-all active:scale-[0.97] ${theme.button} ${theme.buttonHover} shadow-sm`}
            >
              {action.label}
            </button>
          </div>
        ) : null}
      </div>
    </SectionShell>
  );
}
