"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { LogOut, RefreshCw, Loader2 } from "lucide-react";
import type { Order, OrderStatus } from "@/lib/types";
import { toISODate, fromISODate, eachDateInRange, prettyDate } from "@/lib/dates";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-zinc-200 text-zinc-600",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyDate, setBusyDate] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [o, b] = await Promise.all([
      fetch("/api/admin/orders").then((r) => r.json()),
      fetch("/api/blocked-dates").then((r) => r.json()),
    ]);
    setOrders(o.orders ?? []);
    setBlocked((b.blocked ?? []).map((x: { date: string }) => x.date));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Dates covered by an active reservation.
  const bookedSet = useMemo(() => {
    const set = new Set<string>();
    orders
      .filter((o) => o.status === "pending" || o.status === "confirmed")
      .forEach((o) => eachDateInRange(o.delivery_date, o.pickup_date).forEach((d) => set.add(d)));
    return set;
  }, [orders]);

  const bookedDates = useMemo(() => [...bookedSet].map(fromISODate), [bookedSet]);
  const blockedDates = useMemo(() => blocked.map(fromISODate), [blocked]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    return d;
  }, []);

  async function toggleBlock(day: Date) {
    const iso = toISODate(day);
    if (bookedSet.has(iso)) return; // can't block a booked day
    setBusyDate(iso);
    try {
      if (blocked.includes(iso)) {
        await fetch(`/api/blocked-dates?date=${iso}`, { method: "DELETE" });
      } else {
        await fetch("/api/blocked-dates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date: iso }),
        });
      }
      await load();
    } finally {
      setBusyDate(null);
    }
  }

  async function setStatus(id: string, status: OrderStatus) {
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const upcoming = orders.filter(
    (o) => o.status !== "cancelled" && o.delivery_date >= toISODate(today),
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">Admin dashboard</h1>
          <p className="text-sm text-muted">Bookings &amp; availability for Stack&apos;d Totes.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-brand hover:text-brand"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total bookings", value: orders.length },
          { label: "Pending", value: pendingCount },
          { label: "Upcoming", value: upcoming },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-3xl font-extrabold text-ink">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[auto_1fr]">
        {/* Calendar / block dates */}
        <section>
          <h2 className="font-bold text-ink">Availability</h2>
          <p className="mt-1 text-sm text-muted">
            Click a free day to <strong>block</strong> it. Click a blocked day to unblock.
          </p>
          <div className="mt-4 inline-block rounded-2xl border border-line bg-background p-3">
            <DayPicker
              onDayClick={toggleBlock}
              disabled={{ before: today }}
              modifiers={{ booked: bookedDates, blocked: blockedDates }}
              modifiersClassNames={{ booked: "rdp-booked", blocked: "rdp-blocked" }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#14110f]" /> Blocked
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-[#fdeee7] ring-1 ring-brand/40" /> Booked
            </span>
            {busyDate && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          </div>
        </section>

        {/* Orders table */}
        <section className="min-w-0">
          <h2 className="font-bold text-ink">Bookings</h2>
          {loading ? (
            <p className="mt-4 text-sm text-muted">Loading…</p>
          ) : orders.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-dashed border-line p-8 text-center text-sm text-muted">
              No bookings yet. They&apos;ll appear here the moment someone reserves.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Package</th>
                    <th className="px-4 py-3 font-medium">Delivery</th>
                    <th className="px-4 py-3 font-medium">Pickup</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {orders.map((o) => (
                    <tr key={o.id} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{o.customer_name}</p>
                        <p className="text-xs text-muted">{o.phone}</p>
                        <p className="text-xs text-muted">{o.email}</p>
                        <p className="mt-1 text-xs text-muted">{o.address}{o.city ? `, ${o.city}` : ""}</p>
                        {o.notes && <p className="mt-1 text-xs italic text-muted">“{o.notes}”</p>}
                      </td>
                      <td className="px-4 py-3 text-ink">
                        {o.package_name}
                        <p className="text-xs text-muted">${o.price}</p>
                      </td>
                      <td className="px-4 py-3 text-ink">{prettyDate(o.delivery_date)}</td>
                      <td className="px-4 py-3 text-ink">{prettyDate(o.pickup_date)}</td>
                      <td className="px-4 py-3">
                        <span className={`mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                          {o.status}
                        </span>
                        <select
                          value={o.status}
                          onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                          className="block w-full rounded-lg border border-line bg-background px-2 py-1.5 text-xs text-ink outline-none focus:border-brand"
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
