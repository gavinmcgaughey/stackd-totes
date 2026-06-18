import type { Metadata } from "next";
import { getPackage } from "@/lib/packages";
import { OrderForm } from "./OrderForm";

export const metadata: Metadata = {
  title: "Reserve Your Totes",
  description:
    "Book your eco-friendly moving totes online. Choose a package and your delivery & pickup dates.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const sp = await searchParams;
  const initialPackageId =
    sp.package && getPackage(sp.package) ? sp.package : "medium";

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          Reserve
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink">
          Book your totes
        </h1>
        <p className="mt-3 text-muted">
          Choose a package, pick your dates, and we&apos;ll take it from there.
          You pay on delivery — no card needed to reserve.
        </p>
      </div>
      <div className="mt-10">
        <OrderForm initialPackageId={initialPackageId} />
      </div>
    </div>
  );
}
