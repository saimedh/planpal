"use client";

import React, { useState } from "react";
import { Check, Calendar, User, Bell, BellOff, List, CalendarDays, Clock, Plus } from "lucide-react";
import { TimelineTask } from "@/lib/schemas/plan";
import { CalendarView } from "./CalendarView";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface TimelineTabProps {
  timeline: TimelineTask[];
  onUpdateTimeline: (updatedTimeline: TimelineTask[]) => void;
  eventDate?: string;
}

export function TimelineTab({
  timeline,
  onUpdateTimeline,
  eventDate,
}: TimelineTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const toggleTaskDone = (index: number) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], done: !updated[index].done };
    onUpdateTimeline(updated);
  };

  const toggleReminder = (index: number) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], reminder: !updated[index].reminder };
    onUpdateTimeline(updated);
  };

  const completedCount = timeline.filter((t) => t.done).length;
  const progressPercent = timeline.length > 0 ? Math.round((completedCount / timeline.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header with Switcher and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B]">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
            Backward-Planned Schedule
          </h3>
          <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4] mt-0.5">
            {completedCount} of {timeline.length} tasks completed ({progressPercent}%)
            {eventDate && ` • Targeting celebration on ${formatDate(eventDate)}`}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3EEFF] dark:bg-[#110D1E] border border-[#E6DEFA] dark:border-[#2E234B]">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
              viewMode === "list"
                ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#2B1F44] dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px] ${
              viewMode === "calendar"
                ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#2B1F44] dark:text-white"
                : "text-gray-500 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {viewMode === "calendar" ? (
        <CalendarView tasks={timeline} onToggleTask={toggleTaskDone} />
      ) : (
        /* Task List View */
        <div className="space-y-2.5">
          {timeline.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400 bg-white dark:bg-[#1B142F] rounded-2xl border border-[#E6DEFA] dark:border-[#2E234B]">
              No tasks scheduled yet. Tell PlanPal your celebration date to backward-plan all tasks!
            </div>
          ) : (
            timeline.map((task, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 ${
                  task.done
                    ? "bg-[#FBF9FF] dark:bg-[#110D1E]/60 border-[#E6DEFA] dark:border-[#2E234B] opacity-75"
                    : "bg-white dark:bg-[#1B142F] border-[#E6DEFA] dark:border-[#2E234B] hover:border-[#C2185B]/40 shadow-2xs"
                }`}
              >
                {/* Left: Checkbox + Title */}
                <div className="flex items-center gap-3 flex-1 min-w-0 pr-4">
                  <button
                    onClick={() => toggleTaskDone(idx)}
                    aria-label={task.done ? "Mark task incomplete" : "Mark task done"}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                      task.done
                        ? "bg-[#C2185B] border-[#C2185B] text-white"
                        : "border-gray-300 dark:border-gray-600 hover:border-[#C2185B]"
                    }`}
                  >
                    {task.done && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium truncate ${
                        task.done
                          ? "line-through text-gray-400 dark:text-gray-500"
                          : "text-[#1C1530] dark:text-[#FBF9FF]"
                      }`}
                    >
                      {task.task}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 flex-wrap">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#C2185B]" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#F2A900]" />
                          {task.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Reminder Toggle */}
                <button
                  onClick={() => toggleReminder(idx)}
                  title={task.reminder ? "Reminder enabled" : "Enable reminder"}
                  className={`p-2 rounded-lg transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                    task.reminder
                      ? "text-[#F2A900] bg-[#FFF8E6] dark:bg-[#775400]/30"
                      : "text-gray-300 hover:text-gray-500"
                  }`}
                >
                  {task.reminder ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
