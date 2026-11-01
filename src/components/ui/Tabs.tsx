"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "pills" | "underline";
}

export function Tabs({ tabs, activeTab, onChange, className, variant = "pills" }: TabsProps) {
  if (variant === "underline") {
    return (
      <div className={cn("flex border-b border-[#E6DEFA] dark:border-[#2E234B] space-x-6 overflow-x-auto no-scrollbar", className)} role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={cn(
                "flex items-center gap-2 py-3 px-1 text-sm font-medium border-b-2 transition-all min-h-[44px] whitespace-nowrap",
                isActive
                  ? "border-[#C2185B] text-[#C2185B] font-semibold dark:border-[#E03D80] dark:text-[#E03D80]"
                  : "border-transparent text-gray-500 hover:text-[#1C1530] hover:border-gray-300 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 rounded-full bg-[#F3EEFF] dark:bg-[#2B1F44] px-2 py-0.5 text-xs text-[#C2185B] font-semibold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex p-1 rounded-xl bg-[#F3EEFF] dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-x-1 overflow-x-auto no-scrollbar",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-150 min-h-[40px] whitespace-nowrap flex-1",
              isActive
                ? "bg-white text-[#C2185B] shadow-xs font-semibold dark:bg-[#2B1F44] dark:text-white"
                : "text-[#4A3E68] hover:text-[#1C1530] dark:text-gray-400 dark:hover:text-white"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="rounded-full bg-[#FDE4EF] dark:bg-[#5C0B28] px-1.5 py-0.2 text-[10px] text-[#C2185B] dark:text-[#F48DB8] font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
