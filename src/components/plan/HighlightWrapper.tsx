"use client";

import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightWrapperProps {
  children: React.ReactNode;
  isUpdated?: boolean;
  className?: string;
}

export function HighlightWrapper({
  children,
  isUpdated = false,
  className,
}: HighlightWrapperProps) {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (isUpdated) {
      setHighlight(true);
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isUpdated]);

  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-300",
        highlight && "item-updated-highlight ring-2 ring-[#F2A900] ring-offset-2",
        className
      )}
    >
      {highlight && (
        <div className="absolute -top-2.5 -right-2 z-10 flex items-center gap-1 rounded-full bg-[#F2A900] px-2.5 py-0.5 text-[10px] font-bold text-[#1C1530] shadow-sm animate-bounce">
          <Sparkles className="w-2.5 h-2.5" />
          <span>Updated</span>
        </div>
      )}
      {children}
    </div>
  );
}
