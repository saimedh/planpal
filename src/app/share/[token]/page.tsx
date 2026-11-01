"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Share2, Download, Calendar, Users, MapPin, IndianRupee, Sparkles, MessageSquare, Utensils, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, generateWhatsAppLink } from "@/lib/utils";
import { exportPlanToPdf } from "@/lib/pdf/export";
import { Plan } from "@/lib/schemas/plan";
import { BudgetChart } from "@/components/plan/budget/BudgetChart";
import { MenuSection } from "@/components/plan/ideas/MenuSection";

export default function PublicSharePage() {
  const params = useParams();
  const token = params.token as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    // For demo / test, populate complete celebration plan
    setPlan({
      title: "Priya's 30th Birthday Bash",
      eventType: "birthday",
      date: "2026-11-30",
      guests: 40,
      budget: 80000,
      city: "Hyderabad",
      theme: "Bollywood Glam & Marigold Glow",
      language: "en",
      budgetSplit: [
        { category: "Venue & Lawn", amount: 20000, description: "Boutique banquet lawn in Jubilee Hills" },
        { category: "Food & Mocktails", amount: 25000, description: "Hyderabadi Veg Buffet + Biryani + Chaat counter" },
        { category: "Floral & Fairy Decor", amount: 10000, description: "Marigold photo backdrop & brass urlis" },
        { category: "Candid Photography", amount: 8000, description: "3 hours coverage + digital album" },
        { category: "DJ & Sound Setup", amount: 5000, description: "Bollywood dance playlist & karaoke mic" },
        { category: "Custom 2-Tier Cake", amount: 4000, description: "Belgian Chocolate truffle theme cake" },
        { category: "Return Gifts & Favors", amount: 5000, description: "Customized scented candles & sweets" },
        { category: "Miscellaneous Contingency", amount: 3000, description: "Last minute tips and transport" },
      ],
      timeline: [
        { task: "Shortlist & lock venue lawn in Hyderabad", dueDate: "2026-11-05", assignee: "Host", done: true, reminder: false },
        { task: "Taste test catering menu & confirm live counter", dueDate: "2026-11-12", assignee: "Priya", done: false, reminder: true },
        { task: "Send digital WhatsApp invitations in English & Telugu", dueDate: "2026-11-15", assignee: "Co-host", done: false, reminder: true },
        { task: "Finalize cake design & flavor with baker", dueDate: "2026-11-20", assignee: "Host", done: false, reminder: false },
        { task: "Coordinate sound system & playlist for Bollywood trivia", dueDate: "2026-11-25", assignee: "DJ Lead", done: false, reminder: true },
      ],
      vendors: [
        { type: "Catering", name: "Royal Nawabi Caterers", phone: "+91 98765 11111", status: "quoted", quote: 25000, notes: "Includes live Dosa & Chaat counter", priceRange: "₹500-700/plate" },
        { type: "Decor", name: "Utsav Blooms", phone: "+91 98765 22222", status: "booked", quote: 10000, notes: "Yellow marigold + fairy lights entrance", priceRange: "₹8,000-15,000" },
        { type: "Photography", name: "Frames by Arjun", phone: "+91 98765 33333", status: "to_contact", quote: 8000, notes: "Need reels + candid shots", priceRange: "₹6,000-12,000" },
        { type: "Baker", name: "Cake Delight Hyderabad", phone: "+91 98765 44444", status: "quoted", quote: 4000, notes: "Eggless chocolate truffle", priceRange: "₹1,000/kg" },
      ],
      ideas: {
        menu: [
          { name: "Paneer Tikka Angara", category: "Starters", isVeg: true, isJain: false, isVegan: false },
          { name: "Crispy Corn & Waterchestnut", category: "Starters", isVeg: true, isJain: true, isVegan: true },
          { name: "Hyderabadi Veg Dum Biryani & Mirchi Ka Salan", category: "Mains", isVeg: true, isJain: false, isVegan: false },
          { name: "Paneer Butter Masala & Naan", category: "Mains", isVeg: true, isJain: false, isVegan: false },
          { name: "Live Pani Puri Counter", category: "Live Counters", isVeg: true, isJain: true, isVegan: true },
          { name: "Gulab Jamun with Rabdi", category: "Desserts", isVeg: true, isJain: false, isVegan: false },
        ],
        games: ["Bollywood Dialogue Dumb Charades", "Rapid Fire 'Who Knows Priya Best'", "Musical Hookstep Challenge"],
        surprise: "Surprise video montage of childhood photos and wishes from friends abroad played right before the cake cutting!",
        themes: ["Bollywood Retro Glam (Gold & Magenta)", "Traditional Marigold & Brass Chic"],
        decor: ["Brass urli centerpieces with floating marigolds & candles", "Fairy lights canopy over dining area", "Bollywood photo booth frame"],
        invitationText: {
          en: "✨ Priya is turning 30! Join us for an evening of Bollywood music, delicious food, and celebration on Nov 30, 7 PM at Jubilee Hills, Hyderabad. Dress code: Festive Glam!",
          hi: "✨ प्रिया का 30वां जन्मदिन! 30 नवंबर, शाम 7 बजे जुबली हिल्स, हैदराबाद में संगीत, स्वादिष्ट भोजन और खुशियों के इस उत्सव में सादर आमंत्रित हैं।",
          te: "✨ ప్రియా 30వ పుట్టినరోజు వేడుక! నవంబర్ 30న సాయంత్రం 7 గంటలకు జూబ్లీహిల్స్, హైదరాబాద్‌లో జరిగే ఈ వేడుకకు మీరందరూ సాదరంగా ఆహ్వానితులు!",
        },
      },
      runSheet: [
        { time: "05:00 PM", activity: "Venue decor & lighting final setup", vendor: "Utsav Blooms", contact: "Suresh", notes: "Ensure photo wall lights work" },
        { time: "06:30 PM", activity: "Welcome drinks & live chaat counter open", vendor: "Royal Nawabi Caterers", contact: "Mohan Lead Waiter", notes: "Mocktails iced and ready" },
        { time: "07:30 PM", activity: "Guest arrivals & photo booth sessions", vendor: "Frames by Arjun", contact: "Arjun Photographer", notes: "Capture family portraits" },
        { time: "08:15 PM", activity: "Surprise video screening & Cake Cutting", vendor: "Cake Delight", contact: "Host", notes: "Sparklers handed to guests" },
        { time: "08:45 PM", activity: "Dinner Buffet & Bollywood Dance", vendor: "DJ Setup", contact: "DJ Sunny", notes: "Hot biryani served" },
      ],
    });
    setIsLoading(false);
  }, [token]);

  const handleExport = async () => {
    setIsExporting(true);
    await exportPlanToPdf("public-plan-view", "Celebration_Plan.pdf");
    setIsExporting(false);
  };

  const shareText = `🎉 Viewing ${plan?.title || "our celebration plan"} on PlanPal: ${typeof window !== "undefined" ? window.location.href : ""}`;
  const whatsappUrl = generateWhatsAppLink(shareText);

  if (isLoading || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9FF] dark:bg-[#110D1E]">
        <p className="text-sm text-gray-500">Loading celebration plan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9FF] dark:bg-[#110D1E] text-[#1C1530] dark:text-[#FBF9FF]">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#1B142F]/90 backdrop-blur-md border-b border-[#E6DEFA] dark:border-[#2E234B] px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C2185B] to-[#F2A900] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-heading font-bold text-base">PlanPal Shared Plan</span>
            <Badge variant="magenta" className="hidden sm:inline-block">
              Read-Only
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExport}
              isLoading={isExporting}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="public-plan-view" className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Event Header */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold text-[#C2185B] dark:text-[#F48DB8] tracking-wider">
                {plan.eventType} Celebration
              </span>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF] mt-1">
                {plan.title}
              </h1>
            </div>

            {plan.budget && (
              <div className="text-right">
                <span className="text-[11px] text-gray-400 block">Total Budget</span>
                <span className="text-xl font-heading font-bold text-[#C2185B] dark:text-[#F48DB8]">
                  {formatCurrency(plan.budget)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[#4A3E68] dark:text-[#C9C1D4] flex-wrap pt-2 border-t border-[#E6DEFA] dark:border-[#2E234B]">
            {plan.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C2185B]" />
                <span>{formatDate(plan.date)}</span>
              </div>
            )}
            {plan.guests && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>{plan.guests} Guests</span>
              </div>
            )}
            {plan.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{plan.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Budget Split Section */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
            Budget Allocation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B]">
              <BudgetChart budgetSplit={plan.budgetSplit} />
            </div>
            <div className="space-y-2">
              {plan.budgetSplit.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                      {item.category}
                    </span>
                    {item.description && (
                      <p className="text-[10px] text-gray-400">{item.description}</p>
                    )}
                  </div>
                  <span className="font-bold text-[#C2185B] dark:text-[#F48DB8]">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Schedule */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
            Planning Timeline
          </h2>
          <div className="space-y-2">
            {plan.timeline.map((task, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      task.done ? "text-emerald-600" : "text-gray-300"
                    }`}
                  />
                  <span className={task.done ? "line-through text-gray-400" : "font-medium"}>
                    {task.task}
                  </span>
                </div>
                {task.dueDate && (
                  <span className="text-gray-400">{formatDate(task.dueDate)}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Menu Section */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
            Celebration Menu
          </h2>
          <MenuSection menu={plan.ideas.menu || []} />
        </section>

        {/* Day-of Run Sheet */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
            Event Day Run Sheet
          </h2>
          <div className="space-y-2">
            {plan.runSheet.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#C2185B] dark:text-[#F48DB8] bg-[#FDE4EF] dark:bg-[#5C0B28]/40 px-2 py-0.5 rounded">
                    {item.time}
                  </span>
                  <span className="font-semibold">{item.activity}</span>
                </div>
                {item.vendor && (
                  <span className="text-gray-400">
                    Coordinator: {item.vendor} {item.contact && `(${item.contact})`}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
