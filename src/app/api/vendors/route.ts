import { NextRequest, NextResponse } from "next/server";
import { CreateVendorSchema, UpdateVendorSchema } from "@/lib/schemas/api";
import { dbService } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const vendors = await dbService.getVendors(eventId);
  return NextResponse.json(vendors);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateVendorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newVendor = await dbService.createVendor({
      event_id: parsed.data.eventId,
      type: parsed.data.type,
      name: parsed.data.name || null,
      phone: parsed.data.phone || null,
      status: parsed.data.status || "to_contact",
      quote: parsed.data.quote || null,
      notes: parsed.data.notes || null,
    });

    return NextResponse.json(newVendor, { status: 201 });
  } catch (err) {
    console.error("Create vendor error:", err);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateVendorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...updates } = parsed.data;
    const vendorUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) vendorUpdates.name = updates.name;
    if (updates.phone !== undefined) vendorUpdates.phone = updates.phone;
    if (updates.status !== undefined) vendorUpdates.status = updates.status;
    if (updates.quote !== undefined) vendorUpdates.quote = updates.quote;
    if (updates.notes !== undefined) vendorUpdates.notes = updates.notes;

    const updatedVendor = await dbService.updateVendor(id, vendorUpdates);
    if (!updatedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(updatedVendor);
  } catch (err) {
    console.error("Update vendor error:", err);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing vendor id" }, { status: 400 });
    }

    await dbService.deleteVendor(id);
    return NextResponse.json({ success: true, message: "Vendor deleted successfully" });
  } catch (err) {
    console.error("Delete vendor error:", err);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
