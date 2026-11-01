"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Calendar, IndianRupee, Users, ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatCurrency, formatDate, daysUntil } from "@/lib/utils";

interface EventItem {
  id: string;
  title: string;
  type: string;
  date: string | null;
  guests: number | null;
  budget: number | null;
  city: string | null;
  plan: any;
  share_token?: string;
  created_at: string;
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"wedding" | "birthday" | "housewarming" | "festival" | "community">("birthday");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("40");
  const [budget, setBudget] = useState("80000");
  const [city, setCity] = useState("Hyderabad");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/events");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setEvents(data);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load events:", err);
      }

      // Default sample celebration cards if database empty
      setEvents([
        {
          id: "00000000-0000-0000-0000-000000000002",
          title: "Priya's 30th Birthday Bash",
          type: "birthday",
          date: "2026-11-30",
          guests: 40,
          budget: 80000,
          city: "Hyderabad",
          created_at: new Date().toISOString(),
          plan: {
            budgetSplit: [
              { category: "Venue & Lawn", amount: 20000 },
              { category: "Food & Mocktails", amount: 25000 },
              { category: "Floral & Fairy Decor", amount: 10000 },
              { category: "Candid Photography", amount: 8000 },
              { category: "DJ Setup", amount: 5000 },
              { category: "Custom 2-Tier Cake", amount: 4000 },
              { category: "Return Gifts", amount: 5000 },
              { category: "Miscellaneous", amount: 3000 },
            ],
            timeline: [
              { done: true },
              { done: true },
              { done: false },
              { done: false },
              { done: false },
            ],
          },
        },
        {
          id: "00000000-0000-0000-0000-000000000003",
          title: "Sharma Family Griha Pravesh",
          type: "housewarming",
          date: "2026-12-14",
          guests: 65,
          budget: 150000,
          city: "Bengaluru",
          created_at: new Date().toISOString(),
          plan: {
            budgetSplit: [
              { category: "Satyanarayan Pooja & Pandit", amount: 20000 },
              { category: "South Indian Banana Leaf Catering", amount: 60000 },
              { category: "Traditional Marigold Decor", amount: 35000 },
              { category: "Return Gifts (Brass Lamps)", amount: 25000 },
              { category: "Cleaning & Contingency", amount: 10000 },
            ],
            timeline: [
              { done: true },
              { done: false },
              { done: false },
            ],
          },
        },
      ]);
      setIsLoading(false);
    }

    loadEvents();
  }, []);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          date: date || undefined,
          guests: guests ? parseInt(guests) : undefined,
          budget: budget ? parseFloat(budget) : undefined,
          city: city || undefined,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        window.location.href = `/event/${created.id}`;
      } else {
        window.location.href = `/event/00000000-0000-0000-0000-000000000002`;
      }
    } catch {
      window.location.href = `/event/00000000-0000-0000-0000-000000000002`;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9FF] dark:bg-[#110D1E] text-[#1C1530] dark:text-[#FBF9FF]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
              Celebration Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3E68] dark:text-[#C9C1D4] mt-1">
              Track budgets, tasks, and vendor coordination across your events.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Celebration
          </Button>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 rounded-2xl bg-white/60 dark:bg-[#1B142F]/60 animate-pulse border border-[#E6DEFA] dark:border-[#2E234B]"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const daysLeft = event.date ? daysUntil(event.date) : null;
              const tasks = event.plan?.timeline || [];
              const completedTasks = tasks.filter((t: any) => t.done).length;
              const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

              return (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  className="group block p-6 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] hover:border-[#C2185B] dark:hover:border-[#E03D80] shadow-xs hover:shadow-md transition-all space-y-4"
                >
                  {/* Top: Type badge & countdown */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="magenta" className="capitalize">
                      {event.type}
                    </Badge>
                    {daysLeft !== null && (
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                          daysLeft <= 7
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                            : "bg-[#FFF8E6] text-[#A07000] dark:bg-[#775400]/40 dark:text-[#FDE080]"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {daysLeft > 0
                          ? `${daysLeft} days left`
                          : daysLeft === 0
                          ? "Today!"
                          : `${Math.abs(daysLeft)} days ago`}
                      </span>
                    )}
                  </div>

                  {/* Title & Location */}
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF] group-hover:text-[#C2185B] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-[#4A3E68] dark:text-[#C9C1D4]">
                      {event.city && <span>{event.city}</span>}
                      {event.guests && <span>• {event.guests} guests</span>}
                    </div>
                  </div>

                  {/* Budget & Progress */}
                  <div className="pt-2 border-t border-[#E6DEFA] dark:border-[#2E234B] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Budget</span>
                      <span className="font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                        {event.budget ? formatCurrency(event.budget) : "Unset"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>Task Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#C2185B] to-[#F2A900] h-full rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Workspace Link CTA */}
                  <div className="pt-1 flex items-center justify-between text-xs font-semibold text-[#C2185B] dark:text-[#F48DB8]">
                    <span>Open Workspace</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* New Event Modal */}
        <Modal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          title="Create New Celebration"
          description="PlanPal will automatically generate an initial budget split, timeline, and vendor checklist."
        >
          <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
            <Input
              label="Event Name"
              required
              placeholder="e.g. Maya & Rohit's Sangeet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3E68] dark:text-[#C9C1D4] mb-1.5">
                Celebration Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-xl border border-[#E6DEFA] bg-white px-3.5 py-2.5 text-sm text-[#1C1530] focus:border-[#C2185B] focus:outline-none dark:border-[#2E234B] dark:bg-[#1B142F] dark:text-[#FBF9FF] min-h-[44px]"
              >
                <option value="birthday">Milestone Birthday</option>
                <option value="wedding">Wedding / Pre-Wedding</option>
                <option value="housewarming">Housewarming (Griha Pravesh)</option>
                <option value="festival">Festival Celebration</option>
                <option value="community">Community / Colony Event</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                label="City"
                placeholder="e.g. Hyderabad"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Guest Count"
                type="number"
                placeholder="40"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
              <Input
                label="Total Budget (₹)"
                type="number"
                placeholder="80000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsNewModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isCreating}>
                Create Plan & Open Workspace
              </Button>
            </div>
          </form>
        </Modal>
      </main>

      <Footer />
    </div>
  );
}
