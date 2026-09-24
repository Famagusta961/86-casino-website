import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const COOKIE = "86_admin_session";
function secret() { return process.env.SESSION_SECRET || "development-only-change-me"; }
export async function validAdmin(email: string, password: string) {
  if (email !== process.env.ADMIN_EMAIL) return false;
  if (process.env.ADMIN_PASSWORD_HASH) return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  return Boolean(process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD);
}
function signature(value: string) { return crypto.createHmac("sha256", secret()).update(value).digest("hex"); }
export async function setAdminSession() { const value = `admin.${Date.now()}`; (await cookies()).set(COOKIE, `${value}.${signature(value)}`, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 }); }
export async function clearAdminSession() { (await cookies()).delete(COOKIE); }
export async function requireAdmin() { const raw = (await cookies()).get(COOKIE)?.value; if (!raw) return false; const dot = raw.lastIndexOf("."); if (dot < 1) return false; const value = raw.slice(0, dot); const provided = raw.slice(dot + 1); const expected = signature(value); return provided.length === expected.length && crypto.timingSafeEqual(Buffer.from(provided), Buffer.from(expected)); }
export { COOKIE };