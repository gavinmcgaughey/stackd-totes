import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Server-only Stripe client. Returns null when STRIPE_SECRET_KEY isn't set,
 * so the booking flow falls back to pay-on-delivery until you connect Stripe.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("your-stripe")) return null;
  if (cached) return cached;
  cached = new Stripe(key);
  return cached;
}
