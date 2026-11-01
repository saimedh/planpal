import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function daysUntil(date: string | Date): number {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function progressPercent(tasks: { done: boolean }[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

export function generateWhatsAppLink(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text);
  if (phone) {
    const cleaned = phone.replace(/\D/g, "");
    return `https://wa.me/${cleaned}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}
