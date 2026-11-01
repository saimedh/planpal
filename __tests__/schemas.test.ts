import {
  BudgetItemSchema,
  TimelineTaskSchema,
  VendorSchema,
  MenuItemSchema,
  PlanSchema,
  ChatResponseSchema,
} from "../src/lib/schemas/plan";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log("🧪 Running PlanPal Zod Schema Tests...\n");

// 1. BudgetItemSchema Test
{
  const valid = BudgetItemSchema.safeParse({
    category: "Food & Catering",
    amount: 25000,
    description: "Buffet spread for 40 guests",
  });
  assert(valid.success, "BudgetItemSchema should validate correct item");

  const invalid = BudgetItemSchema.safeParse({
    category: "",
    amount: -100,
  });
  assert(!invalid.success, "BudgetItemSchema should reject negative amount and empty category");
  console.log("✓ BudgetItemSchema validation passed");
}

// 2. TimelineTaskSchema Test
{
  const valid = TimelineTaskSchema.safeParse({
    task: "Book venue banquet lawn",
    dueDate: "2026-11-20",
    assignee: "Host",
    done: true,
    reminder: false,
  });
  assert(valid.success, "TimelineTaskSchema should validate correct task");

  const withDefaults = TimelineTaskSchema.safeParse({
    task: "Coordinate DJ",
    dueDate: "2026-11-25",
  });
  assert(withDefaults.success, "TimelineTaskSchema should apply defaults for done and reminder");
  assert(withDefaults.data?.done === false, "Default done should be false");
  console.log("✓ TimelineTaskSchema validation passed");
}

// 3. VendorSchema Test
{
  const valid = VendorSchema.safeParse({
    type: "Photographer",
    name: "Arjun Captures",
    phone: "+91 98765 43210",
    status: "quoted",
    quote: 12000,
    priceRange: "₹10,000 - ₹15,000",
  });
  assert(valid.success, "VendorSchema should accept valid vendor");

  const invalidStatus = VendorSchema.safeParse({
    type: "Decorator",
    status: "unknown_status",
  });
  assert(!invalidStatus.success, "VendorSchema should reject invalid status enum");
  console.log("✓ VendorSchema validation passed");
}

// 4. MenuItemSchema Test
{
  const vegItem = MenuItemSchema.safeParse({
    name: "Paneer Tikka Angara",
    category: "Starters",
    isVeg: true,
    isJain: false,
    isVegan: false,
  });
  assert(vegItem.success, "MenuItemSchema should parse veg item");
  assert(vegItem.data?.isVeg === true, "isVeg should be true");

  const jainItem = MenuItemSchema.safeParse({
    name: "Crispy Corn",
    category: "Starters",
    isVeg: true,
    isJain: true,
  });
  assert(jainItem.success, "MenuItemSchema should parse Jain item");
  console.log("✓ MenuItemSchema validation passed");
}

// 5. Complete PlanSchema Test
{
  const samplePlan = {
    title: "Priya's 30th Birthday Bash",
    eventType: "birthday",
    date: "2026-11-30",
    guests: 40,
    budget: 80000,
    city: "Hyderabad",
    theme: "Bollywood Glam",
    language: "en",
    budgetSplit: [
      { category: "Venue", amount: 20000, description: "Banquet lawn" },
      { category: "Food", amount: 25000, description: "Buffet" },
      { category: "Decor", amount: 15000, description: "Marigolds & lights" },
      { category: "Misc", amount: 20000, description: "Contingency" },
    ],
    timeline: [
      { task: "Book venue", dueDate: "2026-11-10", done: true },
      { task: "Send invites", dueDate: "2026-11-15", done: false },
    ],
    vendors: [
      { type: "Caterer", name: "Royal Caterers", status: "booked", quote: 25000 },
    ],
    ideas: {
      menu: [
        { name: "Dum Biryani", category: "Mains", isVeg: true },
      ],
      games: ["Bollywood Trivia"],
      surprise: "Childhood memory montage",
      themes: ["Bollywood Retro"],
      decor: ["Brass urlis"],
      invitationText: {
        en: "Join us for Priya's 30th!",
        hi: "प्रिया के 30वें जन्मदिन पर सादर आमंत्रित!",
        te: "ప్రియా 30వ పుట్టినరోజుకు ఆహ్వానం!",
      },
    },
    runSheet: [
      { time: "06:00 PM", activity: "Guest arrivals" },
    ],
  };

  const planValid = PlanSchema.safeParse(samplePlan);
  assert(planValid.success, "PlanSchema should validate realistic Indian celebration plan");
  console.log("✓ PlanSchema validation passed");
}

// 6. ChatResponseSchema Test
{
  const chatResponse = {
    reply: "I have updated your Hyderabad birthday plan with a ₹80,000 budget split and pure vegetarian menu!",
    plan: {
      title: "Priya's 30th Birthday",
      eventType: "birthday",
      guests: 40,
      budget: 80000,
      city: "Hyderabad",
      budgetSplit: [{ category: "Food", amount: 80000 }],
      timeline: [],
      vendors: [],
      ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
      runSheet: [],
    },
    changes: ["budgetSplit", "ideas.menu"],
  };

  const resValid = ChatResponseSchema.safeParse(chatResponse);
  assert(resValid.success, "ChatResponseSchema should parse valid Claude AI JSON output");
  console.log("✓ ChatResponseSchema validation passed");
}

console.log("\n🎉 ALL ZOD SCHEMA TESTS PASSED SUCCESSFULLY!\n");
