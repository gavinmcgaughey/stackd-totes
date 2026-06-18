import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Admin-only (enforced by proxy.ts). Manage owner-blocked dates.
function noDb() {
  return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
}

export async function GET() {
  const s = getSupabaseAdmin();
  if (!s) return NextResponse.json({ blocked: [] });
  const { data, error } = await s.from("blocked_dates").select("*").order("date");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blocked: data });
}

export async function POST(req: Request) {
  const s = getSupabaseAdmin();
  if (!s) return noDb();
  const { date, reason } = await req.json().catch(() => ({}));
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  const { error } = await s.from("blocked_dates").upsert({ date, reason: reason || null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const s = getSupabaseAdmin();
  if (!s) return noDb();
  const date = new URL(req.url).searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  const { error } = await s.from("blocked_dates").delete().eq("date", date);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
