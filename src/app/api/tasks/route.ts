import { NextRequest, NextResponse } from "next/server";
import { CreateTaskSchema, UpdateTaskSchema } from "@/lib/schemas/api";
import { dbService } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const tasks = await dbService.getTasks(eventId);
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newTask = await dbService.createTask({
      event_id: parsed.data.eventId,
      title: parsed.data.title,
      due_date: parsed.data.dueDate || null,
      assignee: parsed.data.assignee || null,
      reminder: parsed.data.reminder || false,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    console.error("Create task error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = UpdateTaskSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...updates } = parsed.data;
    const taskUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) taskUpdates.title = updates.title;
    if (updates.dueDate !== undefined) taskUpdates.due_date = updates.dueDate;
    if (updates.assignee !== undefined) taskUpdates.assignee = updates.assignee;
    if (updates.done !== undefined) taskUpdates.done = updates.done;
    if (updates.reminder !== undefined) taskUpdates.reminder = updates.reminder;

    const updatedTask = await dbService.updateTask(id, taskUpdates);
    if (!updatedTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing task id" }, { status: 400 });
    }

    await dbService.deleteTask(id);
    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
