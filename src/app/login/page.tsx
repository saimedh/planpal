"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, ArrowRight, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
      setIsSent(true);
    } catch (err: any) {
      console.warn("Supabase auth error:", err);
      // For demo or unconfigured Supabase credentials, provide graceful dev fallback
      setError(err.message || "Failed to send magic link. You can use Demo Access below.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
    } catch (err) {
      console.warn("Google login error:", err);
      router.push("/dashboard");
    }
  };

  const handleDemoBypass = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9FF] dark:bg-[#110D1E]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-6">
          {/* Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#1B142F] border border-[#E6DEFA] dark:border-[#2E234B] shadow-xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C2185B] via-[#E03D80] to-[#F2A900] flex items-center justify-center text-white mx-auto shadow-md">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-[#1C1530] dark:text-[#FBF9FF]">
                Welcome to PlanPal
              </h1>
              <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4]">
                Sign in to manage and collaborate on your celebrations.
              </p>
            </div>

            {isSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-semibold text-sm text-emerald-900 dark:text-emerald-200">
                  Magic link on its way!
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  We sent an email to <strong>{email}</strong>. Click the link inside to
                  sign in securely.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftAddon={<Mail className="w-4 h-4" />}
                  error={error || undefined}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Magic Link
                </Button>
              </form>
            )}

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#E6DEFA] dark:border-[#2E234B] w-full" />
              <span className="bg-white dark:bg-[#1B142F] px-3 text-[10px] uppercase font-bold text-gray-400 absolute">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleGoogleLogin}
              className="w-full gap-2 text-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>

            {/* Quick Demo Access Bypass Button */}
            <div className="pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoBypass}
                className="w-full text-xs"
              >
                Explore as Guest / Demo Mode →
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
