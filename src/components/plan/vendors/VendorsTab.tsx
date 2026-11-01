"use client";

import React, { useState } from "react";
import { Vendor } from "@/lib/schemas/plan";
import { VendorCard } from "./VendorCard";
import { Users, Clock, CheckCircle2, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface VendorsTabProps {
  vendors: Vendor[];
  eventTitle?: string;
  eventDate?: string;
  city?: string;
  onUpdateVendors: (updatedVendors: Vendor[]) => void;
}

const COLUMNS = [
  { id: "to_contact", label: "To Contact", icon: Clock, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40" },
  { id: "quoted", label: "Quoted", icon: DollarSign, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  { id: "booked", label: "Booked", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
  { id: "paid", label: "Paid", icon: CheckCircle2, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40" },
];

export function VendorsTab({
  vendors,
  eventTitle,
  eventDate,
  city = "Hyderabad",
  onUpdateVendors,
}: VendorsTabProps) {
  const [activeMobileColumn, setActiveMobileColumn] = useState("to_contact");

  const handleUpdateVendor = (index: number, updated: Vendor) => {
    const list = [...vendors];
    list[index] = updated;
    onUpdateVendors(list);
  };

  const bookedCount = vendors.filter((v) => v.status === "booked" || v.status === "paid").length;

  return (
    <div className="space-y-6">
      {/* Top Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B]">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
            Vendor Tracker & Outreach
          </h3>
          <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4] mt-0.5">
            {vendors.length} vendors identified • {bookedCount} finalized/booked for {city}
          </p>
        </div>

        {/* Mobile column tabs */}
        <div className="flex lg:hidden overflow-x-auto gap-1 p-1 rounded-xl bg-[#F3EEFF] dark:bg-[#110D1E]">
          {COLUMNS.map((col) => {
            const count = vendors.filter((v) => v.status === col.id).length;
            const isActive = activeMobileColumn === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setActiveMobileColumn(col.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#2B1F44] dark:text-white"
                    : "text-gray-500"
                }`}
              >
                {col.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colVendors = vendors
            .map((v, originalIdx) => ({ vendor: v, originalIdx }))
            .filter((item) => item.vendor.status === col.id);

          return (
            <div
              key={col.id}
              className={`flex flex-col rounded-2xl bg-[#FBF9FF] dark:bg-[#110D1E] border border-[#E6DEFA] dark:border-[#2E234B] p-3 space-y-3 ${
                activeMobileColumn === col.id ? "block" : "hidden lg:flex"
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-2 py-1">
                <div className="flex items-center gap-2">
                  <span className={`p-1 rounded-md ${col.color}`}>
                    <col.icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-[#1B142F] text-gray-500 border border-[#E6DEFA] dark:border-[#2E234B]">
                  {colVendors.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colVendors.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-400 border border-dashed border-[#E6DEFA] dark:border-[#2E234B] rounded-xl">
                    No vendors in {col.label.toLowerCase()}
                  </div>
                ) : (
                  colVendors.map(({ vendor, originalIdx }) => (
                    <VendorCard
                      key={originalIdx}
                      vendor={vendor}
                      index={originalIdx}
                      eventTitle={eventTitle}
                      eventDate={eventDate}
                      city={city}
                      onUpdateVendor={handleUpdateVendor}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
