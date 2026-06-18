/** Format a Date as a local YYYY-MM-DD string (no timezone shifting). */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD string to a local Date at noon (avoids TZ off-by-one). */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

/** Every YYYY-MM-DD between start and end, inclusive. */
export function eachDateInRange(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  const cur = fromISODate(startISO);
  const end = fromISODate(endISO);
  while (cur <= end) {
    out.push(toISODate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function prettyDate(s: string): string {
  return fromISODate(s).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
