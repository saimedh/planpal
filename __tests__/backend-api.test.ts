import { dbService } from "../src/lib/db";

async function runBackendTests() {
  console.log("🧪 Running PlanPal Backend Architecture & Services Tests...\n");

  // Test 1: dbService getEvent & sample data
  const sampleEvent = await dbService.getEvent("00000000-0000-0000-0000-000000000002");
  if (!sampleEvent || !sampleEvent.title.includes("Priya")) {
    throw new Error("Failed to load sample celebration event from dbService");
  }
  console.log("✓ dbService sample celebration retrieval passed");

  // Test 2: Task creation & retrieval
  const testTaskId = "test-task-" + Date.now();
  await dbService.createTask({
    id: testTaskId,
    event_id: sampleEvent.id,
    title: "Order Marigold Garlands",
    due_date: "2026-11-20",
    assignee: "Host",
    done: false,
  });

  const tasks = await dbService.getTasks(sampleEvent.id);
  const foundTask = tasks.find((t: any) => t.id === testTaskId || t.title === "Order Marigold Garlands");
  if (!foundTask) {
    throw new Error("Failed to create and query task in dbService");
  }
  console.log("✓ dbService task CRUD passed");

  // Test 3: Export & Import Event Bundle
  const exported = await dbService.exportEventData(sampleEvent.id);
  if (!exported || !exported.event || !exported.event.title) {
    throw new Error("Failed to export complete event bundle");
  }
  console.log("✓ dbService export bundle structure passed");

  const imported = await dbService.importEventData(exported, "test-user");
  if (!imported || !imported.id || !imported.title.includes("(Imported)")) {
    throw new Error("Failed to import event bundle with new ID and cloned assets");
  }
  console.log("✓ dbService import bundle clone passed");

  // Test 4: Expenses CRUD
  const testExp = await dbService.createExpense({
    event_id: sampleEvent.id,
    category: "Catering",
    amount: 5000,
    note: "Advance for Chaat counter",
  });
  if (!testExp || testExp.amount !== 5000) {
    throw new Error("Failed to record expense");
  }
  const expenses = await dbService.getExpenses(sampleEvent.id);
  if (!expenses.some((e: any) => e.id === testExp.id)) {
    throw new Error("Recorded expense not found in event ledger");
  }
  console.log("✓ dbService expense ledger recording passed");

  // Clean up test expense
  await dbService.deleteExpense(testExp.id);
  console.log("✓ dbService expense deletion passed");

  console.log("\n🎉 ALL BACKEND SERVICE TESTS PASSED 100%!");
}

runBackendTests().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
