import { Resend } from "resend";
import type { Order } from "./types";
import { prettyDate } from "./dates";

/**
 * Sends two emails on a new order:
 *  1. Owner notification (so you know immediately).
 *  2. Customer confirmation.
 * Silently no-ops if RESEND_API_KEY isn't set yet.
 */
export async function sendOrderNotifications(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  // OWNER_EMAIL may be a comma-separated list — all addresses get every booking.
  const owners = (process.env.OWNER_EMAIL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!apiKey || apiKey.includes("your-resend")) {
    console.warn("[email] RESEND_API_KEY not set — skipping notifications");
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.EMAIL_FROM || "Stack'd Totes <onboarding@resend.dev>";

  const confirmBadge = `
    <div style="background:#fff7f4;border:1.5px solid #e8551f;border-radius:8px;padding:12px 20px;margin-bottom:20px;display:inline-block">
      <p style="margin:0;font-size:12px;color:#6b625c;text-transform:uppercase;letter-spacing:0.06em">Confirmation code</p>
      <p style="margin:4px 0 0;font-size:24px;font-weight:700;color:#e8551f;letter-spacing:0.1em">${order.confirmation_code}</p>
    </div>`;

  const details = `
    <table style="border-collapse:collapse;font-size:15px;color:#1d1916">
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Order #</td><td><strong>${order.confirmation_code}</strong></td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Package</td><td><strong>${order.package_name}</strong> — $${order.price}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Delivery</td><td>${prettyDate(order.delivery_date)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Pickup</td><td>${prettyDate(order.pickup_date)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Name</td><td>${order.customer_name}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Phone</td><td>${order.phone}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Email</td><td>${order.email}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#6b625c">Address</td><td>${order.address}${order.city ? ", " + order.city : ""}</td></tr>
      ${order.notes ? `<tr><td style="padding:4px 16px 4px 0;color:#6b625c">Notes</td><td>${order.notes}</td></tr>` : ""}
    </table>`;

  const tasks: Promise<unknown>[] = [];

  if (owners.length) {
    tasks.push(
      resend.emails.send({
        from,
        to: owners,
        subject: `🧡 New booking — ${order.customer_name} (${prettyDate(order.delivery_date)})`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
            <h2 style="color:#e8551f;margin-bottom:4px">New Stack'd booking</h2>
            <p style="color:#6b625c;margin-top:0">A new reservation just came in.</p>
            ${confirmBadge}
            ${details}
            <p style="margin-top:24px;font-size:13px;color:#6b625c">Manage it in your admin dashboard.</p>
          </div>`,
      }),
    );
  }

  tasks.push(
    resend.emails.send({
      from,
      to: order.email,
      // Owners are BCC'd a copy of exactly what the customer received.
      ...(owners.length ? { bcc: owners } : {}),
      subject: "Your Stack'd Totes reservation is booked 🎉",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto">
          <h2 style="color:#e8551f">Thanks, ${order.customer_name}!</h2>
          <p style="color:#1d1916">Your reservation is in. We'll confirm your delivery window shortly. No cardboard, no waste, no hassle.</p>
          ${confirmBadge}
          ${details}
          <p style="margin-top:24px;color:#1d1916">Questions? Just reply to this email.</p>
          <p style="color:#6b625c;font-size:13px">— The Stack'd Totes team</p>
        </div>`,
    }),
  );

  await Promise.allSettled(tasks);
}
