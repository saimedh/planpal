import { validateBudgetSum, Plan } from "../src/lib/schemas/plan";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("🧪 Running PlanPal Budget Sum Validation Tests...\n");

// 1. Exact Sum Match
{
  const plan: Plan = {
    title: "Sister's 30th Birthday",
    eventType: "birthday",
    date: "2026-11-30",
    guests: 40,
    theme: "Bollywood Glam",
    budget: 80000,
    city: "Hyderabad",
    language: "en",
    budgetSplit: [
      { category: "Venue", amount: 20000, description: "" },
      { category: "Food & Drinks", amount: 25000, description: "" },
      { category: "Decor & Lights", amount: 15000, description: "" },
      { category: "Photography", amount: 10000, description: "" },
      { category: "Cake & Return Gifts", amount: 10000, description: "" },
    ],
    timeline: [],
    vendors: [],
    ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
    runSheet: [],
  };

  assert(validateBudgetSum(plan), "Exact budget sum (20k + 25k + 15k + 10k + 10k = 80k) must be valid");
  console.log("✓ Exact sum test passed");
}

// 2. Tolerance for ₹1-₹5 minor rounding
{
  const planWithRounding: Plan = {
    title: "Wedding Reception",
    eventType: "wedding",
    date: "2026-12-10",
    guests: 150,
    theme: "Royal Marigold",
    budget: 500000,
    city: "Mumbai",
    language: "en",
    budgetSplit: [
      { category: "Catering", amount: 250002, description: "" },
      { category: "Venue", amount: 249999, description: "" }, // sum = 500001 (diff = 1)
    ],
    timeline: [],
    vendors: [],
    ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
    runSheet: [],
  };

  assert(validateBudgetSum(planWithRounding), "Minor rounding tolerance of ₹1-₹5 should pass");
  console.log("✓ Rounding tolerance test passed");
}

// 3. Significant Mismatch Should Fail
{
  const planMismatch: Plan = {
    title: "Housewarming",
    eventType: "housewarming",
    date: "2026-11-20",
    guests: 50,
    theme: "Traditional",
    budget: 100000,
    city: "Bengaluru",
    language: "en",
    budgetSplit: [
      { category: "Pooja & Catering", amount: 40000, description: "" },
      { category: "Decor", amount: 20000, description: "" }, // sum = 60000 (diff = 40000)
    ],
    timeline: [],
    vendors: [],
    ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
    runSheet: [],
  };

  assert(!validateBudgetSum(planMismatch), "Budget split that does not sum to total budget must fail");
  console.log("✓ Mismatch detection test passed");
}

// 4. Empty budget / budgetSplit edge case
{
  const emptyPlan: Plan = {
    title: "New Event",
    eventType: "birthday",
    date: "",
    guests: 0,
    theme: "",
    budget: 0,
    city: "",
    language: "en",
    budgetSplit: [],
    timeline: [],
    vendors: [],
    ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
    runSheet: [],
  };

  assert(validateBudgetSum(emptyPlan), "Zero budget with empty split should return true");
  console.log("✓ Edge case test passed");
}

console.log("\n🎉 ALL BUDGET SUM TESTS PASSED SUCCESSFULLY!\n");
