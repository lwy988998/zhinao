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

export function ContactSectionView({ section, theme }: Props) {
  const action = section.contactAction;
  const contacts = [
    section.wechat ? { label: "微信", value: section.wechat } : null,
    section.phone ? { label: "电话", value: section.phone } : null,
    section.email ? { label: "邮箱", value: section.email } : null,
    section.address ? { label: "地址", value: section.address } : null,
  ].filter((item): item is { label: string; value: string } => item !== null);

  return (
    <SectionShell>
      <div className={`rounded-3xl border p-6 sm:p-8 ${theme.border} ${theme.softBg}`.trim()}>
        <div className="space-y-5 text-center sm:text-left">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{section.title}</h2>
            {section.description ? <p className="text-base leading-7 text-slate-600">{section.description}</p> : null}
          </div>
          {action ? (
            <div className="rounded-2xl border border-white/70 bg-white p-5 text-left shadow-sm">
              <p className={`text-sm font-medium ${theme.text}`.trim()}>{getContactLabel(action.type)}</p>
              <p className="mt-1 text-base font-semibold text-slate-950">{action.label}</p>
              <p className="mt-1 text-sm text-slate-600">{action.value}</p>
            </div>
          ) : null}
          {contacts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white p-5 text-left shadow-sm">
                  <p className={`text-sm font-medium ${theme.text}`.trim()}>{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-slate-950">{item.value}</p>
                </div>
              ))}
            </div>
          ) : null}
          {section.qrcode ? (
            <div className="rounded-2xl border border-white/70 bg-white p-5 text-left shadow-sm">
              <p className={`text-sm font-medium ${theme.text}`.trim()}>二维码</p>
              <p className="mt-1 break-all text-sm text-slate-600">{section.qrcode}</p>
            </div>
          ) : null}
          {action ? (
            <button
              type="button"
              className={`inline-flex h-12 items-center justify-center rounded-full px-6 text-sm font-medium transition ${theme.button} ${theme.buttonHover}`.trim()}
            >
              {action.label}
            </button>
          ) : null}
        </div>
      </div>
    </SectionShell>
  );
}
