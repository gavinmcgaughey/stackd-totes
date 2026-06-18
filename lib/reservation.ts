import { getSupabaseAdmin } from "./supabase";
import { getPackage, type Package } from "./packages";
import { eachDateInRange } from "./dates";
import { computePrice } from "./pricing";
import type { Order } from "./types";

export type ReservationResult =
  | { ok: true; order: Order; pkg: Package }
  | { ok: false; status: number; error: string };

/**
 * Validates a booking payload, guards against double-booking, and inserts an
 * unpaid `pending` order. Shared by the Stripe and pay-on-delivery paths.
 */
export async function createReservation(
  body: Record<string, unknown>,
): Promise<ReservationResult> {
  const customer_name = String(body.customer_name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const address = String(body.address ?? "").trim();
  const city = body.city ? String(body.city).trim() : null;
  const package_id = String(body.package_id ?? "");
  const delivery_date = String(body.delivery_date ?? "");
  const pickup_date = String(body.pickup_date ?? "");
  const notes = body.notes ? String(body.notes).trim() : null;

  if (!customer_name || !email || !phone || !address || !package_id || !delivery_date || !pickup_date) {
    return { ok: false, status: 400, error: "Please fill in all required fields." };
  }
  const pkg = getPackage(package_id);
  if (!pkg) return { ok: false, status: 400, error: "Unknown package." };
  if (pickup_date < delivery_date) {
    return { ok: false, status: 400, error: "Pickup date must be on or after delivery." };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: false,
      status: 503,
      error: "Online booking isn't connected yet. Please call us, or check back soon.",
    };
  }

  // Double-booking guard.
  const wanted = eachDateInRange(delivery_date, pickup_date);
  const [{ data: blocked }, { data: actives }] = await Promise.all([
    supabase.from("blocked_dates").select("date"),
    supabase
      .from("orders")
      .select("delivery_date, pickup_date")
      .in("status", ["pending", "confirmed"]),
  ]);
  const taken = new Set<string>();
  (blocked ?? []).forEach((b: { date: string }) => taken.add(b.date));
  (actives ?? []).forEach((o: { delivery_date: string; pickup_date: string }) =>
    eachDateInRange(o.delivery_date, o.pickup_date).forEach((d) => taken.add(d)),
  );
  if (wanted.some((d) => taken.has(d))) {
    return {
      ok: false,
      status: 409,
      error: "Sorry — those dates were just taken. Please pick another range.",
    };
  }

  // Authoritative price — computed server-side from the dates, never trusted
  // from the client.
  const { total } = computePrice(pkg, delivery_date, pickup_date);

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name,
      email,
      phone,
      address,
      city,
      package_id: pkg.id,
      package_name: pkg.name,
      price: total,
      delivery_date,
      pickup_date,
      notes,
      status: "pending",
      paid: false,
    })
    .select()
    .single();

  if (error) {
    console.error("[reservation] insert failed", error);
    return { ok: false, status: 500, error: "Could not save your reservation." };
  }

  return { ok: true, order: data as Order, pkg };
}
