"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Globe, IndianRupee, Bell, Check, Moon } from "lucide-react";

export default function SettingsPage() {
  const [lang, setLang] = useState("en");
  const [currency, setCurrency] = useState("INR");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9FF] dark:bg-[#110D1E] text-[#1C1530] dark:text-[#FBF9FF]">
      <Navbar currentLang={lang} onLangChange={setLang} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3E68] dark:text-[#C9C1D4] mt-1">
            Customize your language, currency, and celebration reminders.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Language Preference */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C1530] dark:text-[#FBF9FF]">
              <Globe className="w-4 h-4 text-[#C2185B]" />
              <span>Language Preference</span>
            </div>
            <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4]">
              PlanPal speaks multiple Indian languages for conversations and invitation drafts.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                  lang === "en"
                    ? "border-[#C2185B] bg-[#FDE4EF]/40 text-[#C2185B] dark:text-[#F48DB8]"
                    : "border-[#E6DEFA] dark:border-[#2E234B] text-gray-600 dark:text-gray-300"
                }`}
              >
                <span>English</span>
                <span className="text-[10px] text-gray-400">Default</span>
              </button>

              <button
                type="button"
                onClick={() => setLang("hi")}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 font-hindi transition-all ${
                  lang === "hi"
                    ? "border-[#C2185B] bg-[#FDE4EF]/40 text-[#C2185B] dark:text-[#F48DB8]"
                    : "border-[#E6DEFA] dark:border-[#2E234B] text-gray-600 dark:text-gray-300"
                }`}
              >
                <span>हिंदी</span>
                <span className="text-[10px] text-gray-400 font-sans">Hindi</span>
              </button>

              <button
                type="button"
                onClick={() => setLang("te")}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 font-telugu transition-all ${
                  lang === "te"
                    ? "border-[#C2185B] bg-[#FDE4EF]/40 text-[#C2185B] dark:text-[#F48DB8]"
                    : "border-[#E6DEFA] dark:border-[#2E234B] text-gray-600 dark:text-gray-300"
                }`}
              >
                <span>తెలుగు</span>
                <span className="text-[10px] text-gray-400 font-sans">Telugu</span>
              </button>
            </div>
          </div>

          {/* Currency */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C1530] dark:text-[#FBF9FF]">
              <IndianRupee className="w-4 h-4 text-[#F2A900]" />
              <span>Default Currency</span>
            </div>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full sm:w-64 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] px-3.5 py-2.5 text-sm text-[#1C1530] dark:text-[#FBF9FF] min-h-[44px]"
            >
              <option value="INR">₹ Indian Rupee (INR)</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="AED">AED UAE Dirham</option>
              <option value="GBP">£ British Pound (GBP)</option>
            </select>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1C1530] dark:text-[#FBF9FF]">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Event Task Reminders</span>
            </div>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold block text-[#1C1530] dark:text-[#FBF9FF]">
                    Email Milestones Digest
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Receive weekly backward-planned milestone summaries
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#C2185B]"
                />
              </label>

              <div className="border-t border-[#E6DEFA] dark:border-[#2E234B]" />

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold block text-[#1C1530] dark:text-[#FBF9FF]">
                    WhatsApp Task Notifications
                  </span>
                  <span className="text-[11px] text-gray-400">
                    Get pinged when a vendor quote is due or task is overdue
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#C2185B]"
                />
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <Button type="submit" variant="primary" size="md">
              Save Preferences
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
