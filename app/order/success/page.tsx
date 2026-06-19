import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reservation Confirmed",
  robots: { index: false },
};

export default function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10">
        <CheckCircle2 className="h-9 w-9 text-brand" />
      </span>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        You&apos;re booked! 🎉
      </h1>
      <p className="mt-3 text-muted">
        Thanks for reserving with Stack&apos;d Totes. We&apos;ve emailed your
        confirmation and we&apos;ll be in touch shortly to lock in your delivery
        window. No cardboard, no waste, no hassle.
      </p>
      <ConfirmationCode searchParams={searchParams} />
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

async function ConfirmationCode({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  if (!code) return null;
  return (
    <div className="mt-6 rounded-xl border-2 border-brand bg-brand/5 px-8 py-4">
      <p className="text-xs font-medium uppercase tracking-widest text-muted">
        Confirmation code
      </p>
      <p className="mt-1 text-2xl font-bold tracking-widest text-brand">{code}</p>
      <p className="mt-1 text-xs text-muted">Save this — it&apos;s also in your email.</p>
    </div>
  );
}
