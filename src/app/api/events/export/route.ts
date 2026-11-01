import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event id" }, { status: 400 });
    }

    const bundle = await dbService.exportEventData(id);
    if (!bundle) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return new NextResponse(JSON.stringify(bundle, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="planpal-event-${id.slice(0, 8)}.json"`,
      },
    });
  } catch (err) {
    console.error("Export event error:", err);
    return NextResponse.json({ error: "Failed to export event" }, { status: 500 });
  }
}
