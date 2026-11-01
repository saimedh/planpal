"use client";

import React, { useState } from "react";
import { MenuItem } from "@/lib/schemas/plan";
import { Utensils, Leaf, Check } from "lucide-react";

interface MenuSectionProps {
  menu: MenuItem[];
}

export function MenuSection({ menu }: MenuSectionProps) {
  const [filter, setFilter] = useState<"all" | "veg" | "jain" | "vegan">("all");

  const filteredMenu = menu.filter((item) => {
    if (filter === "veg") return item.isVeg;
    if (filter === "jain") return item.isJain;
    if (filter === "vegan") return item.isVegan;
    return true;
  });

  // Group by category (starter, main, dessert, drink, live_counter)
  const categories = Array.from(new Set(menu.map((i) => i.category || "General")));

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "all"
              ? "bg-[#C2185B] text-white"
              : "bg-white dark:bg-[#1B142F] text-gray-600 dark:text-gray-300 border border-[#E6DEFA] dark:border-[#2E234B]"
          }`}
        >
          All Items ({menu.length})
        </button>
        <button
          onClick={() => setFilter("veg")}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "veg"
              ? "bg-emerald-600 text-white"
              : "bg-white dark:bg-[#1B142F] text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
          }`}
        >
          <Leaf className="w-3 h-3" />
          <span>Pure Veg</span>
        </button>
        <button
          onClick={() => setFilter("jain")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "jain"
              ? "bg-[#F2A900] text-[#1C1530]"
              : "bg-white dark:bg-[#1B142F] text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
          }`}
        >
          Jain Friendly
        </button>
        <button
          onClick={() => setFilter("vegan")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            filter === "vegan"
              ? "bg-teal-600 text-white"
              : "bg-white dark:bg-[#1B142F] text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900"
          }`}
        >
          Vegan
        </button>
      </div>

      {/* Menu Categories */}
      {filteredMenu.length === 0 ? (
        <div className="p-6 text-center text-xs text-gray-400 bg-white dark:bg-[#1B142F] rounded-xl border border-[#E6DEFA] dark:border-[#2E234B]">
          No menu items matching this dietary filter. Ask PlanPal to add them!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => {
            const items = filteredMenu.filter((item) => (item.category || "General") === category);
            if (items.length === 0) return null;

            return (
              <div
                key={category}
                className="p-4 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] space-y-2.5"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C2185B] dark:text-[#F48DB8] flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>{category}</span>
                </h4>
                <div className="space-y-1.5">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#FBF9FF] dark:hover:bg-[#110D1E] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {/* Indian Veg / Non-Veg square dot indicator */}
                        <div
                          className={`w-3 h-3 rounded-xs border flex items-center justify-center ${
                            item.isVeg
                              ? "border-emerald-600"
                              : "border-red-600"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                        </div>
                        <span className="text-xs font-medium text-[#1C1530] dark:text-[#FBF9FF]">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {item.isJain && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200">
                            Jain
                          </span>
                        )}
                        {item.isVegan && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200">
                            Vegan
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
