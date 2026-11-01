import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF] dark:bg-[#1C1530] py-12 text-[#62596F] dark:text-[#C9BEDB] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="font-heading text-xl font-bold tracking-tight text-[#1C1530] dark:text-[#FBF9FF]">
              planpal<span className="text-[#C2185B]">.</span>
            </span>
            <p className="text-xs text-[#62596F] dark:text-[#C9BEDB]">
              Less planning. More celebrating. Made for the way India celebrates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold">
            <Link href="/#features" className="hover:text-[#1C1530] dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="hover:text-[#1C1530] dark:hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="/#examples" className="hover:text-[#1C1530] dark:hover:text-white transition-colors">
              Examples
            </Link>
            <Link href="/dashboard" className="hover:text-[#1C1530] dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/settings" className="hover:text-[#1C1530] dark:hover:text-white transition-colors">
              Settings
            </Link>
            <Link href="/design" className="hover:text-[#C2185B] dark:hover:text-[#F66DA5] transition-colors">
              Framer Design
            </Link>
            <Link href="/developer" className="hover:text-[#C2185B] dark:hover:text-[#F66DA5] transition-colors font-mono">
              Dev Backend
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E4DEF2]/60 dark:border-[#493D5C]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <span>© {new Date().getFullYear()} PlanPal. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Crafted with <Heart className="w-3 h-3 text-[#C2185B] fill-[#C2185B]" /> for joyful Indian celebrations
          </span>
        </div>
      </div>
    </footer>
  );
}
