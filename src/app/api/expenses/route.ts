import { NextRequest, NextResponse } from "next/server";
import { CreateExpenseSchema } from "@/lib/schemas/api";
import { dbService } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId query parameter" }, { status: 400 });
  }

  const expenses = await dbService.getExpenses(eventId);
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateExpenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newExpense = await dbService.createExpense({
      event_id: parsed.data.eventId,
      category: parsed.data.category,
      amount: parsed.data.amount,
      note: parsed.data.note,
      spent_on: parsed.data.spentOn || new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(newExpense, { status: 201 });
  } catch (err) {
    console.error("Create expense error:", err);
    return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing expense id" }, { status: 400 });
    }

    await dbService.deleteExpense(id);
    return NextResponse.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    console.error("Delete expense error:", err);
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 });
  }
}
