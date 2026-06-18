import { NextResponse } from "next/server";
import { createReservation } from "@/lib/reservation";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import { sendOrderNotifications } from "@/lib/email";
import { prettyDate } from "@/lib/dates";

// Public: creates a reservation, then either starts Stripe Checkout
// (if configured) or confirms a pay-on-delivery reservation.
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await createReservation(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  const { order, pkg } = result;

  const stripe = getStripe();

  // --- Pay-on-delivery fallback (Stripe not connected yet) ---
  if (!stripe) {
    try {
      await sendOrderNotifications(order);
    } catch (e) {
      console.error("[checkout] email failed", e);
    }
    return NextResponse.json({ url: "/order/success" });
  }

  // --- Stripe Checkout ---
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: order.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(order.price * 100),
            product_data: {
              name: `Stack'd Totes — ${pkg.name}`,
              description: `${pkg.totes} totes · delivery ${prettyDate(order.delivery_date)} → pickup ${prettyDate(order.pickup_date)}`,
            },
          },
        },
      ],
      metadata: { order_id: order.id },
      success_url: `${siteUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/order?canceled=1`,
    });

    const supabase = getSupabaseAdmin();
    if (supabase) {
      await supabase
        .from("orders")
        .update({ stripe_session_id: session.id })
        .eq("id", order.id);
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("[checkout] stripe session failed", e);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again." },
      { status: 500 },
    );
  }
}
