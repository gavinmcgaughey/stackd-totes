import { fromISODate } from "./dates";
import type { Package } from "./packages";

export type PriceBreakdown = {
  days: number; // length of the rental in days
  includedWeeks: number; // weeks covered by the base price
  billedWeeks: number; // total weeks billed (>= includedWeeks)
  extraWeeks: number; // weeks beyond the included ones
  extraWeekPrice: number;
  base: number;
  extra: number;
  total: number;
};

/** Whole days between delivery and pickup (>= 0). */
export function daysBetween(deliveryISO: string, pickupISO: string): number {
  const a = fromISODate(deliveryISO).getTime();
  const b = fromISODate(pickupISO).getTime();
  return Math.max(0, Math.round((b - a) / 86_400_000));
}

/**
 * Authoritative price for a booking. Billed weekly: the base covers the
 * package's included weeks, and each additional started week adds extraWeekPrice.
 * Used on the client for display AND on the server as the charged amount.
 */
export function computePrice(
  pkg: Package,
  deliveryISO: string,
  pickupISO: string,
): PriceBreakdown {
  const days = daysBetween(deliveryISO, pickupISO);
  // At least one week, rounded up, but never below the included weeks.
  const billedWeeks = Math.max(pkg.weeks, Math.max(1, Math.ceil(days / 7)));
  const extraWeeks = Math.max(0, billedWeeks - pkg.weeks);
  const base = pkg.price;
  const extra = extraWeeks * pkg.extraWeekPrice;
  return {
    days,
    includedWeeks: pkg.weeks,
    billedWeeks,
    extraWeeks,
    extraWeekPrice: pkg.extraWeekPrice,
    base,
    extra,
    total: base + extra,
  };
}
