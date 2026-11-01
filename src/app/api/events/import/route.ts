import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const bundle = await req.json();

    if (!bundle || !bundle.event) {
      return NextResponse.json(
        { error: "Invalid bundle. Must contain 'event' object." },
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

    const importedEvent = await dbService.importEventData(bundle, userId);

    return NextResponse.json(
      {
        success: true,
        message: "Event imported successfully",
        event: importedEvent,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Import event error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to import event" },
      { status: 500 }
    );
  }
}
