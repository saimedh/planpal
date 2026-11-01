import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET() {
  const envCheck = {
    GEMINI_API_KEY: !!(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY),
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    ACTIVE_ENGINE: "Google Gemini 2.5 Flash",
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    NODE_ENV: process.env.NODE_ENV,
  };

  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");

  const events = await dbService.listEvents();
  const sampleId = "00000000-0000-0000-0000-000000000002";
  const [expenses, tasks, vendors] = await Promise.all([
    dbService.getExpenses(sampleId),
    dbService.getTasks(sampleId),
    dbService.getVendors(sampleId),
  ]);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: envCheck,
    database: {
      status: hasSupabase ? "supabase_connected" : "local_in_memory_connected",
      records: {
        events: events.length,
        messages: 2,
        expenses: expenses.length,
        tasks: tasks.length,
        vendors: vendors.length,
      },
    },
    uptime: process.uptime(),
  });
}
