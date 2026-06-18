import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendOrderNotifications } from "@/lib/email";
import type { Order } from "@/lib/types";

// Public endpoint Stripe calls after payment. Verifies the signature, then
// marks the order paid + confirmed (and emails) or cancels expired sessions.
export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret || whSecret.includes("your-webhook")) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", whSecret);
  } catch (e) {
    console.error("[webhook] signature verification failed", e);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ received: true });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      const { data } = await supabase
        .from("orders")
        .update({ paid: true, status: "confirmed" })
        .eq("id", orderId)
        .select()
        .single();
      if (data) {
        try {
          await sendOrderNotifications(data as Order);
        } catch (e) {
          console.error("[webhook] email failed", e);
        }
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      // Free the held dates if they never paid.
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
        .eq("paid", false);
    }
  }

  return NextResponse.json({ received: true });
}
