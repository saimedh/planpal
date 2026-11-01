import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "magenta" | "marigold" | "plum";
}

export function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200",
    danger: "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200",
    info: "bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200",
    magenta: "bg-[#FDF2F7] text-[#C2185B] dark:bg-[#360418]/60 dark:text-[#F66DA5] border border-[#F9C5DC] dark:border-[#7E0D3A]",
    marigold: "bg-[#FFF9E6] text-[#C78700] dark:bg-[#452A00]/50 dark:text-[#FCD563] border border-[#FFF0BF] dark:border-[#704700]",
    plum: "bg-[#F3EEFF] text-[#1C1530] dark:bg-[#493D5C] dark:text-[#FBF9FF] border border-[#E4DEF2] dark:border-[#62596F]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
