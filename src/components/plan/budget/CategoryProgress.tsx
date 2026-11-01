import React from "react";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface CategoryProgressProps {
  category: string;
  planned: number;
  actual: number;
  description?: string;
}

export function CategoryProgress({
  category,
  planned,
  actual,
  description,
}: CategoryProgressProps) {
  const percentage = planned > 0 ? Math.round((actual / planned) * 100) : 0;
  const isOverspent = actual > planned;

  return (
    <div className="p-3.5 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] space-y-2 hover:border-[#C2185B]/40 transition-colors">
      <div className="flex items-center justify-between text-xs">
        <div className="font-semibold text-[#1C1530] dark:text-[#FBF9FF] flex items-center gap-1.5">
          <span>{category}</span>
          {isOverspent && (
            <span className="flex items-center gap-0.5 text-[10px] text-rose-600 dark:text-rose-400 font-bold">
              <AlertTriangle className="w-3 h-3" />
              Overspent by {formatCurrency(actual - planned)}
            </span>
          )}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          <span className="font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            {formatCurrency(actual)}
          </span>{" "}
          / {formatCurrency(planned)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#F3EEFF] dark:bg-gray-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOverspent
              ? "bg-rose-500"
              : percentage > 85
              ? "bg-[#F2A900]"
              : "bg-[#C2185B]"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {description && (
        <p className="text-[11px] text-[#4A3E68] dark:text-[#C9C1D4] italic">
          {description}
        </p>
      )}
    </div>
  );
}
