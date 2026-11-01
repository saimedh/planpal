import { z } from "zod";

export const BudgetItemSchema = z.object({
  category: z.string().min(1),
  amount: z.number().min(0),
  description: z.string().optional().default(""),
});

export const TimelineTaskSchema = z.object({
  task: z.string().min(1),
  dueDate: z.string(), // ISO date string or YYYY-MM-DD
  assignee: z.string().optional().default(""),
  done: z.boolean().optional().default(false),
  reminder: z.boolean().optional().default(false),
});

export const VendorSchema = z.object({
  type: z.string().min(1),
  name: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  status: z.enum(["to_contact", "quoted", "booked", "paid"]).optional().default("to_contact"),
  quote: z.number().min(0).nullable().optional(),
  notes: z.string().optional().default(""),
  priceRange: z.string().optional().default(""),
});

export const MenuItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("main"), // starter, main, dessert, drink, live_counter
  isVeg: z.boolean().default(true),
  isJain: z.boolean().default(false),
  isVegan: z.boolean().default(false),
});

export const InvitationTextSchema = z.object({
  en: z.string().default(""),
  hi: z.string().default(""),
  te: z.string().default(""),
});

export const IdeasSchema = z.object({
  menu: z.array(MenuItemSchema).default([]),
  games: z.array(z.string()).default([]),
  surprise: z.string().default(""),
  themes: z.array(z.string()).default([]),
  decor: z.array(z.string()).default([]),
  invitationText: InvitationTextSchema.default({ en: "", hi: "", te: "" }),
});

export const RunSheetEntrySchema = z.object({
  time: z.string(),
  activity: z.string(),
  vendor: z.string().optional().default(""),
  contact: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const PlanSchema = z.object({
  title: z.string().default("Celebration Plan"),
  eventType: z.string().default("party"),
  date: z.string().optional().default(""),
  guests: z.number().optional().default(50),
  budget: z.number().optional().default(100000),
  city: z.string().optional().default("Hyderabad"),
  theme: z.string().optional().default("Traditional Elegance"),
  language: z.string().optional().default("en"),
  budgetSplit: z.array(BudgetItemSchema).default([]),
  timeline: z.array(TimelineTaskSchema).default([]),
  vendors: z.array(VendorSchema).default([]),
  ideas: IdeasSchema.default({
    menu: [],
    games: [],
    surprise: "",
    themes: [],
    decor: [],
    invitationText: { en: "", hi: "", te: "" },
  }),
  runSheet: z.array(RunSheetEntrySchema).default([]),
});

export const ChatResponseSchema = z.object({
  reply: z.string().min(1),
  plan: PlanSchema,
  changes: z.array(z.string()).default([]),
});

// Validate budget split sums to total budget
export function validateBudgetSum(plan: z.infer<typeof PlanSchema>): boolean {
  if (!plan.budget || plan.budgetSplit.length === 0) return true;
  const sum = plan.budgetSplit.reduce((acc, item) => acc + item.amount, 0);
  return Math.abs(sum - plan.budget) <= 5; // Allow minor rounding difference (₹5)
}

// Types derived from schemas
export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type TimelineTask = z.infer<typeof TimelineTaskSchema>;
export type Vendor = z.infer<typeof VendorSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Ideas = z.infer<typeof IdeasSchema>;
export type RunSheetEntry = z.infer<typeof RunSheetEntrySchema>;
export type Plan = z.infer<typeof PlanSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
