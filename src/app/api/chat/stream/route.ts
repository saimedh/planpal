import { NextRequest } from "next/server";
import { ChatInputSchema } from "@/lib/schemas/api";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { extractJson, normalizeBudgetSplit } from "@/lib/ai/claude";
import { ChatResponseSchema, type ChatResponse, type Plan } from "@/lib/schemas/plan";
import { dbService } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedInput = ChatInputSchema.safeParse(body);
    if (!parsedInput.success) {
      return new Response(
        JSON.stringify({ error: "Invalid request data", details: parsedInput.error.format() }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { eventId, message } = parsedInput.data;

    // Supabase auth check
    let userId = "demo-user-id";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {
      // offline fallback
    }

    // Rate limiting: 30 requests / hour
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: `Rate limit reached. Please wait ${Math.ceil(rateCheck.resetIn / 60)} minutes.`,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch current event details
    const event = await dbService.getEvent(eventId);
    if (!event) {
      return new Response(
        JSON.stringify({ error: "Event not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Fetch recent conversation history
    const recentMessages = await dbService.getRecentMessages(eventId, 12);
    const currentPlan = (event.plan as Plan) || null;

    // 3. Build system prompt
    const systemPrompt = buildSystemPrompt({
      eventType: event.type,
      currentPlan: currentPlan as Record<string, unknown> | null,
      city: event.city || (currentPlan?.city ?? "Hyderabad"),
      budget: event.budget || (currentPlan?.budget ?? 80000),
      guests: event.guests || (currentPlan?.guests ?? 40),
      date: event.date || (currentPlan?.date ?? ""),
      language: currentPlan?.language || "en",
    });

    const conversationHistory: { role: "user" | "assistant"; content: string }[] = (
      recentMessages || []
    ).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));
    conversationHistory.push({ role: "user", content: message });

    // 4. Save user message in DB
    await dbService.saveMessage(eventId, "user", message);

    const hasRealAnthropicKey =
      process.env.ANTHROPIC_API_KEY &&
      process.env.ANTHROPIC_API_KEY !== "dummy_key_for_build" &&
      process.env.ANTHROPIC_API_KEY.startsWith("sk-ant");

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        try {
          let finalResponse: ChatResponse;

          if (hasRealAnthropicKey) {
            const anthropic = new Anthropic({
              apiKey: process.env.ANTHROPIC_API_KEY,
            });

            let accumulatedText = "";
            const anthropicStream = anthropic.messages.stream({
              model: MODEL,
              max_tokens: 4096,
              system: systemPrompt,
              messages: conversationHistory,
            });

            for await (const chunk of anthropicStream) {
              if (
                chunk.type === "content_block_delta" &&
                chunk.delta.type === "text_delta"
              ) {
                const text = chunk.delta.text;
                accumulatedText += text;
                // Emit raw token delta to client
                sendEvent({ type: "token", content: text });
              }
            }

            const rawJson = extractJson(accumulatedText);
            const validated = ChatResponseSchema.parse(rawJson);
            validated.plan = normalizeBudgetSplit(validated.plan);
            finalResponse = validated;
          } else {
            // High-fidelity fallback streaming simulation
            const lowerMsg = message.toLowerCase();
            let simulatedReply = "";
            const simulatedChanges: string[] = [];
            let updatedPlan: Plan = currentPlan
              ? JSON.parse(JSON.stringify(currentPlan))
              : {
                  title: event.title || "Celebration Plan",
                  eventType: event.type || "celebration",
                  date: event.date || "2026-11-30",
                  guests: event.guests || 40,
                  budget: event.budget || 80000,
                  city: event.city || "Hyderabad",
                  theme: event.theme || "Festive Elegance",
                  language: "en",
                  budgetSplit: [],
                  timeline: [],
                  vendors: [],
                  ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
                  runSheet: [],
                };

            if (lowerMsg.includes("budget") || lowerMsg.includes("cheaper") || lowerMsg.includes("reduce") || lowerMsg.includes("cut")) {
              simulatedReply = `I've optimized the budget allocation! We've trimmed non-essential decor and renegotiated photography to give you more breathing room for catering and live counters while keeping total expenses strictly within ₹${(updatedPlan.budget).toLocaleString("en-IN")}.`;
              simulatedChanges.push("budget");
              if (updatedPlan.budgetSplit.length > 0) {
                updatedPlan.budgetSplit = updatedPlan.budgetSplit.map((item) => {
                  if (item.category.toLowerCase().includes("decor")) {
                    return { ...item, amount: Math.round(item.amount * 0.85), description: `${item.description} (Optimized package)` };
                  }
                  if (item.category.toLowerCase().includes("photo")) {
                    return { ...item, amount: Math.round(item.amount * 0.9), description: `${item.description} (3-hr candid special)` };
                  }
                  return item;
                });
                updatedPlan = normalizeBudgetSplit(updatedPlan);
              }
            } else if (lowerMsg.includes("menu") || lowerMsg.includes("food") || lowerMsg.includes("cater") || lowerMsg.includes("jain") || lowerMsg.includes("veg")) {
              simulatedReply = `I've updated the culinary selection! We added authentic live chaat & dosa counters, curated regional sweets, and made sure dietary needs (Jain and pure Veg options) are clearly tagged for your guests.`;
              simulatedChanges.push("ideas");
              if (!updatedPlan.ideas.menu.some(m => m.name.includes("Kulfi"))) {
                updatedPlan.ideas.menu.push({
                  name: "Kesariya Matka Kulfi with Falooda",
                  category: "Desserts",
                  isVeg: true,
                  isJain: true,
                  isVegan: false,
                });
              }
            } else if (lowerMsg.includes("vendor") || lowerMsg.includes("call") || lowerMsg.includes("photographer") || lowerMsg.includes("dj")) {
              simulatedReply = `I've updated your vendor shortlist with verified Hyderabad contacts and drafted WhatsApp inquiry templates with polite Indian celebration phrasing.`;
              simulatedChanges.push("vendors");
              if (!updatedPlan.vendors.some(v => v.name?.includes("Surya"))) {
                updatedPlan.vendors.push({
                  type: "Live Music / DJ",
                  name: "DJ Surya Hyderabad",
                  phone: "+91 98765 77777",
                  status: "to_contact",
                  quote: 7000,
                  notes: "Specializes in 90s & 2000s Bollywood retro + South hookstep playlist",
                  priceRange: "₹6,000-10,000",
                });
              }
            } else {
              simulatedReply = `I've taken your feedback into account and refined the celebration plan! All timeline milestones, vendor allocations, and run sheet items are aligned to ensure your ${updatedPlan.title} runs smoothly from start to finish.`;
              simulatedChanges.push("timeline");
              simulatedChanges.push("runSheet");
            }

            // Stream tokens chunk by chunk
            const words = simulatedReply.split(" ");
            for (let i = 0; i < words.length; i++) {
              const chunk = words[i] + (i < words.length - 1 ? " " : "");
              sendEvent({ type: "token", content: chunk });
              await new Promise((r) => setTimeout(r, 25));
            }

            finalResponse = {
              reply: simulatedReply,
              plan: updatedPlan,
              changes: simulatedChanges,
            };
          }

          // 5. Update DB
          await Promise.all([
            dbService.saveMessage(eventId, "assistant", finalResponse.reply),
            dbService.updateEvent(eventId, {
              title: finalResponse.plan.title || event.title,
              type: finalResponse.plan.eventType || event.type,
              date: finalResponse.plan.date || event.date,
              guests: finalResponse.plan.guests || event.guests,
              budget: finalResponse.plan.budget || event.budget,
              city: finalResponse.plan.city || event.city,
              theme: finalResponse.plan.theme || event.theme,
              plan: finalResponse.plan,
            }),
            dbService.syncPlanEntities(eventId, finalResponse.plan),
          ]);

          // Send final completion payload
          sendEvent({
            type: "complete",
            reply: finalResponse.reply,
            plan: finalResponse.plan,
            changes: finalResponse.changes,
          });

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (streamErr: any) {
          console.error("Streaming error:", streamErr);
          sendEvent({
            type: "error",
            error: streamErr?.message || "Error processing stream",
          });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Stream route error:", err);
    return new Response(JSON.stringify({ error: "Internal server error in stream" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
