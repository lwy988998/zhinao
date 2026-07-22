type LoadingStepsProps = {
  steps: string[];
  currentStep: number;
  className?: string;
};

export function LoadingSteps({ steps, currentStep, className = "" }: LoadingStepsProps) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${className}`.trim()}>
      <ol className="space-y-3">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <li key={step} className="flex items-center gap-3 text-sm">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${isDone || isActive ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-400"}`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span className={isActive ? "font-medium text-slate-950" : isDone ? "text-slate-700" : "text-slate-400"}>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
