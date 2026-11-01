"use client";

import React from "react";
import { Sparkles, Palette, Utensils, Gift, Dices, Flower } from "lucide-react";
import { Ideas } from "@/lib/schemas/plan";
import { MenuSection } from "./MenuSection";
import { InvitationCard } from "./InvitationCard";

interface IdeasTabProps {
  ideas: Ideas;
}

export function IdeasTab({ ideas }: IdeasTabProps) {
  return (
    <div className="space-y-6">
      {/* Surprise Element Card (Special Feature) */}
      {ideas.surprise && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-[#FDF2F7] via-[#FFF9E6] to-[#F3EEFF] dark:from-[#360418]/40 dark:to-[#452A00]/30 border border-[#F9C5DC] dark:border-[#7E0D3A] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C2185B] dark:text-[#F66DA5] mb-1.5">
            <Gift className="w-4 h-4 text-[#F2A900]" />
            <span>Memorable Surprise Element</span>
          </div>
          <p className="text-sm font-medium text-[#1C1530] dark:text-[#FBF9FF] leading-relaxed">
            {ideas.surprise}
          </p>
        </div>
      )}

      {/* Theme & Decor Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Themes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-3">
          <h4 className="font-heading font-semibold text-sm text-[#1C1530] dark:text-[#FBF9FF] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#C2185B]" />
            <span>Theme & Aesthetics</span>
          </h4>
          {ideas.themes && ideas.themes.length > 0 ? (
            <ul className="space-y-2">
              {ideas.themes.map((t, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#110D1E] text-xs text-[#1C1530] dark:text-[#FBF9FF] border border-[#E6DEFA] dark:border-[#2E234B]"
                >
                  {t}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">Ask PlanPal for festive theme concepts!</p>
          )}
        </div>

        {/* Decor */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-3">
          <h4 className="font-heading font-semibold text-sm text-[#1C1530] dark:text-[#FBF9FF] flex items-center gap-2">
            <Flower className="w-4 h-4 text-[#F2A900]" />
            <span>Floral & Decor Concepts</span>
          </h4>
          {ideas.decor && ideas.decor.length > 0 ? (
            <ul className="space-y-2">
              {ideas.decor.map((d, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#110D1E] text-xs text-[#1C1530] dark:text-[#FBF9FF] border border-[#E6DEFA] dark:border-[#2E234B]"
                >
                  {d}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">Ask PlanPal for Indian floral/light decor ideas!</p>
          )}
        </div>
      </div>

      {/* Menu & Catering */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF] flex items-center gap-2">
            <Utensils className="w-4 h-4 text-[#C2185B]" />
            <span>Curated Celebration Menu</span>
          </h3>
          <span className="text-[11px] text-gray-400">Filtered by dietary preference</span>
        </div>
        <MenuSection menu={ideas.menu || []} />
      </div>

      {/* Games & Activities */}
      {ideas.games && ideas.games.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-3">
          <h4 className="font-heading font-semibold text-sm text-[#1C1530] dark:text-[#FBF9FF] flex items-center gap-2">
            <Dices className="w-4 h-4 text-[#F2A900]" />
            <span>Games & Interactive Activities</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {ideas.games.map((game, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#FFF8E6]/60 dark:bg-[#775400]/20 border border-[#FEECB3] dark:border-[#A07000]/30 text-xs text-[#1C1530] dark:text-[#FBF9FF] font-medium"
              >
                {game}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multilingual Invitation Card */}
      <InvitationCard invitationText={ideas.invitationText || { en: "", hi: "", te: "" }} />
    </div>
  );
}
