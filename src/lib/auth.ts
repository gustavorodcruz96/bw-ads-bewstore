import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE = "bw_admin_session";
const SECRET = process.env.ADMIN_SESSION_SECRET || "bw-ads-default-secret-change-me";

export function createSession(userId: string, email: string): string {
  const payload = JSON.stringify({
    userId,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64") + "." + hmac;
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const [b64, hmac] = token.split(".");
    if (!b64 || !hmac) return null;

    const payload = Buffer.from(b64, "base64").toString("utf-8");
    const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
    if (hmac !== expected) return null;

    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;

    return { userId: data.userId, email: data.email };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}
