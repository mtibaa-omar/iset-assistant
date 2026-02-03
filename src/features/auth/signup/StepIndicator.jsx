import { Check } from "lucide-react";

export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-4 md:mb-6">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`
                w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-all duration-300
                ${
                  isCompleted
                    ? "bg-purple-600 text-white"
                    : isCurrent
                      ? "bg-purple-600 text-white ring-2 md:ring-4 ring-purple-200 dark:ring-purple-900"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                }
              `}
            >
              {isCompleted ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-6 md:w-8 h-0.5 md:h-1 mx-0.5 md:mx-1 rounded transition-all duration-300 ${
                  isCompleted
                    ? "bg-purple-600"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
