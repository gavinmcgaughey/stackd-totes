import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { eachDateInRange } from "@/lib/dates";

// Public: returns the list of YYYY-MM-DD dates that can't be booked
// (owner-blocked dates + dates covered by an active reservation).
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ unavailable: [], demo: true });
  }

  const [{ data: blocked }, { data: orders }] = await Promise.all([
    supabase.from("blocked_dates").select("date"),
    supabase
      .from("orders")
      .select("delivery_date, pickup_date")
      .in("status", ["pending", "confirmed"]),
  ]);

  const set = new Set<string>();
  (blocked ?? []).forEach((b: { date: string }) => set.add(b.date));
  (orders ?? []).forEach((o: { delivery_date: string; pickup_date: string }) =>
    eachDateInRange(o.delivery_date, o.pickup_date).forEach((d) => set.add(d)),
  );

  return NextResponse.json({ unavailable: [...set].sort() });
}
