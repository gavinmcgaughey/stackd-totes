import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!expected || !secret) {
    return NextResponse.json(
      { error: "Admin isn't configured. Set ADMIN_PASSWORD and ADMIN_SECRET." },
      { status: 500 },
    );
  }
  if (!password || password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const token = await createSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
