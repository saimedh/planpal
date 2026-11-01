"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FramerEmbed } from "@/components/framer/FramerEmbed";
import { Palette, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DesignPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9FF] dark:bg-[#1C1530] text-[#1C1530] dark:text-[#FBF9FF]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#62596F] hover:text-[#C2185B] dark:text-[#C9BEDB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Planner</span>
          </Link>

          <a
            href="https://enchanting-millions-849878.framer.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C2185B] hover:underline"
          >
            <span>Open Framer Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Title Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEFF] text-[#C2185B] border border-[#E4DEF2] dark:bg-[#2A213D] dark:text-[#F66DA5] text-xs font-bold">
            <Palette className="w-3.5 h-3.5 text-[#F2A900]" />
            <span>Framer Published Site</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
            PlanPal — Framer Live Design
          </h1>
          <p className="text-xs sm:text-sm text-[#62596F] dark:text-[#C9BEDB] max-w-2xl">
            Live preview of the published Framer site (`enchanting-millions-849878.framer.app`). The design has been integrated directly into the Next.js App Router codebase.
          </p>
        </div>

        {/* Embedded Framer Component */}
        <FramerEmbed
          projectUrl="https://enchanting-millions-849878.framer.app/"
          title="PlanPal Framer Design"
        />
      </main>

      <Footer />
    </div>
  );
}
