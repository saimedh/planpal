"use client";

import React from "react";
import { Clock, Phone, User, CheckSquare } from "lucide-react";
import { RunSheetEntry } from "@/lib/schemas/plan";

interface RunSheetTabProps {
  runSheet: RunSheetEntry[];
}

export function RunSheetTab({ runSheet }: RunSheetTabProps) {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
            Day-of Event Run Sheet
          </h3>
          <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4] mt-0.5">
            Hour-by-hour operational schedule and vendor coordination plan.
          </p>
        </div>
      </div>

      {runSheet.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400 bg-white dark:bg-[#1B142F] rounded-2xl border border-[#E6DEFA] dark:border-[#2E234B]">
          No day-of schedule generated yet. Ask PlanPal to &quot;create an event day run sheet&quot;!
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E6DEFA] dark:before:bg-[#2E234B]">
          {runSheet.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline circle node */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 border-[#C2185B] bg-white dark:bg-[#1B142F] group-hover:bg-[#C2185B] transition-colors flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C2185B] group-hover:bg-white" />
              </div>

              {/* Event card */}
              <div className="p-4 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] space-y-2 hover:border-[#C2185B]/40 transition-colors shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#C2185B] dark:text-[#F48DB8] bg-[#FDE4EF] dark:bg-[#5C0B28]/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                    <h4 className="text-sm font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                      {item.activity}
                    </h4>
                  </div>

                  {item.vendor && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium text-[#1C1530] dark:text-[#FBF9FF]">
                        {item.vendor}
                      </span>
                      {item.contact && (
                        <span className="text-[11px] text-gray-400">({item.contact})</span>
                      )}
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4] pl-1 border-l-2 border-[#F2A900]">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
