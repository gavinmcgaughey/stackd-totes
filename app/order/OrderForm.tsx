"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/style.css";
import { Check, Loader2, CalendarDays, AlertCircle } from "lucide-react";
import { PACKAGES, getPackage } from "@/lib/packages";
import { toISODate, fromISODate, prettyDate } from "@/lib/dates";
import { computePrice } from "@/lib/pricing";

const inputClass =
  "w-full rounded-xl border border-line bg-background px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-muted/70";

// Set NEXT_PUBLIC_STRIPE_ENABLED=true once Stripe keys are connected.
const PAYMENTS_ON = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";

export function OrderForm({ initialPackageId }: { initialPackageId: string }) {
  const router = useRouter();
  const [packageId, setPackageId] = useState(initialPackageId);
  const [range, setRange] = useState<DateRange | undefined>();
  const [unavailable, setUnavailable] = useState<Date[]>([]);
  const [form, setForm] = useState({
    customer_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canceled, setCanceled] = useState(false);

  const pkg = getPackage(packageId);

  // Live price breakdown based on the selected dates (matches the server).
  const breakdown = useMemo(() => {
    if (!pkg || !range?.from) return null;
    const to = range.to ?? range.from;
    return computePrice(pkg, toISODate(range.from), toISODate(to));
  }, [pkg, range]);

  // Show a notice if the customer bailed out of Stripe Checkout.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("canceled")) {
      setCanceled(true);
    }
  }, []);

  // Tomorrow is the earliest bookable day.
  const tomorrow = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((d: { unavailable?: string[] }) =>
        setUnavailable((d.unavailable ?? []).map(fromISODate)),
      )
      .catch(() => setUnavailable([]));
  }, []);

  const disabledDays = useMemo(
    () => [{ before: tomorrow }, ...unavailable],
    [tomorrow, unavailable],
  );

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!pkg) return setError("Please choose a package.");
    if (!range?.from) return setError("Please choose your delivery date.");
    const from = range.from;
    const to = range.to ?? range.from;
    if (!form.customer_name || !form.email || !form.phone || !form.address) {
      return setError("Please fill in your name, email, phone, and address.");
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          package_id: pkg.id,
          delivery_date: toISODate(from),
          pickup_date: toISODate(to),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      // json.url is either a Stripe Checkout URL or an internal success path.
      if (json.url?.startsWith("http")) {
        window.location.href = json.url;
      } else {
        router.push(json.url ?? "/order/success");
      }
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* ---------- Left: choices ---------- */}
      <div className="space-y-10">
        {/* Step 1 — package */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">1</span>
            Choose your package
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PACKAGES.map((p) => {
              const selected = p.id === packageId;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPackageId(p.id)}
                  className={`relative rounded-2xl border p-4 text-left transition-colors ${
                    selected ? "border-brand bg-brand/5 ring-2 ring-brand/20" : "border-line bg-background hover:border-brand/50"
                  }`}
                >
                  {selected && (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-brand" />
                  )}
                  <p className="text-sm font-semibold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-xs text-muted">{p.bestFor}</p>
                  <p className="mt-3 text-2xl font-extrabold text-ink">${p.price}</p>
                  <p className="text-xs text-muted">{p.totes} totes · {p.weeks}-wk</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 — dates */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">2</span>
            Pick delivery &amp; pickup dates
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Click your <strong>delivery</strong> day, then your <strong>pickup</strong> day.
            Crossed-out dates are unavailable.
          </p>
          <div className="mt-4 inline-block rounded-2xl border border-line bg-background p-3">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={disabledDays}
              excludeDisabled
              startMonth={tomorrow}
              numberOfMonths={1}
            />
          </div>
        </section>

        {/* Step 3 — details */}
        <section>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm text-white">3</span>
            Your details
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input className={inputClass} placeholder="Full name *" value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} />
            <input className={inputClass} type="tel" placeholder="Phone *" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            <input className={`${inputClass} sm:col-span-2`} type="email" placeholder="Email *" value={form.email} onChange={(e) => update("email", e.target.value)} />
            <input className={`${inputClass} sm:col-span-2`} placeholder="Delivery address *" value={form.address} onChange={(e) => update("address", e.target.value)} />
            <input className={`${inputClass} sm:col-span-2`} placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
            <textarea className={`${inputClass} sm:col-span-2 min-h-24 resize-y`} placeholder="Anything we should know? (gate code, stairs, extra weeks…)" value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>
        </section>
      </div>

      {/* ---------- Right: sticky summary ---------- */}
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Your reservation
          </h3>
          <p className="mt-3 text-lg font-bold text-ink">{pkg?.name ?? "—"}</p>
          <p className="text-sm text-muted">{pkg?.totes} totes · {pkg?.dollies} dollies</p>

          <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex items-center gap-2 text-ink">
              <CalendarDays className="h-4 w-4 text-brand" />
              <span>{range?.from ? prettyDate(toISODate(range.from)) : "Delivery date"}</span>
            </div>
            <div className="flex items-center gap-2 text-ink">
              <CalendarDays className="h-4 w-4 text-brand" />
              <span>{range?.to ? prettyDate(toISODate(range.to)) : "Pickup date"}</span>
            </div>
            {range?.to && breakdown && (
              <p className="pl-6 text-xs text-muted">
                Billed as {breakdown.billedWeeks} week
                {breakdown.billedWeeks > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Price breakdown */}
          <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between text-muted">
              <span>
                Base ({pkg?.weeks} wk{(pkg?.weeks ?? 0) > 1 ? "s" : ""})
              </span>
              <span>${breakdown?.base ?? pkg?.price ?? 0}</span>
            </div>
            {breakdown && breakdown.extraWeeks > 0 && (
              <div className="flex justify-between text-muted">
                <span>
                  + {breakdown.extraWeeks} extra week
                  {breakdown.extraWeeks > 1 ? "s" : ""} (${breakdown.extraWeekPrice}/wk)
                </span>
                <span>${breakdown.extra}</span>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-sm font-medium text-ink">
                {PAYMENTS_ON ? "Total (pay now)" : "Total (pay on delivery)"}
              </span>
              <span className="text-2xl font-extrabold text-ink">
                ${breakdown?.total ?? pkg?.price ?? 0}
              </span>
            </div>
            {!range?.to && (
              <p className="text-xs text-muted">
                Pick your pickup date to see the full total.
              </p>
            )}
          </div>

          {canceled && (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
              Checkout canceled — your dates are still available. Ready when you are!
            </p>
          )}

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {PAYMENTS_ON ? "Redirecting…" : "Reserving…"}
              </>
            ) : PAYMENTS_ON ? (
              "Continue to secure payment"
            ) : (
              "Confirm reservation"
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            {PAYMENTS_ON
              ? "You'll pay securely via Stripe. Cards never touch our servers."
              : "No payment now. We'll confirm your delivery window by email."}
          </p>
        </div>
      </aside>
    </form>
  );
}
