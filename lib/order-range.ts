import { addCalendarDays, isSameLocalDay, startOfLocalDay } from "./dates";

/** Days after delivery covered by the included rental (2 weeks). */
export const INCLUDED_RENTAL_DAYS = 14;

export type DayRange = { from: Date; to: Date };

/**
 * Range selection for /order. react-day-picker range mode sets from and to
 * to the same day on the first click; we don't want a same-day rental.
 *
 * - First click (or a click before the current delivery) is delivery only.
 *   Pickup defaults to `includedDays` later (the included 2-week rental).
 * - Later clicks on or after delivery update pickup.
 * - Pickup is never before delivery. Clicking delivery again re-applies
 *   the default pickup instead of collapsing to a same-day range.
 */
export function rangeAfterDayClick(
  prev: { from?: Date; to?: Date } | undefined,
  clicked: Date,
  includedDays: number = INCLUDED_RENTAL_DAYS,
): DayRange {
  const day = startOfLocalDay(clicked);
  const from = prev?.from ? startOfLocalDay(prev.from) : undefined;
  const span = Math.max(0, includedDays);

  if (!from || day.getTime() < from.getTime() || isSameLocalDay(day, from)) {
    return { from: day, to: addCalendarDays(day, span) };
  }

  return { from, to: day };
}
