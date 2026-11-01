import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-planpal.supabase.co";
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
}
