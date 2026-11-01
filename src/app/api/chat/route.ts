import { NextRequest, NextResponse } from "next/server";
import { ChatInputSchema } from "@/lib/schemas/api";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";
import { generatePlan } from "@/lib/ai/planner";
import { Plan } from "@/lib/schemas/plan";
import { dbService } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedInput = ChatInputSchema.safeParse(body);
    if (!parsedInput.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: parsedInput.error.format() },
        { status: 400 }
      );
    }

    const { eventId, message } = parsedInput.data;

    // Supabase auth check (or fallback user ID for demo/dev)
    const supabase = await createClient();
    let userId = "demo-user-id";
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {
      // Offline fallback
    }

    // Rate limiting: 30 requests / hour per user
    const rateCheck = checkRateLimit(userId);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Rate limit reached. Please wait ${Math.ceil(rateCheck.resetIn / 60)} minutes before sending more messages.`,
        },
        { status: 429 }
      );
    }

    // 1. Fetch current event details using unified dbService
    const event = await dbService.getEvent(eventId);
    if (!event) {
      return NextResponse.json(
        { error: "Event not found or access denied" },
        { status: 404 }
      );
    }

    // 2. Fetch recent conversation history
    const recentMessages = await dbService.getRecentMessages(eventId, 12);
    const currentPlan = (event.plan as Plan) || null;

    // 3. Build system prompt with current plan context
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

    // Add current user message
    conversationHistory.push({ role: "user", content: message });

    // 4. Save user message in DB
    await dbService.saveMessage(eventId, "user", message);

    // 5. Generate plan using Gemini (or Claude) with validation and retry
    const aiResponse = await generatePlan(
      {
        systemPrompt,
        messages: conversationHistory,
      },
      currentPlan
    );

    // 6. Save assistant message, update event and synchronize plan entities
    await Promise.all([
      dbService.saveMessage(eventId, "assistant", aiResponse.reply),
      dbService.updateEvent(eventId, {
        title: aiResponse.plan.title || event.title,
        type: aiResponse.plan.eventType || event.type,
        date: aiResponse.plan.date || event.date,
        guests: aiResponse.plan.guests || event.guests,
        budget: aiResponse.plan.budget || event.budget,
        city: aiResponse.plan.city || event.city,
        theme: aiResponse.plan.theme || event.theme,
        plan: aiResponse.plan,
      }),
      dbService.syncPlanEntities(eventId, aiResponse.plan),
    ]);

    // Return the response
    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing event plan." },
      { status: 500 }
    );
  }
}
