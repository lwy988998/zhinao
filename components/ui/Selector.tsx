type SelectorOption = {
  value: string;
  label: string;
  description?: string;
  color?: string;
};

type SelectorProps = {
  options: SelectorOption[];
  value: string;
  onChange: (value: string) => void;
  type?: "card" | "color";
  label?: string;
  className?: string;
};

export function Selector({ options, value, onChange, type = "card", label, className = "" }: SelectorProps) {
  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {label ? <p className="text-sm font-medium text-slate-800">{label}</p> : null}
      {type === "color" ? (
        <div className="flex flex-wrap gap-3">
          {options.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${active ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}
              >
                <span
                  className="h-3.5 w-3.5 rounded-full border border-white/60"
                  style={{ backgroundColor: option.color ?? "#64748b" }}
                />
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((option) => {
            const active = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                className={`rounded-2xl border p-4 text-left transition ${active ? "border-slate-900 bg-slate-50 ring-2 ring-slate-200" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{option.label}</p>
                    {option.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{option.description}</p> : null}
                  </div>
                  <span className={`mt-1 h-4 w-4 rounded-full border ${active ? "border-slate-950 bg-slate-950" : "border-slate-300 bg-white"}`} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
