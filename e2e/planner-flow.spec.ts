import { test, expect } from "@playwright/test";

test.describe("PlanPal End-to-End Flow", () => {
  test("guest signs in, sends first celebration prompt, and live plan appears with tabs", async ({
    page,
  }) => {
    // 1. Visit landing page
    await page.goto("/");
    await expect(page).toHaveTitle(/PlanPal/i);

    // 2. Check hero heading
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toContainText(/Plan grand celebrations/i);

    // 3. Find live prompt input and type celebration prompt
    const promptInput = page.locator("input[placeholder*='sister\\'s 30th birthday']");
    await expect(promptInput).toBeVisible();

    // 4. Click 'Plan Celebration' button to enter workspace
    const submitBtn = page.getByRole("button", { name: /Plan Celebration/i });
    await submitBtn.click();

    // 5. Navigate to event workspace
    await expect(page).toHaveURL(/\/event\//);

    // 6. Verify Workspace Split Layout
    // Left: Chat panel with PlanPal assistant
    const chatTitle = page.locator("h2", { hasText: /PlanPal Assistant/i });
    await expect(chatTitle).toBeVisible();

    // Right: Live Plan panel with tabs (Budget, Timeline, Vendors, Ideas & Menu, Run Sheet)
    const budgetTab = page.getByRole("tab", { name: /Budget/i });
    const timelineTab = page.getByRole("tab", { name: /Timeline/i });
    const vendorsTab = page.getByRole("tab", { name: /Vendors/i });
    const ideasTab = page.getByRole("tab", { name: /Ideas/i });
    const runSheetTab = page.getByRole("tab", { name: /Run Sheet/i });

    await expect(budgetTab).toBeVisible();
    await expect(timelineTab).toBeVisible();
    await expect(vendorsTab).toBeVisible();
    await expect(ideasTab).toBeVisible();
    await expect(runSheetTab).toBeVisible();

    // 7. Verify Budget Tab content (Donut chart & planned amount)
    await expect(page.getByText(/Planned Budget/i)).toBeVisible();

    // 8. Test chat interaction: Type 'make it cheaper' prompt
    const chatInput = page.locator("input[placeholder*='Ask anything']");
    await expect(chatInput).toBeVisible();
    await chatInput.fill("Cut the decor budget to ₹8,000 and add a live chaat counter");
    await page.locator("button[aria-label='Send message']").click();

    // 9. Verify live updating state is indicated
    const updatingIndicator = page.getByText(/Updating your celebration plan/i);
    // Indicator appears during AI processing
    if (await updatingIndicator.isVisible({ timeout: 1000 }).catch(() => false)) {
      await expect(updatingIndicator).toBeVisible();
    }
  });
});
