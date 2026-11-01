"use client";

import React, { useState } from "react";
import { Tabs, TabItem } from "@/components/ui/Tabs";
import { PlanHeader } from "./PlanHeader";
import { HighlightWrapper } from "./HighlightWrapper";
import { BudgetTab } from "./budget/BudgetTab";
import { TimelineTab } from "./timeline/TimelineTab";
import { VendorsTab } from "./vendors/VendorsTab";
import { IdeasTab } from "./ideas/IdeasTab";
import { RunSheetTab } from "./runsheet/RunSheetTab";
import { Plan, TimelineTask, Vendor } from "@/lib/schemas/plan";
import { IndianRupee, Calendar, Users, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PlanPanelProps {
  eventId: string;
  plan: Plan;
  shareToken?: string;
  changes?: string[];
  isUpdating?: boolean;
  onPlanChange: (updatedPlan: Plan) => void;
}

export function PlanPanel({
  eventId,
  plan,
  shareToken,
  changes = [],
  isUpdating = false,
  onPlanChange,
}: PlanPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("budget");

  const tabs: TabItem[] = [
    {
      id: "budget",
      label: "Budget",
      icon: <IndianRupee className="w-4 h-4" />,
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: <Calendar className="w-4 h-4" />,
      badge: plan.timeline.length || undefined,
    },
    {
      id: "vendors",
      label: "Vendors",
      icon: <Users className="w-4 h-4" />,
      badge: plan.vendors.length || undefined,
    },
    {
      id: "ideas",
      label: "Ideas & Menu",
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "runsheet",
      label: "Run Sheet",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  const handleUpdateTimeline = (updatedTimeline: TimelineTask[]) => {
    onPlanChange({ ...plan, timeline: updatedTimeline });
  };

  const handleUpdateVendors = (updatedVendors: Vendor[]) => {
    onPlanChange({ ...plan, vendors: updatedVendors });
  };

  const isBudgetChanged = changes.some((c) => c.toLowerCase().includes("budget"));
  const isTimelineChanged = changes.some((c) => c.toLowerCase().includes("timeline"));
  const isVendorsChanged = changes.some((c) => c.toLowerCase().includes("vendor"));
  const isIdeasChanged = changes.some((c) => c.toLowerCase().includes("idea") || c.toLowerCase().includes("menu"));
  const isRunSheetChanged = changes.some((c) => c.toLowerCase().includes("run") || c.toLowerCase().includes("sheet"));

  return (
    <div id="plan-content-area" className="flex flex-col h-full bg-[#FFFDF9] dark:bg-[#1C120C] overflow-hidden">
      {/* Top Header */}
      <PlanHeader plan={plan} shareToken={shareToken} isUpdating={isUpdating} />

      {/* Tabs navigation */}
      <div className="px-6 pt-4 pb-2 bg-white dark:bg-[#241710] border-b border-[#F2DFBC] dark:border-[#4D3220]">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Main Tab Content with Framer Motion transitions */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {activeTab === "budget" && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HighlightWrapper isUpdated={isBudgetChanged}>
                <BudgetTab
                  eventId={eventId}
                  budget={plan.budget}
                  budgetSplit={plan.budgetSplit}
                />
              </HighlightWrapper>
            </motion.div>
          )}

          {activeTab === "timeline" && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HighlightWrapper isUpdated={isTimelineChanged}>
                <TimelineTab
                  timeline={plan.timeline}
                  onUpdateTimeline={handleUpdateTimeline}
                  eventDate={plan.date}
                />
              </HighlightWrapper>
            </motion.div>
          )}

          {activeTab === "vendors" && (
            <motion.div
              key="vendors"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HighlightWrapper isUpdated={isVendorsChanged}>
                <VendorsTab
                  vendors={plan.vendors}
                  eventTitle={plan.title}
                  eventDate={plan.date}
                  city={plan.city}
                  onUpdateVendors={handleUpdateVendors}
                />
              </HighlightWrapper>
            </motion.div>
          )}

          {activeTab === "ideas" && (
            <motion.div
              key="ideas"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HighlightWrapper isUpdated={isIdeasChanged}>
                <IdeasTab ideas={plan.ideas} />
              </HighlightWrapper>
            </motion.div>
          )}

          {activeTab === "runsheet" && (
            <motion.div
              key="runsheet"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <HighlightWrapper isUpdated={isRunSheetChanged}>
                <RunSheetTab runSheet={plan.runSheet} />
              </HighlightWrapper>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
