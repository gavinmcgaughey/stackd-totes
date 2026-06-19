import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Public: returns the list of YYYY-MM-DD dates that can't be booked
// (owner-blocked dates + dates covered by an active reservation).
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ unavailable: [], demo: true });
  }

  const { data: blocked } = await supabase.from("blocked_dates").select("date");

  const set = new Set<string>();
  (blocked ?? []).forEach((b: { date: string }) => set.add(b.date));

  return NextResponse.json({ unavailable: [...set].sort() });
}
