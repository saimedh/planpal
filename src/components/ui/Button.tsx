"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 min-h-[44px] touch-manipulation cursor-pointer select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "px-3.5 py-1.5 text-xs gap-1.5",
      md: "px-5 py-2.5 text-xs sm:text-sm gap-2",
      lg: "px-7 py-3.5 text-sm sm:text-base gap-2.5 font-bold",
    };

    const variantStyles = {
      primary:
        "bg-[#C2185B] text-white hover:bg-[#A3134C] shadow-xs hover:shadow focus-visible:ring-[#C2185B]",
      secondary:
        "bg-[#F3EEFF] text-[#1C1530] hover:bg-[#E4DEF2] dark:bg-[#2A213D] dark:text-[#FBF9FF] dark:hover:bg-[#493D5C]",
      accent:
        "bg-[#F2A900] text-[#1C1530] font-bold hover:bg-[#C78700] shadow-xs focus-visible:ring-[#F2A900]",
      outline:
        "border border-[#E4DEF2] bg-white text-[#1C1530] hover:bg-[#FBF9FF] dark:bg-[#2A213D] dark:border-[#493D5C] dark:text-[#FBF9FF] dark:hover:bg-[#1C1530]",
      ghost:
        "bg-transparent text-[#1C1530] hover:bg-[#F3EEFF] dark:text-[#FBF9FF] dark:hover:bg-[#2A213D]",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          (disabled || isLoading) && "opacity-60 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
