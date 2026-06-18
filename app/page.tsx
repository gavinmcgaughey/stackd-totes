import Link from "next/link";
import {
  Leaf,
  Truck,
  Sparkles,
  Clock,
  PackageCheck,
  Recycle,
  CalendarCheck,
  PhoneCall,
  ArrowRight,
  Check,
} from "lucide-react";
import { PACKAGES, SERVICE_AREA } from "@/lib/packages";

export default function Home() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-brand-black text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
              <Leaf className="h-3.5 w-3.5 text-brand" />
              Eco-friendly moving, delivered
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Moving boxes,{" "}
              <span className="text-brand">reinvented.</span>
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
              Clean, reusable totes and dollies delivered to your door. Pack at
              your pace, then we pick them up. No cardboard, no waste, no hassle.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/20 transition-colors hover:bg-brand-dark"
              >
                Reserve your totes <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Serving {SERVICE_AREA.join(", ")}{" "}Counties · Greater Cincinnati &amp; Dayton
            </p>
          </div>

          {/* Stacked-totes visual */}
          <div className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                  style={{ transform: `translateX(${i * 14}px)` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/20">
                      <PackageCheck className="h-5 w-5 text-brand" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Reusable tote</p>
                      <p className="text-xs text-white/50">Clean · stackable · sturdy</p>
                    </div>
                  </div>
                  <Check className="h-5 w-5 text-brand" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Value props ---------- */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Recycle, title: "Zero cardboard", body: "One set of totes replaces hundreds of boxes — and the recycling runs." },
            { icon: Truck, title: "Door-to-door", body: "We drop off before your move and pick up after. You never leave home." },
            { icon: Sparkles, title: "Clean & sturdy", body: "Sanitized between every rental. Lids snap shut — no tape required." },
            { icon: Clock, title: "Save hours", body: "No building boxes, no breaking them down. Pack, move, done." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-line bg-background p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                <Icon className="h-5 w-5 text-brand" />
              </span>
              <h3 className="mt-4 font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">How it works</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Three steps. Zero cardboard.
            </h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: CalendarCheck, step: "01", title: "Reserve online", body: "Pick your package and your delivery & pickup dates. Booking takes two minutes." },
              { icon: Truck, step: "02", title: "We deliver", body: "Clean totes and dollies arrive at your door — ready to pack the moment you are." },
              { icon: PackageCheck, step: "03", title: "We pick up", body: "Done unpacking? We swing by and haul it all away. Nothing to store or recycle." },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={step} className="relative rounded-2xl border border-line bg-background p-7">
                <span className="absolute right-6 top-6 text-3xl font-extrabold text-line">{step}</span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Mission / Why ---------- */}
      <section className="bg-brand-black text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Why we do it</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Moving shouldn&apos;t cost the earth.
            </h2>
            <p className="mt-5 leading-relaxed text-white/70">
              The average move burns through 60+ cardboard boxes — bought, taped,
              filled, then flattened and tossed weeks later. Multiply that across a
              neighborhood and it&apos;s a mountain of waste for something used once.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              We started Stack&apos;d to make the greener choice the easier choice.
              Our totes get reused hundreds of times, they&apos;re sturdier than any
              box, and they show up clean at your door. Better for your move, better
              for the planet.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { stat: "100s", label: "of reuses per tote" },
              { stat: "0", label: "boxes to recycle" },
              { stat: "2 min", label: "to book online" },
              { stat: "4", label: "counties served" },
            ].map(({ stat, label }) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <p className="text-3xl font-extrabold text-brand">{stat}</p>
                <p className="mt-1 text-sm text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials (hidden until reviews come in) ----------
          When you have customer reviews, drop a testimonials section here with
          id="founder" (or rename the nav link). Hidden for now. */}

      {/* ---------- Pricing preview ---------- */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand">Simple pricing</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                Pick the package that fits your move.
              </h2>
            </div>
            <Link href="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
              View full pricing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative flex flex-col rounded-2xl border bg-background p-7 ${
                  pkg.popular ? "border-brand shadow-lg shadow-brand/10" : "border-line"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-semibold text-ink">{pkg.name}</h3>
                <p className="mt-1 text-sm text-muted">{pkg.bestFor}</p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-ink">${pkg.price}</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/order?package=${pkg.id}`}
                  className={`mt-7 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                    pkg.popular
                      ? "bg-brand text-white hover:bg-brand-dark"
                      : "border border-line text-ink hover:border-brand hover:text-brand"
                  }`}
                >
                  Reserve this
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section>
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-14 text-center text-white sm:px-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready for a cardboard-free move?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              Reserve your totes in two minutes. We&apos;ll handle the rest.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/order"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-brand transition-transform hover:scale-[1.02]"
              >
                Reserve your totes <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://www.facebook.com/profile.php?id=61588798692054"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10"
              >
                <PhoneCall className="h-4 w-4" /> Message us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
