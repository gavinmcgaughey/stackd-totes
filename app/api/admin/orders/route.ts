import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Admin-only (enforced by proxy.ts).
export async function GET() {
  const s = getSupabaseAdmin();
  if (!s) return NextResponse.json({ orders: [], demo: true });
  const { data, error } = await s
    .from("orders")
    .select("*")
    .order("delivery_date", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function PATCH(req: Request) {
  const s = getSupabaseAdmin();
  if (!s) return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  const { id, status } = await req.json().catch(() => ({}));
  const allowed = ["pending", "confirmed", "completed", "cancelled"];
  if (!id || !allowed.includes(status)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const { error } = await s.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
