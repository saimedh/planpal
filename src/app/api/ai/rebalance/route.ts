import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PlanSchema } from "@/lib/schemas/plan";

const RebalanceInputSchema = z.object({
  plan: PlanSchema,
  targetBudget: z.number().int().positive().optional(),
  percentageDelta: z.number().min(-90).max(500).optional(),
  priorityCategory: z.string().optional(),
  preserveCategories: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RebalanceInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { plan, targetBudget, percentageDelta, priorityCategory, preserveCategories } =
      parsed.data;

    let newTotal = plan.budget;
    if (targetBudget !== undefined) {
      newTotal = targetBudget;
    } else if (percentageDelta !== undefined) {
      newTotal = Math.round(plan.budget * (1 + percentageDelta / 100));
    }

    // Clone split
    const currentSplit = [...plan.budgetSplit];
    if (currentSplit.length === 0) {
      return NextResponse.json({
        rebalancedPlan: { ...plan, budget: newTotal },
        explanation: "No budget categories present to rebalance.",
      });
    }

    // Categories that cannot change
    const lockedCategories = new Set(
      preserveCategories.map((c) => c.toLowerCase().trim())
    );

    let lockedSum = 0;
    let unlockedCurrentSum = 0;

    for (const item of currentSplit) {
      if (lockedCategories.has(item.category.toLowerCase().trim())) {
        lockedSum += item.amount;
      } else {
        unlockedCurrentSum += item.amount;
      }
    }

    const remainingForUnlocked = Math.max(0, newTotal - lockedSum);
    const scalingFactor =
      unlockedCurrentSum > 0 ? remainingForUnlocked / unlockedCurrentSum : 1;

    let runningSum = lockedSum;
    const rebalancedSplit = currentSplit.map((item, index) => {
      const isLocked = lockedCategories.has(item.category.toLowerCase().trim());
      if (isLocked) {
        return { ...item };
      }

      // Check if this is the prioritized category
      let weight = scalingFactor;
      if (
        priorityCategory &&
        item.category.toLowerCase().includes(priorityCategory.toLowerCase())
      ) {
        weight = scalingFactor * 1.15; // Give boost
      }

      let newAmount = Math.round((item.amount * weight) / 100) * 100; // Round to nearest 100

      // For the last unlocked item, balance the difference to ensure exact 100% match
      if (index === currentSplit.length - 1) {
        newAmount = Math.max(0, newTotal - runningSum);
      } else {
        runningSum += newAmount;
      }

      return {
        ...item,
        amount: newAmount,
      };
    });

    // Final sanity check for zero drift
    const finalCalculatedSum = rebalancedSplit.reduce((acc, i) => acc + i.amount, 0);
    const diff = newTotal - finalCalculatedSum;
    if (diff !== 0 && rebalancedSplit.length > 0) {
      rebalancedSplit[rebalancedSplit.length - 1].amount += diff;
    }

    const rebalancedPlan = {
      ...plan,
      budget: newTotal,
      budgetSplit: rebalancedSplit,
    };

    const deltaSign = newTotal >= plan.budget ? "+" : "-";
    const deltaAmount = Math.abs(newTotal - plan.budget);
    const explanation = `Rebalanced celebration budget from ₹${plan.budget.toLocaleString(
      "en-IN"
    )} to ₹${newTotal.toLocaleString(
      "en-IN"
    )} (${deltaSign}₹${deltaAmount.toLocaleString("en-IN")}). All ${
      rebalancedSplit.length
    } categories redistributed with 100% mathematical zero-drift balance.`;

    return NextResponse.json({
      rebalancedPlan,
      oldBudget: plan.budget,
      newBudget: newTotal,
      explanation,
    });
  } catch (err) {
    console.error("Rebalance error:", err);
    return NextResponse.json({ error: "Failed to rebalance budget" }, { status: 500 });
  }
}
