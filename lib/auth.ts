// Lightweight admin session using a signed (HMAC) cookie.
// Uses Web Crypto so it works in both the Proxy (edge) and route handlers.

const SESSION_PAYLOAD = "stackd-admin-v1";
export const ADMIN_COOKIE = "stackd_admin";

function enc(s: string): Uint8Array<ArrayBuffer> {
  return new TextEncoder().encode(s) as Uint8Array<ArrayBuffer>;
}

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc(data));
  return toHex(sig);
}

export async function createSessionToken(secret: string): Promise<string> {
  return hmac(secret, SESSION_PAYLOAD);
}

export async function verifySession(
  secret: string | undefined,
  token: string | undefined,
): Promise<boolean> {
  if (!secret || !token) return false;
  const expected = await hmac(secret, SESSION_PAYLOAD);
  if (expected.length !== token.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return diff === 0;
}
