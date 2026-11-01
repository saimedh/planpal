"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  onSubmit: (expense: {
    category: string;
    amount: number;
    note: string;
    spentOn: string;
  }) => Promise<void>;
}

export function ExpenseForm({
  isOpen,
  onClose,
  categories,
  onSubmit,
}: ExpenseFormProps) {
  const [category, setCategory] = useState(categories[0] || "Food & Catering");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [spentOn, setSpentOn] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        category,
        amount: numAmount,
        note,
        spentOn,
      });
      // Reset & close
      setAmount("");
      setNote("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save expense.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Actual Expense"
      description="Record an advance or payment made to keep your budget on track."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E68] dark:text-[#C9C1D4] mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-[#E6DEFA] bg-white px-3.5 py-2.5 text-sm text-[#1C1530] focus:border-[#C2185B] focus:outline-none dark:border-[#2E234B] dark:bg-[#1B142F] dark:text-[#FBF9FF] min-h-[44px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="Miscellaneous & Other">Miscellaneous & Other</option>
          </select>
        </div>

        {/* Amount */}
        <Input
          label="Amount (₹)"
          type="number"
          step="any"
          required
          placeholder="e.g. 15000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={error || undefined}
        />

        {/* Note / Description */}
        <Input
          label="Note / Vendor Name"
          placeholder="e.g. Advance paid to Royal Caterers"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {/* Spent Date */}
        <Input
          label="Date Paid"
          type="date"
          value={spentOn}
          onChange={(e) => setSpentOn(e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
}
