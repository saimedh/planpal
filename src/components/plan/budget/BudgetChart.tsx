"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { BudgetItem } from "@/lib/schemas/plan";
import { formatCurrency } from "@/lib/utils";

interface BudgetChartProps {
  budgetSplit: BudgetItem[];
}

const COLORS = [
  "#C2185B", // Magenta
  "#F2A900", // Marigold
  "#62596F", // Plum Slate
  "#493D5C", // Deep Purple
  "#A3134C", // Dark Magenta
  "#C78700", // Dark Marigold
  "#00897B", // Teal
  "#8E24AA", // Purple
];

export function BudgetChart({ budgetSplit }: BudgetChartProps) {
  if (!budgetSplit || budgetSplit.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-400">
        No budget data yet. Ask PlanPal to generate a budget split!
      </div>
    );
  }

  const chartData = budgetSplit.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  const total = budgetSplit.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [formatCurrency(Number(value) || 0), "Planned"]}
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E4DEF2",
              fontSize: "12px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text in donut */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
          Total Budget
        </span>
        <span className="text-base font-bold font-heading text-[#1C1530] dark:text-[#FBF9FF]">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
