"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Moon, Sun, Globe, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface NavbarProps {
  currentLang?: string;
  onLangChange?: (lang: string) => void;
}

export function Navbar({ currentLang = "en", onLangChange }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.email) {
          setUserEmail(data.user.email);
        }
      });
    } catch {
      // Ignore if supabase client isn't configured yet
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
      setIsDark(true);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUserEmail(null);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E4DEF2] dark:border-[#493D5C] bg-[#FBF9FF]/95 dark:bg-[#1C1530]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo - Styled as Framer design */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-heading text-2xl font-bold tracking-tight text-[#1C1530] dark:text-[#FBF9FF]">
            planpal<span className="text-[#C2185B]">.</span>
          </span>
        </Link>

        {/* Center Nav Links - Exactly matching Framer */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#62596F] dark:text-[#C9BEDB]">
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
          <Link href="/design" className="hover:text-[#C2185B] dark:hover:text-[#F66DA5] transition-colors flex items-center gap-1">
            <span>Framer Canvas</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2185B] animate-pulse" />
          </Link>
        </nav>

        {/* Right Actions: Language Switcher + Dark mode + Auth */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Framer-styled language selector pills: EN | हिं | తెలు */}
          <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#2A213D] border border-[#E4DEF2] dark:border-[#493D5C] shadow-2xs">
            <button
              onClick={() => onLangChange?.("en")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                currentLang === "en"
                  ? "bg-[#1C1530] text-white dark:bg-white dark:text-[#1C1530]"
                  : "text-[#62596F] hover:text-[#1C1530] dark:text-[#C9BEDB] dark:hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLangChange?.("hi")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold font-hindi transition-all ${
                currentLang === "hi"
                  ? "bg-[#1C1530] text-white dark:bg-white dark:text-[#1C1530]"
                  : "text-[#62596F] hover:text-[#1C1530] dark:text-[#C9BEDB] dark:hover:text-white"
              }`}
            >
              हिं
            </button>
            <button
              onClick={() => onLangChange?.("te")}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold font-telugu transition-all ${
                currentLang === "te"
                  ? "bg-[#1C1530] text-white dark:bg-white dark:text-[#1C1530]"
                  : "text-[#62596F] hover:text-[#1C1530] dark:text-[#C9BEDB] dark:hover:text-white"
              }`}
            >
              తెలు
            </button>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 rounded-2xl border border-[#E4DEF2] dark:border-[#493D5C] bg-white dark:bg-[#2A213D] text-[#62596F] dark:text-[#C9BEDB] hover:text-[#1C1530] dark:hover:text-white min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors shadow-2xs"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#F2A900]" /> : <Moon className="w-4 h-4 text-[#C2185B]" />}
          </button>

          {/* User / Login Button */}
          {userEmail ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#62596F] dark:text-[#C9BEDB] hidden md:inline-block max-w-[120px] truncate">
                {userEmail}
              </span>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="p-2 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="px-4 py-2 rounded-2xl bg-[#1C1530] text-white hover:bg-[#2A213D] dark:bg-white dark:text-[#1C1530] dark:hover:bg-gray-100 text-xs font-bold transition-all shadow-xs min-h-[38px]">
                Log in
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
