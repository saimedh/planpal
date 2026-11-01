"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  IndianRupee,
  Users,
  CheckCircle2,
  MessageSquare,
  ShieldCheck,
  Heart,
  Share2,
  Download,
  ChevronDown,
  ExternalLink,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState(
    "Plan my sister's 30th birthday, 40 guests, ₹80,000, Hyderabad"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeOccasionFilter, setActiveOccasionFilter] = useState("all");
  const [isCheaperMode, setIsCheaperMode] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCreatePlan = async (customPrompt?: string) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let type: "wedding" | "birthday" | "housewarming" | "festival" | "community" = "birthday";
      const p = textToUse.toLowerCase();
      if (p.includes("wedding") || p.includes("sangeet") || p.includes("mehendi") || p.includes("shaadi")) {
        type = "wedding";
      } else if (p.includes("housewarming") || p.includes("griha") || p.includes("pooja")) {
        type = "housewarming";
      } else if (p.includes("diwali") || p.includes("festival") || p.includes("ganesh") || p.includes("holi")) {
        type = "festival";
      } else if (p.includes("colony") || p.includes("community") || p.includes("neighbourhood")) {
        type = "community";
      }

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "My Indian Celebration Plan",
          type,
          city: "Hyderabad",
          budget: 80000,
          guests: 40,
        }),
      });

      if (res.ok) {
        const event = await res.json();
        router.push(`/event/${event.id}`);
      } else {
        router.push("/event/00000000-0000-0000-0000-000000000002");
      }
    } catch {
      router.push("/event/00000000-0000-0000-0000-000000000002");
    } finally {
      setIsSubmitting(false);
    }
  };

  const occasions = [
    {
      id: "birthday",
      title: "A marigold milestone",
      type: "Birthday",
      details: "Hyderabad · 40 guests · Warm lights, memory wall and a relaxed dinner.",
      budget: "₹80,000",
      notes: "45% food, 25% venue, 15% decor and 15% for extras and contingency.",
    },
    {
      id: "wedding",
      title: "An intimate wedding, a big heart",
      type: "Wedding",
      details: "Vijayawada · 100 guests · Jasmine, silk accents and a family-style feast.",
      budget: "₹5,00,000",
      notes: "45% food, 25% venue, 15% decor and 15% for extras and contingency.",
    },
    {
      id: "housewarming",
      title: "New keys, familiar faces",
      type: "Housewarming",
      details: "Bengaluru · 30 guests · A peaceful puja and a warm homemade lunch.",
      budget: "₹45,00,000",
      notes: "45% food, 25% venue, 15% decor and 15% for extras and contingency.",
    },
    {
      id: "festival",
      title: "A courtyard full of light",
      type: "Festival",
      details: "Delhi · 60 guests · Diyas, mithai and a welcoming neighbourhood evening.",
      budget: "₹60,000",
      notes: "45% food, 25% venue, 15% decor and 15% for extras and contingency.",
    },
    {
      id: "community",
      title: "The neighbourhood comes together",
      type: "Community",
      details: "Hyderabad · 120 guests · Potluck tables, local talent and shared stories.",
      budget: "₹90,000",
      notes: "45% food, 25% venue, 15% decor and 15% for extras and contingency.",
    },
  ];

  const filteredOccasions =
    activeOccasionFilter === "all"
      ? occasions
      : occasions.filter((o) => o.id === activeOccasionFilter);

  const faqs = [
    {
      q: "Does PlanPal book vendors for me?",
      a: "PlanPal generates vendor briefs, realistic price estimates for your city, and drafts 1-click WhatsApp inquiry messages so you can contact and negotiate with vendors directly without broker fees.",
    },
    {
      q: "Can I plan in Hindi or Telugu?",
      a: "Yes! PlanPal understands and responds in English, हिंदी, and తెలుగు (including Hinglish and Tenglish). It also drafts digital invitations in all three languages.",
    },
    {
      q: "Are these prices guaranteed?",
      a: "The prices are realistic market benchmarks calibrated across major Indian cities (Hyderabad, Mumbai, Delhi, Bengaluru, Chennai). Final vendor rates depend on your chosen date, venue, and seasonal demand.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9FF] dark:bg-[#1C1530] text-[#1C1530] dark:text-[#FBF9FF]">
      <Navbar />

      {/* Hero Section - Matching Framer Enchanting Millions */}
      <section className="relative pt-16 pb-20 px-4 sm:px-8 text-center max-w-5xl mx-auto space-y-6">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] text-[#62596F] dark:text-[#C9BEDB] text-[11px] font-bold tracking-widest uppercase shadow-2xs">
          <span>YOUR AI PLANNING PAL. YOUR KIND OF CELEBRATION.</span>
        </div>

        {/* H1 Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-medium tracking-tight text-[#1C1530] dark:text-[#FBF9FF] leading-[1.08] max-w-4xl mx-auto">
          Plan any celebration by just chatting.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#62596F] dark:text-[#C9BEDB] max-w-2xl mx-auto font-normal leading-relaxed">
          Big family moments. Tiny details. Tell PlanPal what you’re celebrating,
          and turn a little conversation into a plan that feels like you.
        </p>

        {/* Hero CTA & Trust Badge */}
        <div className="pt-2 flex flex-col items-center gap-3">
          <button
            onClick={() => handleCreatePlan()}
            className="px-8 py-4 rounded-2xl bg-[#C2185B] hover:bg-[#A3134C] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            Let’s plan something lovely
          </button>
          <span className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
            Free to start · No spreadsheets · All the happy chaos, handled
          </span>
        </div>
      </section>

      {/* The Planning Playground Section - Framer Interactive Simulation */}
      <section id="how-it-works" className="py-12 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
            THE PLANNING PLAYGROUND
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            A little chat. A big celebration.
          </h2>
        </div>

        {/* Interactive Chat + Plan Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-sm">
          {/* Left: Chat Side (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 border-b lg:border-b-0 lg:border-r border-[#E4DEF2] dark:border-[#493D5C] lg:pr-6 pb-6 lg:pb-0">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-[#1C1530] dark:text-[#FBF9FF]">
                    Hi, I’m PlanPal.
                  </span>
                  <span className="text-xs text-[#C2185B] dark:text-[#F66DA5]">What are we celebrating?</span>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                  A birthday? A new beginning? Tell me a little, and we’ll make it special.
                </p>
              </div>

              {/* Sample Prompt Pill to click */}
              <button
                type="button"
                onClick={() => setPrompt("Plan my sister's 30th birthday, 40 guests, ₹80,000, Hyderabad")}
                className="w-full text-left p-3.5 rounded-2xl bg-[#FDF2F7] dark:bg-[#360418]/40 border border-[#F9C5DC] dark:border-[#7E0D3A] text-xs font-medium text-[#C2185B] dark:text-[#F66DA5] hover:border-[#C2185B] transition-colors cursor-pointer flex items-center justify-between"
              >
                <span>&ldquo;Plan my sister&apos;s 30th birthday, 40 guests, ₹80,000, Hyderabad&rdquo;</span>
                <Sparkles className="w-4 h-4 shrink-0 text-[#F2A900]" />
              </button>
              <p className="text-[11px] text-gray-400 italic">
                Tap the prompt to watch your plan come together.
              </p>
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreatePlan();
              }}
              className="space-y-2 pt-2"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Tell PlanPal your celebration..."
                  className="w-full rounded-2xl border border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530] px-4 py-3 text-xs text-[#1C1530] dark:text-[#FBF9FF] focus:outline-none focus:border-[#C2185B]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-[#C2185B] hover:bg-[#A3134C] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? "Opening Workspace..." : "Plan celebration"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Right: Plan Outcome Preview (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4 lg:pl-2">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DEF2] dark:border-[#493D5C]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B] dark:text-[#F66DA5]">
                    AI Generated Plan
                  </span>
                  <h3 className="font-heading font-semibold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
                    One lovely birthday, coming up.
                  </h3>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFF9E6] text-[#C78700] dark:bg-[#452A00]/50 dark:text-[#FCD563] border border-[#FFF0BF]">
                  ₹80,000 Total
                </span>
              </div>

              {/* 4 Feature Pill Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
                <div className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] text-center">
                  <span className="text-[10px] font-bold text-[#1C1530] dark:text-[#FBF9FF] block">
                    Budget split
                  </span>
                  <span className="text-[9px] text-[#62596F] dark:text-[#C9BEDB]">Balanced 100%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] text-center">
                  <span className="text-[10px] font-bold text-[#1C1530] dark:text-[#FBF9FF] block">
                    Smart timeline
                  </span>
                  <span className="text-[9px] text-[#62596F] dark:text-[#C9BEDB]">Backward planned</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] text-center">
                  <span className="text-[10px] font-bold text-[#1C1530] dark:text-[#FBF9FF] block">
                    Vendor checklist
                  </span>
                  <span className="text-[9px] text-[#62596F] dark:text-[#C9BEDB]">City price rates</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] text-center">
                  <span className="text-[10px] font-bold text-[#1C1530] dark:text-[#FBF9FF] block">
                    Personalised ideas
                  </span>
                  <span className="text-[9px] text-[#62596F] dark:text-[#C9BEDB]">Curated menu</span>
                </div>
              </div>

              {/* Sample Budget allocation bar */}
              <div className="mt-4 p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                    Hyderabad 40-Guest Split
                  </span>
                  <span className="text-gray-400">Venue · Decor · Food</span>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden gap-1">
                  <div className="bg-[#C2185B] w-[25%]" title="Venue ₹20,000" />
                  <div className="bg-[#F2A900] w-[15%]" title="Decor ₹12,000" />
                  <div className="bg-[#493D5C] w-[45%]" title="Food ₹36,000" />
                  <div className="bg-[#C9BEDB] w-[15%]" title="Contingency ₹12,000" />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500 pt-1">
                  <span>Venue: ₹20,000</span>
                  <span>Decor: ₹12,000</span>
                  <span>Food: ₹36,000</span>
                  <span>Buffer: ₹12,000</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleCreatePlan()}
                className="text-xs font-bold text-[#C2185B] dark:text-[#F66DA5] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open full interactive workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Pillars: "THE DETAILS? CONSIDER THEM HANDLED." */}
      <section id="features" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-10">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
            THE DETAILS? CONSIDER THEM HANDLED.
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            A clear plan. A lighter mind.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#C2185B] dark:text-[#F66DA5] tracking-wider">
                01 / EVERY RUPEE, A PURPOSE
              </span>
              <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Budget split
              </h3>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                From the big feast to the little extras. A practical split, with room to breathe.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E4DEF2] dark:border-[#493D5C]">
              <span className="text-[11px] font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                Sums to exact 100%
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#C2185B] dark:text-[#F66DA5] tracking-wider">
                02 / ONE THING AT A TIME
              </span>
              <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Smart timeline
              </h3>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                Know what to book, when to follow up and what can wait. No last-minute scramble.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E4DEF2] dark:border-[#493D5C]">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F3EEFF] dark:bg-[#1C1530] text-[#C2185B] dark:text-[#F66DA5]">
                Today: shortlist your venue
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#C2185B] dark:text-[#F66DA5] tracking-wider">
                03 / NOTHING SLIPS THROUGH
              </span>
              <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Vendor checklist
              </h3>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                Caterer, flowers, photographer. The right questions to ask before paying a deposit.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E4DEF2] dark:border-[#493D5C]">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF9E6] text-[#C78700] dark:bg-[#452A00]/50 dark:text-[#FCD563]">
                Catering brief: ready to share
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-[#C2185B] dark:text-[#F66DA5] tracking-wider">
                04 / UNMISTAKABLY YOU
              </span>
              <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Personalised ideas
              </h3>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                Local flavours, family traditions and themes that feel personal, not copied.
              </p>
            </div>
            <div className="pt-3 border-t border-[#E4DEF2] dark:border-[#493D5C]">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF2F7] text-[#C2185B] dark:bg-[#360418] dark:text-[#F66DA5]">
                Marigold & memories
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* "Your budget isn't a barrier" Section - Framer Interactive Rebalance */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
                BUDGET ADAPTABILITY
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                Your budget isn’t a barrier.
              </h2>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] mt-1">
                Same happy memories. Less spend.
              </p>
            </div>

            {/* Interactive "Make it cheaper" Button */}
            <button
              onClick={() => setIsCheaperMode(!isCheaperMode)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 ${
                isCheaperMode
                  ? "bg-[#F2A900] text-[#1C1530]"
                  : "bg-[#1C1530] text-white hover:bg-[#2A213D] dark:bg-white dark:text-[#1C1530]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCheaperMode ? "✓ Budget Reduced (₹50k)" : "Make it cheaper"}</span>
            </button>
          </div>

          {/* Budget allocation numbers comparison */}
          <div className="p-6 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                {isCheaperMode ? "Optimized ₹50,000 Budget" : "Standard ₹80,000 Budget"}
              </span>
              <span className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                {isCheaperMode
                  ? "Venue ₹14,000 · Decor ₹8,000 · Food ₹28,000"
                  : "Venue ₹20,000 · Decor ₹12,000 · Food ₹36,000"}
              </span>
            </div>

            <div className="flex h-3 rounded-full overflow-hidden gap-1 transition-all">
              <div
                className="bg-[#C2185B] transition-all duration-500"
                style={{ width: isCheaperMode ? "28%" : "25%" }}
              />
              <div
                className="bg-[#F2A900] transition-all duration-500"
                style={{ width: isCheaperMode ? "16%" : "15%" }}
              />
              <div
                className="bg-[#493D5C] transition-all duration-500"
                style={{ width: isCheaperMode ? "56%" : "45%" }}
              />
              {!isCheaperMode && <div className="bg-[#C9BEDB] w-[15%]" />}
            </div>

            <p className="text-[11px] text-[#62596F] dark:text-[#C9BEDB] italic">
              {isCheaperMode
                ? "“Swapped exotic blooms for local marigold garlands and opted for live chaat & dosa counters instead of a 6-course heavy gravy spread!”"
                : "“A practical split with room for live chaat counters and photography coverage.”"}
            </p>
          </div>
        </div>
      </section>

      {/* "Every occasion has its own kind of magic" (Examples Section) */}
      <section id="examples" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
            CURATED CELEBRATION EXAMPLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            Every occasion has its own kind of magic.
          </h2>
          <p className="text-xs sm:text-sm text-[#62596F] dark:text-[#C9BEDB]">
            Explore sample plans built for real-life budgets and Indian celebrations.
          </p>
        </div>

        {/* Occasion Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {["all", "birthday", "wedding", "housewarming", "festival", "community"].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setActiveOccasionFilter(filterKey)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                activeOccasionFilter === filterKey
                  ? "bg-[#1C1530] text-white dark:bg-white dark:text-[#1C1530] shadow-xs"
                  : "bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
              }`}
            >
              {filterKey === "all" ? "All occasions" : filterKey}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOccasions.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2185B] dark:text-[#F66DA5]">
                    {item.type}
                  </span>
                  <span className="text-sm font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    {item.budget}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1C1530] dark:text-[#FBF9FF]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed">
                  {item.details}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4DEF2] dark:border-[#493D5C] flex items-center justify-between">
                <span className="text-[10px] text-gray-400">{item.notes}</span>
                <button
                  onClick={() => handleCreatePlan(`Plan ${item.title}, ${item.details}, budget ${item.budget}`)}
                  className="text-xs font-bold text-[#C2185B] dark:text-[#F66DA5] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <span>Use plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "A plan everyone can be part of" - WhatsApp Preview Mockup */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
              LESS “WHAT’S THE PLAN?” IN THE GROUP CHAT.
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
              A plan everyone can be part of.
            </h2>
            <p className="text-xs sm:text-sm text-[#62596F] dark:text-[#C9BEDB] max-w-xl mx-auto">
              From the cousins’ group to the family elders, bring everyone onto the same page.
              Share a simple summary on WhatsApp and let the happy anticipation begin.
            </p>
          </div>

          {/* WhatsApp Message Card Simulation */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#EFEAE2] dark:bg-[#1B2428] border border-[#D1D7DB] dark:border-[#2A3942] space-y-3 font-sans shadow-inner">
            <div className="flex items-center gap-2 pb-2 border-b border-black/10 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>The Birthday Crew (Family Group)</span>
            </div>

            {/* Bubble 1: Shared summary */}
            <div className="p-3 rounded-2xl rounded-tl-xs bg-white dark:bg-[#202C33] text-xs text-gray-800 dark:text-gray-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                PlanPal Shared Celebration
              </span>
              <p>
                🎉 40 of her favourite people. A marigold evening. ₹80,000, all planned. Let’s make it a surprise!
              </p>
              <span className="text-[9px] text-gray-400 block text-right">07:45 PM ✓✓</span>
            </div>

            {/* Bubble 2: Amma reply */}
            <div className="p-3 rounded-2xl rounded-tr-xs bg-[#D9FDD3] dark:bg-[#005C4B] text-xs text-gray-800 dark:text-gray-100 shadow-2xs self-end ml-10 space-y-0.5">
              <p className="font-medium">
                “I’ll bring the photo albums! — Amma”
              </p>
              <span className="text-[9px] text-gray-500 dark:text-gray-300 block text-right">07:47 PM ✓✓</span>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => handleCreatePlan()}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share a sample on WhatsApp</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Quote */}
      <section className="py-12 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-3">
        <blockquote className="text-xl sm:text-2xl font-heading italic text-[#1C1530] dark:text-[#FBF9FF] leading-relaxed">
          &ldquo;For once, I spent more time with my family than with my spreadsheet.&rdquo;
        </blockquote>
        <p className="text-xs text-[#62596F] dark:text-[#C9BEDB] font-medium">
          Ananya · A milestone birthday in Hyderabad · Sample story
        </p>
      </section>

      {/* FAQ Accordions: "A few things you might be wondering." */}
      <section className="py-16 px-4 sm:px-8 max-w-3xl mx-auto w-full space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#C2185B] dark:text-[#F66DA5]">
            FAQS
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            A few things you might be wondering.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-5 text-left text-xs sm:text-sm font-semibold text-[#1C1530] dark:text-[#FBF9FF] flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    openFaq === i ? "rotate-180 text-[#C2185B]" : "text-gray-400"
                  }`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-xs text-[#62596F] dark:text-[#C9BEDB] leading-relaxed border-t border-[#E4DEF2]/50 dark:border-[#493D5C]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-tr from-[#1C1530] via-[#2A213D] to-[#1C1530] text-white text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold leading-tight">
            You bring the occasion. We’ll bring the plan.
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
            Less planning. More celebrating. Made for the way India celebrates.
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleCreatePlan()}
              className="px-8 py-4 rounded-2xl bg-[#C2185B] hover:bg-[#A3134C] text-white text-sm font-bold shadow-xl transition-all cursor-pointer"
            >
              Start your celebration
            </button>
          </div>
        </div>
      </section>

      {/* Framer Connection Footer info */}
      <div className="py-4 text-center border-t border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530] text-[11px] text-gray-400">
        Connected to Framer design:{" "}
        <a
          href="https://enchanting-millions-849878.framer.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#C2185B] dark:text-[#F66DA5] hover:underline font-semibold"
        >
          enchanting-millions-849878.framer.app
        </a>
      </div>

      <Footer />
    </div>
  );
}
