type InputProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "textarea";
  rows?: number;
  error?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
};

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  rows = 4,
  error,
  required = false,
  maxLength,
  className = "",
}: InputProps) {
  const inputClasses = `w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-100 ${error ? "border-red-300" : "border-slate-200"}`;

  return (
    <label className={`block space-y-2 ${className}`.trim()}>
      {label ? (
        <span className="block text-sm font-medium text-slate-800">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </span>
      ) : null}
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          maxLength={maxLength}
          className={`${inputClasses} min-h-32 resize-y`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={inputClasses}
        />
      )}
      <span className="flex justify-between gap-3 text-xs">
        {error ? <span className="text-red-600">{error}</span> : <span />}
        {maxLength ? <span className="text-slate-400">{value.length}/{maxLength}</span> : null}
      </span>
    </label>
  );
}
