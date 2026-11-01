export async function exportPlanToPdf(elementId: string, filename: string = "Celebration_Plan.pdf") {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("PDF element not found:", elementId);
    return;
  }

  try {
    // Dynamic import to prevent SSR issues with html2pdf
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 10,
      filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.warn("html2pdf failed, falling back to window.print():", error);
    window.print();
  }
}
