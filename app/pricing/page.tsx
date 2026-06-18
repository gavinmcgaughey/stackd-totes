import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PACKAGES, SERVICE_AREA } from "@/lib/packages";

export const metadata: Metadata = {
  title: "Pricing — Moving Tote Rental Packages",
  description:
    "Transparent pricing for reusable moving tote rentals across Butler, Hamilton, Preble & Warren Counties. Delivery and pickup always included.",
};

const FAQ = [
  {
    q: "Is delivery and pickup really included?",
    a: "Yes. Every package includes free drop-off before your move and pickup after — anywhere in our service area.",
  },
  {
    q: "How clean are the totes?",
    a: "Spotless. Every tote is wiped down and sanitized between rentals before it reaches your door.",
  },
  {
    q: "What if I need them longer?",
    a: "No problem — just let us know and we'll extend your rental for a small weekly add-on.",
  },
  {
    q: "Do I pay online?",
    a: "You reserve online and pay on delivery. We'll confirm your booking and delivery window after you submit.",
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">Pricing</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Honest pricing, no surprises
        </h1>
        <p className="mt-4 text-lg text-muted">
          Every package includes the totes, dollies, and free delivery &amp;
          pickup across {SERVICE_AREA.join(", ")}{" "}Counties.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col rounded-2xl border bg-background p-8 ${
              pkg.popular ? "border-brand shadow-xl shadow-brand/10" : "border-line"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                Most popular
              </span>
            )}
            <h2 className="text-lg font-bold text-ink">{pkg.name}</h2>
            <p className="mt-1 text-sm text-muted">{pkg.blurb}</p>
            <p className="mt-5 flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-ink">${pkg.price}</span>
              <span className="text-sm text-muted">/ {pkg.weeks}-wk rental</span>
            </p>
            <p className="mt-1 text-xs text-muted">
              +${pkg.extraWeekPrice}/week after that
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {pkg.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/order?package=${pkg.id}`}
              className={`mt-8 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold transition-colors ${
                pkg.popular
                  ? "bg-brand text-white hover:bg-brand-dark"
                  : "border border-line text-ink hover:border-brand hover:text-brand"
              }`}
            >
              Reserve this <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Need a custom size, a commercial move, or extra weeks?{" "}
        <Link href="/order" className="font-semibold text-brand hover:text-brand-dark">
          Reserve and add a note
        </Link>{" "}
        — we&apos;ll sort it out.
      </p>

      {/* FAQ */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-ink">
          Frequently asked questions
        </h2>
        <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-background">
          {FAQ.map((item) => (
            <div key={item.q} className="p-6">
              <h3 className="font-semibold text-ink">{item.q}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
