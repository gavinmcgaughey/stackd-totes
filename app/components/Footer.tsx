import Link from "next/link";
import { Logo } from "./Logo";
import { SERVICE_AREA } from "@/lib/packages";

export function Footer() {
  return (
    <footer className="border-t border-line bg-brand-black text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo dark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
            Eco-friendly moving tote rental. We deliver clean, reusable totes and
            dollies straight to your door — no cardboard, no waste, no hassle.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/#how" className="hover:text-brand">How it works</Link></li>
            <li><Link href="/pricing" className="hover:text-brand">Pricing</Link></li>
            <li><Link href="/order" className="hover:text-brand">Reserve totes</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Service area</h3>
          <p className="mt-4 text-sm text-white/60">
            Serving {SERVICE_AREA.join(", ")}{" "}Counties and the greater
            Cincinnati &amp; Dayton area.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} Stack&apos;d Totes. All rights reserved.</p>
          <p>Reusable. Reliable. Delivered.</p>
        </div>
      </div>
    </footer>
  );
}
