"use client";

import React, { useState, useEffect } from "react";
import { Plus, IndianRupee, Lightbulb, AlertCircle, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BudgetChart } from "./BudgetChart";
import { CategoryProgress } from "./CategoryProgress";
import { ExpenseForm } from "./ExpenseForm";
import { BudgetItem } from "@/lib/schemas/plan";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string | null;
  spent_on: string;
}

interface BudgetTabProps {
  eventId: string;
  budget?: number;
  budgetSplit: BudgetItem[];
}

export function BudgetTab({ eventId, budget = 80000, budgetSplit }: BudgetTabProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);

  // Load existing expenses
  const loadExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const res = await fetch(`/api/expenses?eventId=${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data || []);
      }
    } catch (err) {
      console.warn("Could not fetch expenses:", err);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      loadExpenses();
    }
  }, [eventId]);

  const handleAddExpense = async (newExpense: {
    category: string;
    amount: number;
    note: string;
    spentOn: string;
  }) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        ...newExpense,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to record expense");
    }

    const saved = await res.json();
    setExpenses((prev) => [saved, ...prev]);
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id));
      }
    } catch (err) {
      console.error("Delete expense error:", err);
    }
  };

  // Group actual expenses by category
  const actualByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {} as Record<string, number>);

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const plannedTotal = budgetSplit.reduce((acc, curr) => acc + curr.amount, budget);
  const isOverallOverspent = totalSpent > plannedTotal;

  // AI Savings Tips for Indian celebrations
  const savingsTips = [
    "Opt for vibrant local flowers (Marigold / Genda & Jasmine) over imported lilies to save up to 40% on decor.",
    "Schedule your haldi or mehendi ceremony during brunch hours to significantly reduce venue and buffet catering tariffs.",
    "Bundle photography and cinematic videography with a single crew rather than hiring separate agencies.",
    "Live Chaat and Dosa counters delight Indian guests while being up to 25% more budget-friendly than a 6-course heavy gravy spread.",
  ];

  const categoryNames = budgetSplit.map((b) => b.category);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Planned Budget
          </span>
          <div className="text-xl sm:text-2xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF] mt-1">
            {formatCurrency(plannedTotal)}
          </div>
          <span className="text-[10px] text-gray-400">Based on guest count & city</span>
        </div>

        {/* Total Actual Spent */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Actual Spent
          </span>
          <div
            className={`text-xl sm:text-2xl font-heading font-bold mt-1 ${
              isOverallOverspent ? "text-rose-600" : "text-[#C2185B] dark:text-[#F48DB8]"
            }`}
          >
            {formatCurrency(totalSpent)}
          </div>
          <span className="text-[10px] text-gray-400">
            {expenses.length} payments recorded
          </span>
        </div>

        {/* Remaining */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Remaining Buffer
          </span>
          <div
            className={`text-xl sm:text-2xl font-heading font-bold mt-1 ${
              plannedTotal - totalSpent < 0 ? "text-rose-600" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatCurrency(plannedTotal - totalSpent)}
          </div>
          <span className="text-[10px] text-gray-400">
            {plannedTotal - totalSpent < 0 ? "Over budget alert" : "Available to allocate"}
          </span>
        </div>
      </div>

      {/* Overspend warning banner if exceeded */}
      {isOverallOverspent && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <div>
            <p className="font-semibold">Budget Exceeded Alert</p>
            <p>
              Your actual expenses exceed your planned budget by{" "}
              {formatCurrency(totalSpent - plannedTotal)}. Ask PlanPal to &quot;reduce decor or menu budget&quot; to rebalance!
            </p>
          </div>
        </div>
      )}

      {/* Main Budget Section: Chart + Category Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
              Expense Split
            </h3>
            <span className="text-[10px] text-gray-400">Sums to 100%</span>
          </div>
          <BudgetChart budgetSplit={budgetSplit} />
          <p className="text-[11px] text-gray-500 text-center mt-3">
            AI calibrated for current Indian vendor market rates.
          </p>
        </div>

        {/* Right: Category Breakdown & Progress */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
              Categories & Payments
            </h3>
            <Button
              variant="accent"
              size="sm"
              onClick={() => setIsExpenseFormOpen(true)}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Expense
            </Button>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {budgetSplit.map((item, idx) => (
              <CategoryProgress
                key={idx}
                category={item.category}
                planned={item.amount}
                actual={actualByCategory[item.category] || 0}
                description={item.description}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recorded Expenses Table / List */}
      {expenses.length > 0 && (
        <div className="p-5 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-3">
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
            Payment Ledger
          </h3>
          <div className="divide-y divide-[#E6DEFA] dark:divide-[#2E234B]">
            {expenses.map((exp) => (
              <div
                key={exp.id}
                className="py-2.5 flex items-center justify-between text-xs hover:bg-[#FBF9FF] dark:hover:bg-[#110D1E] px-2 rounded-lg transition-colors"
              >
                <div>
                  <span className="font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                    {exp.category}
                  </span>
                  {exp.note && (
                    <span className="ml-2 text-gray-500 italic">
                      — {exp.note}
                    </span>
                  )}
                  <span className="block text-[10px] text-gray-400 mt-0.5">
                    {formatDate(exp.spent_on)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#C2185B] dark:text-[#F48DB8]">
                    {formatCurrency(Number(exp.amount))}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(exp.id)}
                    aria-label="Delete expense"
                    className="text-gray-400 hover:text-red-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Savings Tips Box */}
      <div className="p-4 rounded-2xl bg-[#FFF8E6] dark:bg-[#775400]/20 border border-[#FEECB3] dark:border-[#A07000]/30 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#A07000] dark:text-[#FDE080]">
          <Lightbulb className="w-4 h-4" />
          <span>PlanPal Indian Event Savings Tips</span>
        </div>
        <ul className="text-xs text-[#4A3E68] dark:text-[#E8DFFF] space-y-1.5 list-disc list-inside">
          {savingsTips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isExpenseFormOpen}
        onClose={() => setIsExpenseFormOpen(false)}
        categories={categoryNames}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}
