import type { ReactNode } from "react";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
};

export function SectionShell({ children, className = "" }: SectionShellProps) {
  return (
    <section className={`px-4 py-12 sm:py-16 ${className}`.trim()}>
      <div className="mx-auto w-full max-w-5xl">{children}</div>
    </section>
  );
}
