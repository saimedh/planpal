"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface QuickReplyChipsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const DEFAULT_CHIPS = [
  "Make it cheaper (budget cut)",
  "Make the menu 100% vegetarian",
  "Add a memorable surprise element",
  "Add a live Chaat & Mocktail counter",
  "Reshuffle timeline & vendor checklist",
  "Write WhatsApp invite in Telugu & Hindi",
];

export function QuickReplyChips({ onSelect, disabled }: QuickReplyChipsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
      <div className="flex items-center gap-1 text-[11px] font-semibold text-[#C2185B] dark:text-[#F48DB8] shrink-0 pl-1">
        <Sparkles className="w-3 h-3" />
        <span>Suggestions:</span>
      </div>
      {DEFAULT_CHIPS.map((chip, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(chip)}
          className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] text-[#4A3E68] dark:text-[#C9C1D4] hover:border-[#C2185B] hover:text-[#C2185B] dark:hover:text-[#F48DB8] transition-all cursor-pointer whitespace-nowrap shadow-2xs disabled:opacity-50 disabled:pointer-events-none active:scale-95"
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
