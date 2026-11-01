import Anthropic from "@anthropic-ai/sdk";
import { ChatResponseSchema, type ChatResponse, type Plan } from "../schemas/plan";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key_for_build",
});

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

interface ClaudeCallParams {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export function extractJson(text: string): unknown {
  const trimmed = text.trim();
  // 1. Direct parse
  try {
    return JSON.parse(trimmed);
  } catch {
    // 2. Extract from markdown code fence
    const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fencedMatch) {
      return JSON.parse(fencedMatch[1]);
    }

    // 3. Find outer braces
    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const candidate = trimmed.substring(firstBrace, lastBrace + 1);
      return JSON.parse(candidate);
    }

    throw new Error("Could not extract valid JSON from Claude response");
  }
}

/**
 * Rebalance budget split if sum differs slightly from total budget due to LLM arithmetic rounding
 */
export function normalizeBudgetSplit(plan: Plan): Plan {
  if (!plan.budget || !plan.budgetSplit || plan.budgetSplit.length === 0) {
    return plan;
  }
  const currentSum = plan.budgetSplit.reduce((acc, item) => acc + item.amount, 0);
  const diff = plan.budget - currentSum;
  if (diff !== 0 && plan.budgetSplit.length > 0) {
    // Adjust the last category (often Miscellaneous or Decor)
    const lastItem = plan.budgetSplit[plan.budgetSplit.length - 1];
    lastItem.amount = Math.max(0, lastItem.amount + diff);
  }
  return plan;
}

export async function callClaude(params: ClaudeCallParams): Promise<ChatResponse> {
  const { systemPrompt, messages } = params;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { text: string }).text)
    .join("");

  const rawJson = extractJson(text);
  const validated = ChatResponseSchema.parse(rawJson);
  validated.plan = normalizeBudgetSplit(validated.plan);

  return validated;
}

export async function callClaudeWithRetry(
  params: ClaudeCallParams,
  currentPlan?: Plan | null
): Promise<ChatResponse> {
  try {
    return await callClaude(params);
  } catch (err) {
    console.warn("First Claude call failed or JSON validation error. Retrying once...", err);
    try {
      return await callClaude(params);
    } catch (retryErr) {
      console.error("Retry also failed:", retryErr);
      const fallbackPlan: Plan = currentPlan || {
        title: "Celebration Plan",
        eventType: "celebration",
        date: "",
        guests: 40,
        budget: 50000,
        city: "Hyderabad",
        theme: "Traditional & Modern Fusion",
        language: "en",
        budgetSplit: [
          { category: "Venue & Decor", amount: 15000, description: "Space and floral decor" },
          { category: "Food & Drinks", amount: 20000, description: "Catering and buffet spread" },
          { category: "Photography", amount: 8000, description: "Event coverage" },
          { category: "Cake & Extras", amount: 7000, description: "Custom cake and contingency" },
        ],
        timeline: [
          { task: "Book venue & date", dueDate: "", assignee: "Host", done: false, reminder: true },
          { task: "Confirm caterer & menu", dueDate: "", assignee: "Host", done: false, reminder: true },
          { task: "Send digital invites", dueDate: "", assignee: "Host", done: false, reminder: false },
        ],
        vendors: [
          { type: "Catering", name: "Royal Caterers", phone: "+91 98765 00001", status: "to_contact", quote: 20000, notes: "Discuss menu", priceRange: "₹400-600/plate" },
          { type: "Decor", name: "Utsav Decor", phone: "+91 98765 00002", status: "to_contact", quote: 15000, notes: "Floral & lighting", priceRange: "₹10,000-25,000" },
        ],
        ideas: {
          menu: [
            { name: "Paneer Tikka", category: "starter", isVeg: true, isJain: false, isVegan: false },
            { name: "Dum Biryani", category: "main", isVeg: true, isJain: false, isVegan: false },
            { name: "Gulab Jamun with Rabdi", category: "dessert", isVeg: true, isJain: false, isVegan: false },
          ],
          games: ["Musical Chairs with Indian beats", "Bollywood Trivia Quiz", "Pass the Parcel with Dares"],
          surprise: "Personalized nostalgic memory montage with voice messages from close family.",
          themes: ["Royal Marigold & Velvet", "Minimal Pastel Chic"],
          decor: ["Traditional brass lamps with flower petals", "Fairy light photo wall backdrop"],
          invitationText: {
            en: "You are joyfully invited to join us for the grand celebration! Your presence will make our day truly special.",
            hi: "आप हमारे विशेष उत्सव में सादर आमंत्रित हैं। आपकी उपस्थिति हमारे आनंद को दोगुना करेगी।",
            te: "మా ప్రత్యేక వేడుకకు మీరందరూ సాదరంగా ఆహ్వానితులు! మీ రాక మాకు అత్యంత ఆనందదాయకం.",
          },
        },
        runSheet: [
          { time: "05:00 PM", activity: "Venue & audio setup check", vendor: "Decorator / DJ", contact: "Venue Manager", notes: "Final walkthrough" },
          { time: "06:30 PM", activity: "Guest arrivals & welcome drinks", vendor: "Caterer", contact: "Head Waiter", notes: "Welcome mocktails ready" },
          { time: "08:00 PM", activity: "Main celebration / Cake cutting", vendor: "Baker", contact: "Host", notes: "Sparklers & music ready" },
          { time: "08:45 PM", activity: "Dinner buffet opens", vendor: "Caterer", contact: "Catering lead", notes: "Hot food service" },
        ],
      };

      return {
        reply: "I had a momentary connection hiccup processing the full update, but I've preserved your plan intact. How would you like to proceed or tweak?",
        plan: fallbackPlan,
        changes: [],
      };
    }
  }
}
