import { getStripe } from "./stripe";
import { getSupabaseAdmin } from "./supabase";

/** Alphabet used when generating STK-XXXXXX codes (no I/O/0/1). */
const CODE_BODY = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_RE = new RegExp(`^STK-[${CODE_BODY}]{6}$`);
const SESSION_RE = /^cs_(test_|live_)?[A-Za-z0-9]+$/;

export type PublicBooking = {
  confirmation_code: string;
  package_name: string;
  delivery_date: string;
  pickup_date: string;
};

type OrderRow = PublicBooking & { status: string };

function firstQueryValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function normalizeConfirmationCode(
  raw: string | string[] | undefined,
): string | null {
  const value = firstQueryValue(raw)?.trim().toUpperCase();
  if (!value || !CODE_RE.test(value)) return null;
  return value;
}

export function normalizeStripeSessionId(
  raw: string | string[] | undefined,
): string | null {
  const value = firstQueryValue(raw)?.trim();
  if (!value || value.length > 255 || !SESSION_RE.test(value)) return null;
  return value;
}

function toPublic(row: OrderRow | null): PublicBooking | null {
  if (!row || row.status === "cancelled") return null;
  if (!row.confirmation_code) return null;
  return {
    confirmation_code: row.confirmation_code,
    package_name: row.package_name,
    delivery_date: row.delivery_date,
    pickup_date: row.pickup_date,
  };
}

const PUBLIC_COLUMNS =
  "confirmation_code, package_name, delivery_date, pickup_date, status";

async function findByConfirmationCode(
  code: string,
): Promise<PublicBooking | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .select(PUBLIC_COLUMNS)
    .eq("confirmation_code", code)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[confirmation] code lookup failed", error.message);
    return null;
  }
  return toPublic((data as OrderRow | null) ?? null);
}

async function findByOrderId(id: string): Promise<PublicBooking | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .select(PUBLIC_COLUMNS)
    .eq("id", id)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[confirmation] order id lookup failed", error.message);
    return null;
  }
  return toPublic((data as OrderRow | null) ?? null);
}

async function findByStripeSessionId(
  sessionId: string,
): Promise<PublicBooking | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .select(PUBLIC_COLUMNS)
    .eq("stripe_session_id", sessionId)
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error("[confirmation] session lookup failed", error.message);
    return null;
  }
  return toPublic((data as OrderRow | null) ?? null);
}

/**
 * Resolve a success-page query to a real booking, or null.
 * Returns only non-PII fields so a guessed code cannot leak customer details.
 */
export async function lookupPublicBooking(params: {
  code?: string | string[];
  session_id?: string | string[];
}): Promise<PublicBooking | null> {
  const code = normalizeConfirmationCode(params.code);
  const sessionId = normalizeStripeSessionId(params.session_id);
  if (!code && !sessionId) return null;

  if (code) {
    const found = await findByConfirmationCode(code);
    if (found) return found;
  }

  if (sessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const complete =
          session.status === "complete" || session.payment_status === "paid";
        if (!complete) return null;
        const orderId = session.metadata?.order_id;
        if (orderId) {
          const byId = await findByOrderId(orderId);
          if (byId) return byId;
        }
      } catch (e) {
        console.error("[confirmation] stripe session retrieve failed", e);
      }
    }
    return findByStripeSessionId(sessionId);
  }

  return null;
}
