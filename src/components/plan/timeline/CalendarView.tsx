"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock } from "lucide-react";
import { TimelineTask } from "@/lib/schemas/plan";
import { formatDate } from "@/lib/utils";

interface CalendarViewProps {
  tasks: TimelineTask[];
  onToggleTask?: (taskIndex: number) => void;
}

export function CalendarView({ tasks, onToggleTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Map tasks by date YYYY-MM-DD
  const tasksByDate = tasks.reduce((acc, task, index) => {
    if (task.dueDate) {
      const d = task.dueDate.split("T")[0];
      if (!acc[d]) acc[d] = [];
      acc[d].push({ ...task, originalIndex: index });
    }
    return acc;
  }, {} as Record<string, (TimelineTask & { originalIndex: number })[]>);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-semibold text-sm text-[#1C1530] dark:text-[#FBF9FF]">
          {monthNames[month]} {year}
        </h4>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg border border-[#E6DEFA] dark:border-[#2E234B] hover:bg-[#F3EEFF] dark:hover:bg-[#2B1F44] text-gray-500 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg border border-[#E6DEFA] dark:border-[#2E234B] hover:bg-[#F3EEFF] dark:hover:bg-[#2B1F44] text-gray-500 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-gray-400">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {/* Empty slots for start of month */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16 rounded-xl bg-gray-50/50 dark:bg-gray-900/20" />
        ))}

        {/* Days */}
        {daysArray.map((day) => {
          const formattedDay = String(day).padStart(2, "0");
          const formattedMonth = String(month + 1).padStart(2, "0");
          const dateKey = `${year}-${formattedMonth}-${formattedDay}`;
          const dayTasks = tasksByDate[dateKey] || [];

          return (
            <div
              key={day}
              className={`min-h-[72px] p-1.5 rounded-xl border flex flex-col justify-between transition-colors ${
                dayTasks.length > 0
                  ? "border-[#C2185B]/30 bg-[#FDE4EF]/20 dark:bg-[#5C0B28]/20"
                  : "border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F]"
              }`}
            >
              <span className="text-xs font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                {day}
              </span>

              {dayTasks.length > 0 && (
                <div className="space-y-1 mt-1">
                  {dayTasks.slice(0, 2).map((t, idx) => (
                    <div
                      key={idx}
                      title={`${t.task} (${t.assignee || "Unassigned"})`}
                      onClick={() => onToggleTask?.(t.originalIndex)}
                      className={`text-[9px] px-1 py-0.5 rounded truncate cursor-pointer flex items-center gap-0.5 ${
                        t.done
                          ? "line-through bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-[#C2185B] text-white"
                      }`}
                    >
                      <span>{t.task}</span>
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[8px] text-gray-500 font-bold block text-right">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
