"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PlanPanel } from "@/components/plan/PlanPanel";
import { Navbar } from "@/components/layout/Navbar";
import { Plan } from "@/lib/schemas/plan";
import { ChatMessage } from "@/components/chat/MessageBubble";
import { MessageSquare, LayoutList, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EventWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [shareToken, setShareToken] = useState<string>("");
  const [changes, setChanges] = useState<string[]>([]);
  const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);

  // Mobile bottom-tab state ('chat' | 'plan')
  const [mobileTab, setMobileTab] = useState<"chat" | "plan">("plan");

  useEffect(() => {
    async function loadEventData() {
      if (!eventId) return;
      setIsLoadingEvent(true);
      try {
        const res = await fetch(`/api/events?id=${eventId}`);
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setPlan(data.plan);
            setShareToken(data.share_token || "");
          }
        }
      } catch (err) {
        console.warn("Could not load event:", err);
      } finally {
        // Fallback default sample plan if empty
        setPlan((prev) =>
          prev || {
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
              { time: "05:00 PM", activity: "Venue decor & lighting final setup", vendor: "Utsav Blooms", contact: "Suresh (+91 98765 22222)", notes: "Ensure photo wall lights work" },
              { time: "06:30 PM", activity: "Welcome drinks & live chaat counter open", vendor: "Royal Nawabi Caterers", contact: "Mohan Lead Waiter", notes: "Mocktails iced and ready" },
              { time: "07:30 PM", activity: "Guest arrivals & photo booth sessions", vendor: "Frames by Arjun", contact: "Arjun Photographer", notes: "Capture family portraits" },
              { time: "08:15 PM", activity: "Surprise video screening & Cake Cutting", vendor: "Cake Delight", contact: "Host", notes: "Sparklers handed to guests" },
              { time: "08:45 PM", activity: "Dinner Buffet & Bollywood Dance", vendor: "DJ Setup", contact: "DJ Sunny", notes: "Hot biryani served" },
            ],
          }
        );
        setIsLoadingEvent(false);
      }
    }

    loadEventData();
  }, [eventId]);

  const handlePlanUpdated = (newPlan: Plan, detectedChanges: string[]) => {
    setPlan(newPlan);
    setChanges(detectedChanges);
    // On mobile, if chat updated the plan, switch to plan tab to see results
    if (window.innerWidth < 800) {
      setMobileTab("plan");
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FBF9FF] dark:bg-[#110D1E]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C2185B]" />
          <p className="text-sm font-medium text-[#4A3E68] dark:text-[#C9C1D4]">
            Loading your celebration workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#FBF9FF] dark:bg-[#110D1E]">
      <Navbar />

      {/* Workspace Split Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left 40%: Chat Panel */}
        <div
          className={`w-full md:w-[40%] md:flex flex-col h-full ${
            mobileTab === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatPanel
            eventId={eventId}
            initialMessages={messages}
            onPlanUpdated={handlePlanUpdated}
            isUpdatingPlan={isUpdatingPlan}
            setIsUpdatingPlan={setIsUpdatingPlan}
          />
        </div>

        {/* Right 60%: Live Plan Panel */}
        <div
          className={`w-full md:w-[60%] md:flex flex-col h-full bg-[#FBF9FF] dark:bg-[#110D1E] ${
            mobileTab === "plan" ? "flex" : "hidden md:flex"
          }`}
        >
          {plan && (
            <PlanPanel
              eventId={eventId}
              plan={plan}
              shareToken={shareToken || eventId}
              changes={changes}
              isUpdating={isUpdatingPlan}
              onPlanChange={(updated) => setPlan(updated)}
            />
          )}
        </div>

        {/* Mobile Bottom-Tab Navigator (<800px) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#1B142F]/95 backdrop-blur-md border-t border-[#E6DEFA] dark:border-[#2E234B] flex h-16 items-center justify-around px-4 shadow-lg">
          <button
            onClick={() => setMobileTab("chat")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[44px] transition-colors ${
              mobileTab === "chat"
                ? "text-[#C2185B] font-bold"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[11px]">AI Chat</span>
          </button>

          <button
            onClick={() => setMobileTab("plan")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 min-h-[44px] transition-colors relative ${
              mobileTab === "plan"
                ? "text-[#C2185B] font-bold"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <LayoutList className="w-5 h-5" />
            <span className="text-[11px]">Live Plan</span>
            {isUpdatingPlan && (
              <span className="absolute top-2 right-10 w-2 h-2 rounded-full bg-[#F2A900] animate-ping" />
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
