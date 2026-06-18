import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key.
 * Returns null when env isn't configured yet, so the app still runs
 * in "demo mode" (calendar works, orders just can't be saved).
 * Never import this into a Client Component.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (url.includes("your-project") || key.includes("your-service")) return null;
  if (cached) return cached;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
