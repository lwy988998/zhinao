import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  /** Background preset from DesignTokens.sectionBg */
  bg?: string;
  /** Spacing tier */
  spacing?: "compact" | "normal" | "airy";
  className?: string;
  /** Add a subtle top divider */
  divider?: boolean;
};

const spacingMap: Record<string, string> = {
  compact: "py-10 sm:py-12",
  normal: "py-14 sm:py-18",
  airy: "py-20 sm:py-24",
};

export function SectionShell({
  children,
  bg = "",
  spacing = "normal",
  className = "",
  divider = false,
}: SectionShellProps) {
  const pad = spacingMap[spacing] ?? spacingMap.normal;

  return (
    <section
      className={`${pad} ${bg} ${divider ? "border-t border-slate-100" : ""} ${className}`.trim()}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}
