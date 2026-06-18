import Link from "next/link";
import { Logo } from "./Logo";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="Stack'd Totes home">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-medium text-ink md:flex">
          <Link href="/#how" className="hover:text-brand transition-colors">
            How it works
          </Link>
          <Link href="/pricing" className="hover:text-brand transition-colors">
            Pricing
          </Link>
        </div>
        <Link
          href="/order"
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          Reserve totes
        </Link>
      </nav>
    </header>
  );
}
