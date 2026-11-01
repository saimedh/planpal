"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftAddon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E68] dark:text-[#C9C1D4]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <div className="absolute left-3.5 pointer-events-none text-gray-500 flex items-center">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border border-[#E6DEFA] bg-white px-3.5 py-2.5 text-sm text-[#1C1530] placeholder:text-gray-400 transition-colors focus:border-[#C2185B] focus:outline-none focus:ring-1 focus:ring-[#C2185B] dark:border-[#2E234B] dark:bg-[#1B142F] dark:text-[#FBF9FF] dark:placeholder:text-gray-500 min-h-[44px]",
              leftAddon && "pl-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
