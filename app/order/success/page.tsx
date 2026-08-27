import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { lookupPublicBooking, type PublicBooking } from "@/lib/confirmation";
import { prettyDate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reservation",
  robots: { index: false },
};

type SuccessSearch = {
  code?: string | string[];
  session_id?: string | string[];
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<SuccessSearch>;
}) {
  const sp = await searchParams;
  const booking = await lookupPublicBooking(sp);

  if (!booking) {
    return <EmptyState />;
  }

  return <BookedState booking={booking} />;
}

function EmptyState() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
        <CalendarDays className="h-8 w-8 text-muted" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        No reservation here
      </h1>
      <p className="mt-3 text-muted">
        We couldn&apos;t find a booking for this link. If you just reserved, use
        the confirmation code from your email (it starts with STK-). If you
        haven&apos;t booked yet, you can reserve your totes from the order page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/order"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Reserve totes
        </Link>
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

function BookedState({ booking }: { booking: PublicBooking }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <CheckCircle2 className="h-9 w-9 text-brand" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        You&apos;re booked
      </h1>
      <p className="mt-3 text-muted">
        Thanks for reserving with Stack&apos;d Totes. We&apos;ve emailed your
        confirmation and we&apos;ll be in touch shortly to lock in your delivery
        window.
      </p>
      <div className="mt-6 rounded-xl border-2 border-brand bg-brand/5 px-8 py-4">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">
          Confirmation code
        </p>
        <p className="mt-1 text-2xl font-bold tracking-widest text-brand">
          {booking.confirmation_code}
        </p>
        <p className="mt-3 text-sm text-ink">
          {booking.package_name}
        </p>
        <p className="mt-1 text-xs text-muted">
          Delivery {prettyDate(booking.delivery_date)} · Pickup{" "}
          {prettyDate(booking.pickup_date)}
        </p>
        <p className="mt-2 text-xs text-muted">
          Save this — it&apos;s also in your email.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Back to home
        </Link>
        <Link
          href="/pricing"
          className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-brand hover:text-brand"
        >
          View pricing
        </Link>
      </div>
    </div>
  );
}
