import { NextRequest, NextResponse } from "next/server";
import { CreateEventSchema } from "@/lib/schemas/api";
import { createClient } from "@/lib/supabase/server";
import { dbService } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const event = await dbService.getEvent(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    return NextResponse.json(event);
  }

  // Get user from session (if available)
  let userId: string | undefined;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // Offline
  }

  const events = await dbService.listEvents(userId);
  return NextResponse.json(events || []);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let userId = "00000000-0000-0000-0000-000000000001";
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {
      // Offline fallback
    }

    const initialPlan = {
      title: parsed.data.title,
      eventType: parsed.data.type,
      date: parsed.data.date || "",
      guests: parsed.data.guests || 40,
      budget: parsed.data.budget || 80000,
      city: parsed.data.city || "Hyderabad",
      theme: "Modern Festive Elegance",
      language: "en",
      budgetSplit: [],
      timeline: [],
      vendors: [],
      ideas: {
        menu: [],
        games: [],
        surprise: "",
        themes: [],
        decor: [],
        invitationText: { en: "", hi: "", te: "" },
      },
      runSheet: [],
    };

    const newEvent = await dbService.createEvent({
      user_id: userId,
      title: parsed.data.title,
      type: parsed.data.type,
      date: parsed.data.date || null,
      guests: parsed.data.guests || null,
      budget: parsed.data.budget || null,
      city: parsed.data.city || null,
      plan: initialPlan,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (err) {
    console.error("Create event error:", err);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const updated = await dbService.updateEvent(id, updates);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Update event error:", err);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    await dbService.deleteEvent(id);
    return NextResponse.json({ success: true, message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
