import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySession } from "./lib/auth";

// Next.js 16: this file was formerly `middleware.ts`. The handler must be
// exported as `proxy` (or default). Protects the admin dashboard + admin APIs.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always let the login page + login endpoint through.
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await verifySession(process.env.ADMIN_SECRET, token);
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/blocked-dates",
    "/api/blocked-dates/:path*",
  ],
};
