import { callClaudeWithRetry } from "./claude";
import { callGeminiWithRetry } from "./gemini";
import { ChatResponse, Plan } from "../schemas/plan";

export async function generatePlan(
  params: {
    systemPrompt: string;
    messages: { role: "user" | "assistant"; content: string }[];
  },
  currentPlan?: Plan | null
): Promise<ChatResponse> {
  const geminiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    "";

  // If Gemini key is available, use Google Gemini
  if (geminiKey) {
    try {
      return await callGeminiWithRetry(params, currentPlan);
    } catch (geminiErr) {
      console.warn("Gemini call failed, attempting fallback to Claude:", geminiErr);
    }
  }

  // Fallback or default to Claude
  return await callClaudeWithRetry(params, currentPlan);
}
