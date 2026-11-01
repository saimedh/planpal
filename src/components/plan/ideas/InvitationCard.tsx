"use client";

import React, { useState } from "react";
import { Copy, Check, MessageSquare, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generateWhatsAppLink } from "@/lib/utils";

interface InvitationCardProps {
  invitationText: {
    en: string;
    hi: string;
    te: string;
  };
}

export function InvitationCard({ invitationText }: InvitationCardProps) {
  const [lang, setLang] = useState<"en" | "hi" | "te">("en");
  const [copied, setCopied] = useState(false);

  const text =
    invitationText[lang] ||
    invitationText.en ||
    "You are cordially invited to celebrate with us! Your presence will add warmth and happiness to our special celebration.";

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const waUrl = generateWhatsAppLink(text);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-white to-[#FBF9FF] dark:from-[#1B142F] dark:to-[#110D1E] border border-[#E6DEFA] dark:border-[#2E234B] shadow-2xs space-y-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
            AI Digital Invitation Wording
          </h3>
          <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4]">
            Pre-composed festive message formatted for WhatsApp & digital invites.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3EEFF] dark:bg-[#2B1F44]">
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              lang === "en"
                ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#1B142F] dark:text-white"
                : "text-gray-500"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all font-hindi ${
              lang === "hi"
                ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#1B142F] dark:text-white"
                : "text-gray-500"
            }`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang("te")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all font-telugu ${
              lang === "te"
                ? "bg-white text-[#C2185B] shadow-2xs dark:bg-[#1B142F] dark:text-white"
                : "text-gray-500"
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Invitation Text Box */}
      <div
        className={`p-4 rounded-xl bg-white dark:bg-[#110D1E] border border-[#E6DEFA] dark:border-[#2E234B] text-sm text-[#1C1530] dark:text-[#FBF9FF] whitespace-pre-wrap leading-relaxed shadow-inner ${
          lang === "hi" ? "font-hindi" : lang === "te" ? "font-telugu" : "font-sans"
        }`}
      >
        {text}
      </div>

      {/* Actions */}
      <div className="flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        >
          {copied ? "Copied" : "Copy Invite"}
        </Button>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Send on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
