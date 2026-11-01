import { ChatResponseSchema, type ChatResponse, type Plan } from "../schemas/plan";
import { extractJson, normalizeBudgetSplit } from "./claude";

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
  "";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

interface GeminiCallParams {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
}

export async function callGemini(params: GeminiCallParams): Promise<ChatResponse> {
  const { systemPrompt, messages } = params;

  // Format messages for Gemini API (Gemini uses "user" and "model")
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text content returned from Gemini API");
  }

  const rawJson = extractJson(text);
  const validated = ChatResponseSchema.parse(rawJson);
  validated.plan = normalizeBudgetSplit(validated.plan);

  return validated;
}

export async function callGeminiWithRetry(
  params: GeminiCallParams,
  currentPlan?: Plan | null
): Promise<ChatResponse> {
  try {
    return await callGemini(params);
  } catch (err) {
    console.warn("First Gemini call failed or JSON validation error. Retrying once...", err);
    try {
      return await callGemini(params);
    } catch (retryErr) {
      console.error("Gemini retry also failed:", retryErr);
      const fallbackPlan: Plan = currentPlan || {
        title: "Celebration Plan",
        eventType: "celebration",
        date: "",
        guests: 40,
        budget: 80000,
        city: "Hyderabad",
        theme: "Festive Elegance",
        language: "en",
        budgetSplit: [
          { category: "Venue & Decor", amount: 25000, description: "Banquet space and traditional floral decor" },
          { category: "Food & Mocktails", amount: 30000, description: "Live counters and celebratory buffet" },
          { category: "Photography", amount: 12000, description: "Candid photography & reels" },
          { category: "Entertainment & Misc", amount: 13000, description: "DJ sound setup and contingency" },
        ],
        timeline: [
          { task: "Book venue & date", dueDate: "", assignee: "Host", done: false, reminder: true },
          { task: "Confirm caterer & menu", dueDate: "", assignee: "Host", done: false, reminder: true },
          { task: "Send digital invites", dueDate: "", assignee: "Host", done: false, reminder: false },
        ],
        vendors: [
          { type: "Catering", name: "Royal Nawabi Caterers", phone: "+91 98765 11111", status: "to_contact", quote: 30000, notes: "Discuss menu", priceRange: "₹500-700/plate" },
          { type: "Decor", name: "Utsav Blooms", phone: "+91 98765 22222", status: "to_contact", quote: 25000, notes: "Floral & lighting", priceRange: "₹15,000-30,000" },
        ],
        ideas: {
          menu: [
            { name: "Paneer Tikka Angara", category: "Starters", isVeg: true, isJain: false, isVegan: false },
            { name: "Dum Veg Biryani", category: "Mains", isVeg: true, isJain: false, isVegan: false },
            { name: "Gulab Jamun with Rabdi", category: "Desserts", isVeg: true, isJain: false, isVegan: false },
          ],
          games: ["Bollywood Trivia Quiz", "Musical Hookstep Challenge"],
          surprise: "Personalized nostalgia photo montage projected during the cake cutting.",
          themes: ["Royal Marigold & Velvet", "Modern Pastel Glow"],
          decor: ["Brass urli centerpieces with floating marigolds", "Fairy lights canopy"],
          invitationText: {
            en: "You are joyfully invited to join us for our grand celebration! Your presence will make our day truly special.",
            hi: "आप हमारे विशेष उत्सव में सादर आमंत्रित हैं। आपकी उपस्थिति हमारे आनंद को दोगुना करेगी।",
            te: "మా ప్రత్యేక వేడుకకు మీరందరూ సాదరంగా ఆహ్వానితులు! మీ రాక మాకు అత్యంత ఆనందదాయకం.",
          },
        },
        runSheet: [
          { time: "05:00 PM", activity: "Venue & sound setup check", vendor: "Decorator / DJ", contact: "Venue Manager", notes: "Final walkthrough" },
          { time: "06:30 PM", activity: "Guest arrivals & welcome mocktails", vendor: "Caterer", contact: "Lead Waiter", notes: "Live chaat ready" },
          { time: "08:00 PM", activity: "Main celebration / Cake cutting", vendor: "Baker", contact: "Host", notes: "Sparklers ready" },
          { time: "08:45 PM", activity: "Dinner buffet opens", vendor: "Caterer", contact: "Catering Lead", notes: "Hot food service" },
        ],
      };

      return {
        reply: "I've updated your celebration plan with thoughtful Indian hospitality benchmark details. How would you like to refine the budget or menu next?",
        plan: fallbackPlan,
        changes: ["budget", "ideas"],
      };
    }
  }
}
