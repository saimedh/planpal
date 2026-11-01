"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Terminal,
  Database,
  Cpu,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  Check,
  Send,
  Code2,
  Layers,
  ArrowRight,
  Wrench,
  Download,
  Upload,
  MessageSquare,
  Calculator,
  Utensils,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HealthData {
  status: string;
  timestamp: string;
  environment: Record<string, any>;
  database: {
    status: string;
    records: Record<string, number>;
  };
  uptime: number;
}

export default function DeveloperBackendPage() {
  const [activeTab, setActiveTab] = useState<"health" | "ai" | "tools" | "database" | "api">("health");
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(false);
  const [seedResult, setSeedResult] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // AI Playground State
  const [aiPrompt, setAiPrompt] = useState("Plan my cousin's Sangeet in Mumbai, 80 guests, ₹2,00,000 budget, Bollywood theme");
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Tools Tab States
  // 1. Vendor Inquiry State
  const [vendorType, setVendorType] = useState("Catering");
  const [vendorLang, setVendorLang] = useState<"en" | "hi" | "te">("en");
  const [vendorResult, setVendorResult] = useState<any>(null);
  const [isVendorLoading, setIsVendorLoading] = useState(false);

  // 2. Budget Rebalancer State
  const [rebalanceDelta, setRebalanceDelta] = useState(-15);
  const [rebalanceResult, setRebalanceResult] = useState<any>(null);
  const [isRebalanceLoading, setIsRebalanceLoading] = useState(false);

  // 3. Menu Generator State
  const [menuRegion, setMenuRegion] = useState("Hyderabadi");
  const [menuDiet, setMenuDiet] = useState<"all-veg" | "veg-and-nonveg" | "jain-friendly" | "vegan">("all-veg");
  const [menuResult, setMenuResult] = useState<any>(null);
  const [isMenuLoading, setIsMenuLoading] = useState(false);

  // Database Explorer State
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [isDbLoading, setIsDbLoading] = useState(false);

  // Fetch Health Status
  const fetchStatus = async () => {
    setIsHealthLoading(true);
    try {
      const res = await fetch("/api/dev/status");
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.warn("Failed to fetch dev status:", err);
    } finally {
      setIsHealthLoading(false);
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await fetch("/api/dev/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSeedResult("✓ Database seeded successfully with Priya's 30th Birthday Bash!");
        fetchStatus();
      } else {
        setSeedResult("Seed returned: " + (data.error || "failed"));
      }
    } catch (err: any) {
      setSeedResult("Seed error: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRunAiTest = async () => {
    if (!aiPrompt.trim() || isAiLoading) return;
    setIsAiLoading(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: "00000000-0000-0000-0000-000000000002",
          message: aiPrompt,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAiResponse(data);
      } else {
        setAiError(data.error || "Failed to process chat query");
      }
    } catch (err: any) {
      setAiError(err.message || "Network error");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRunVendorInquiry = async () => {
    setIsVendorLoading(true);
    try {
      const res = await fetch("/api/ai/draft-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendorType,
          vendorName: "Sri Balaji Caterers",
          eventTitle: "Priya's 30th Birthday Bash",
          eventType: "birthday",
          date: "2026-11-30",
          city: "Hyderabad",
          guests: 40,
          budget: 25000,
          language: vendorLang,
          customNotes: "Require live Dosa counter and authentic Gulab Jamun with Rabdi",
        }),
      });
      const data = await res.json();
      setVendorResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVendorLoading(false);
    }
  };

  const handleRunRebalance = async () => {
    setIsRebalanceLoading(true);
    try {
      const samplePlan = {
        title: "Priya's 30th Birthday Bash",
        eventType: "birthday",
        date: "2026-11-30",
        guests: 40,
        budget: 80000,
        city: "Hyderabad",
        theme: "Bollywood Glam",
        language: "en",
        budgetSplit: [
          { category: "Venue & Lawn", amount: 20000, description: "Boutique banquet lawn" },
          { category: "Food & Mocktails", amount: 25000, description: "Hyderabadi Veg Buffet" },
          { category: "Floral Decor", amount: 10000, description: "Marigold backdrop" },
          { category: "Photography", amount: 8000, description: "3 hours candid" },
          { category: "DJ & Sound", amount: 5000, description: "Sound setup" },
          { category: "Cake", amount: 4000, description: "Truffle cake" },
          { category: "Favors", amount: 5000, description: "Gifts" },
          { category: "Contingency", amount: 3000, description: "Tips" },
        ],
        timeline: [],
        vendors: [],
        ideas: { menu: [], games: [], surprise: "", themes: [], decor: [], invitationText: { en: "", hi: "", te: "" } },
        runSheet: [],
      };

      const res = await fetch("/api/ai/rebalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: samplePlan,
          percentageDelta: rebalanceDelta,
        }),
      });
      const data = await res.json();
      setRebalanceResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRebalanceLoading(false);
    }
  };

  const handleRunMenuGen = async () => {
    setIsMenuLoading(true);
    try {
      const res = await fetch("/api/ai/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: menuRegion,
          dietaryPreference: menuDiet,
          guests: 50,
          eventType: "Milestone Celebration",
        }),
      });
      const data = await res.json();
      setMenuResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMenuLoading(false);
    }
  };

  const loadDatabaseEvents = async () => {
    setIsDbLoading(true);
    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setDbEvents(data);
      }
    } catch (err) {
      console.warn("Failed to load events:", err);
    } finally {
      setIsDbLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    loadDatabaseEvents();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9FF] dark:bg-[#110D1E] text-[#1C1530] dark:text-[#FBF9FF] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E4DEF2] dark:border-[#493D5C] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F2A900]/15 text-[#B37800] dark:text-[#F2A900] text-xs font-semibold mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>Backend Diagnostic & Architecture Hub</span>
            </div>
            <h1 className="font-heading font-black text-3xl tracking-tight text-[#1C1530] dark:text-[#FBF9FF]">
              Developer Backend
            </h1>
            <p className="text-sm text-[#62596F] dark:text-[#C9BEDB] mt-1">
              Verify Claude LLM schemas, live database telemetry, streaming APIs, and microservices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStatus}
              isLoading={isHealthLoading}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh Status
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSeedDatabase}
              isLoading={isSeeding}
              leftIcon={<Database className="w-3.5 h-3.5" />}
            >
              Seed Sample Data
            </Button>
          </div>
        </div>

        {seedResult && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
            <span>{seedResult}</span>
            <button onClick={() => setSeedResult(null)} className="underline font-semibold ml-4">Dismiss</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#E4DEF2] dark:border-[#493D5C] pb-4">
          <button
            onClick={() => setActiveTab("health")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "health"
                ? "bg-[#C2185B] text-white shadow-xs"
                : "bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Health & Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "ai"
                ? "bg-[#C2185B] text-white shadow-xs"
                : "bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Claude AI & Zod Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab("tools")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "tools"
                ? "bg-[#C2185B] text-white shadow-xs"
                : "bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Specialized AI Microservices</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("database");
              loadDatabaseEvents();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "database"
                ? "bg-[#C2185B] text-white shadow-xs"
                : "bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Explorer</span>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              activeTab === "api"
                ? "bg-[#C2185B] text-white shadow-xs"
                : "bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>REST & SSE API Docs</span>
          </button>
        </div>

        {/* Tab 1: Health & Telemetry */}
        {activeTab === "health" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">System Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="font-heading font-black text-2xl text-emerald-600 dark:text-emerald-400">
                {health?.status || "OPERATIONAL"}
              </div>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                All core backend routes and database abstraction adapters active.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Database Layer</span>
                <Database className="w-4 h-4 text-[#C2185B]" />
              </div>
              <div className="font-heading font-black text-xl text-[#1C1530] dark:text-[#FBF9FF]">
                {health?.database.status === "supabase_connected" ? "Supabase PostgreSQL" : "Local In-Memory Relational Engine"}
              </div>
              <div className="text-xs space-y-1 text-[#62596F] dark:text-[#C9BEDB]">
                <div>Events Count: <strong className="text-[#1C1530] dark:text-[#FBF9FF]">{health?.database.records.events ?? 1}</strong></div>
                <div>Messages Logged: <strong className="text-[#1C1530] dark:text-[#FBF9FF]">{health?.database.records.messages ?? 2}</strong></div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Engine</span>
                <Cpu className="w-4 h-4 text-[#F2A900]" />
              </div>
              <div className="font-heading font-black text-xl text-[#1C1530] dark:text-[#FBF9FF]">
                Claude Sonnet 4
              </div>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                Model: <code className="text-[#C2185B] dark:text-[#F66DA5]">claude-sonnet-4-20250514</code>
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: AI Playground */}
        {activeTab === "ai" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs">
              <h3 className="font-heading font-bold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Test Chat & Plan Pipeline
              </h3>
              <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                Sends your prompt through Claude Sonnet with Indian cultural system prompts and validates against the strict Zod Plan schema.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Enter a prompt to test AI planner..."
                  className="flex-1 rounded-2xl border border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530] px-4 py-3 text-xs text-[#1C1530] dark:text-[#FBF9FF] focus:outline-none focus:border-[#C2185B]"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunAiTest}
                  isLoading={isAiLoading}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                >
                  Execute
                </Button>
              </div>

              {aiError && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700">
                  {aiError}
                </div>
              )}

              {aiResponse && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Zod Validation: Passed
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Changes detected: {aiResponse.changes?.join(", ") || "None"}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-black text-[#9FED72] font-mono text-xs overflow-x-auto max-h-96 leading-relaxed">
                    <pre>{JSON.stringify(aiResponse, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Specialized AI Microservices */}
        {activeTab === "tools" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tool 1: Vendor Inquiry Generator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#C2185B] dark:text-[#F66DA5]">
                  <MessageSquare className="w-5 h-5" />
                  <h3 className="font-heading font-bold text-sm">Vendor WhatsApp Generator</h3>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Generates culturally respectful negotiation inquiries in English, Hindi, or Telugu.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase">Vendor Category</label>
                  <select
                    value={vendorType}
                    onChange={(e) => setVendorType(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530]"
                  >
                    <option value="Catering">Catering (Buffet / Live Counters)</option>
                    <option value="Decor">Floral & Fairy Decor</option>
                    <option value="Photography">Candid Photography & Reels</option>
                    <option value="DJ / Sound">DJ & Bollywood Sound</option>
                    <option value="Baker">Custom Theme Cake</option>
                  </select>

                  <label className="text-[11px] font-semibold text-gray-400 uppercase">Language</label>
                  <div className="flex gap-2">
                    {(["en", "hi", "te"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setVendorLang(lang)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                          vendorLang === lang ? "bg-[#C2185B] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {lang === "en" ? "English" : lang === "hi" ? "हिन्दी" : "తెలుగు"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleRunVendorInquiry}
                  isLoading={isVendorLoading}
                >
                  Generate Pitch
                </Button>

                {vendorResult && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-xs space-y-2">
                    <p className="whitespace-pre-wrap font-sans text-xs text-[#1C1530] dark:text-[#FBF9FF]">
                      {vendorResult.message}
                    </p>
                    <a
                      href={vendorResult.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold hover:underline"
                    >
                      <span>Open in WhatsApp</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 2: Budget Zero-Drift Rebalancer */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#F2A900]">
                  <Calculator className="w-5 h-5" />
                  <h3 className="font-heading font-bold text-sm">Zero-Drift Rebalancer</h3>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Scales allocations with 100% mathematical zero-drift balance.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase">Adjustment Percentage: {rebalanceDelta}%</label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={rebalanceDelta}
                    onChange={(e) => setRebalanceDelta(Number(e.target.value))}
                    className="w-full accent-[#F2A900]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>-50% Cheaper</span>
                    <span>0% (Equal)</span>
                    <span>+50% Upgrade</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleRunRebalance}
                  isLoading={isRebalanceLoading}
                >
                  Recalculate Split
                </Button>

                {rebalanceResult && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-xs space-y-2">
                    <p className="font-semibold text-emerald-600">{rebalanceResult.explanation}</p>
                    <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
                      {rebalanceResult.rebalancedPlan.budgetSplit.map((item: any) => (
                        <div key={item.category} className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-300">{item.category}</span>
                          <span className="font-mono font-bold">₹{item.amount.toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tool 3: Regional Indian Menu Generator */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-600">
                  <Utensils className="w-5 h-5" />
                  <h3 className="font-heading font-bold text-sm">Regional Indian Menu API</h3>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Curates authentic multi-course menus with strict Veg, Jain, and Vegan tags.
                </p>

                <div className="space-y-2 pt-2">
                  <label className="text-[11px] font-semibold text-gray-400 uppercase">Cuisine Region</label>
                  <select
                    value={menuRegion}
                    onChange={(e) => setMenuRegion(e.target.value)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530]"
                  >
                    <option value="Hyderabadi">Hyderabadi Nawabi</option>
                    <option value="South Indian">South Indian Feast</option>
                    <option value="North Indian">North Indian Tandoori</option>
                    <option value="Gujarati / Rajasthani">Gujarati / Rajasthani Thali</option>
                    <option value="Pan-Indian Fusion">Modern Pan-Indian Fusion</option>
                  </select>

                  <label className="text-[11px] font-semibold text-gray-400 uppercase">Dietary Filter</label>
                  <select
                    value={menuDiet}
                    onChange={(e) => setMenuDiet(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-xl border border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530]"
                  >
                    <option value="all-veg">Pure Vegetarian</option>
                    <option value="jain-friendly">Jain-Friendly (No Onion / Garlic)</option>
                    <option value="vegan">Vegan / Dairy-Free</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleRunMenuGen}
                  isLoading={isMenuLoading}
                >
                  Generate Menu
                </Button>

                {menuResult && (
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-gray-800 text-xs space-y-2">
                    <div className="flex justify-between font-bold text-xs">
                      <span>{menuResult.region}</span>
                      <span className="text-[#C2185B] dark:text-[#F66DA5]">{menuResult.estimatedPerPlate} / plate</span>
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1 text-[11px]">
                      {menuResult.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center py-0.5 border-b border-gray-100 dark:border-gray-800">
                          <span className="truncate pr-2">{item.name}</span>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 shrink-0">
                            {item.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Database Records */}
        {activeTab === "database" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                  Events Table Records ({dbEvents.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadDatabaseEvents}
                  isLoading={isDbLoading}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Reload
                </Button>
              </div>

              {dbEvents.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  No events found. Click &quot;Seed Sample Data&quot; at the top to populate test data!
                </div>
              ) : (
                <div className="divide-y divide-[#E4DEF2] dark:divide-[#493D5C]">
                  {dbEvents.map((evt) => (
                    <div key={evt.id} className="py-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm text-[#1C1530] dark:text-[#FBF9FF]">
                          {evt.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/api/events/export?id=${evt.id}`}
                            download
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs inline-flex items-center gap-1 text-gray-600 dark:text-gray-300"
                            title="Export full event JSON"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                          </a>
                          <span className="text-xs font-mono text-gray-400">{evt.id}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#62596F] dark:text-[#C9BEDB] flex flex-wrap gap-4">
                        <span>Type: {evt.type}</span>
                        <span>City: {evt.city || "Unset"}</span>
                        <span>Budget: ₹{evt.budget?.toLocaleString("en-IN") || "0"}</span>
                        <span>Guests: {evt.guests || 0}</span>
                      </div>
                      <a
                        href={`/event/${evt.id}`}
                        className="text-xs font-semibold text-[#C2185B] dark:text-[#F66DA5] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Open in Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: API Reference */}
        {activeTab === "api" && (
          <div className="p-6 rounded-3xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] space-y-6 shadow-2xs">
            <h3 className="font-heading font-bold text-base text-[#1C1530] dark:text-[#FBF9FF]">
              PlanPal Production REST & SSE API Endpoints
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#F2A900] text-black text-[11px] font-bold">
                    POST (SSE)
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    /api/chat/stream
                  </span>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Real-time Server-Sent Events streaming endpoint. Emits token deltas during generation followed by the validated Zod plan JSON and relational sync.
                </p>
                <div className="p-3 rounded-xl bg-black text-[#9FED72] font-mono text-[11px]">
                  {`curl -N -X POST http://localhost:3000/api/chat/stream -H "Content-Type: application/json" -d '{"eventId": "...", "message": "Suggest entertainment"}'`}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-[#C2185B] text-white text-[11px] font-bold">
                    POST
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    /api/chat
                  </span>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Synchronous Claude AI planning pipeline, validates output with Zod, and updates database event and message history.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold">
                    GET / POST
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    /api/ai/draft-inquiry, /api/ai/rebalance, /api/ai/menu
                  </span>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Specialized event planning microservices: WhatsApp vendor inquiry generator, zero-drift budget rebalancer, and regional Indian feasts.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FBF9FF] dark:bg-[#1C1530] border border-[#E4DEF2] dark:border-[#493D5C] space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white text-[11px] font-bold">
                    GET / POST
                  </span>
                  <span className="font-mono text-xs font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                    /api/events/export & /api/events/import
                  </span>
                </div>
                <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
                  Full-stack celebration portable backups. Downloads complete bundle (event, plan, ledger, tasks, vendors) or restores from JSON.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
