import crypto from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
const COOKIE = "86_admin_session";
const MAX_AGE = 60 * 60 * 12;
function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value && process.env.NODE_ENV === "production")
    throw new Error("SESSION_SECRET is required");
  return value || "development-only-change-me";
}
export async function validAdmin(email: string, password: string) {
  if (email !== process.env.ADMIN_EMAIL) return false;
  if (process.env.ADMIN_PASSWORD_HASH)
    return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  return Boolean(
    process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD,
  );
}
function signature(value: string) {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}
export async function setAdminSession() {
  const value = `admin.${Date.now()}`;
  (await cookies()).set(COOKIE, `${value}.${signature(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}
export async function clearAdminSession() {
  (await cookies()).delete(COOKIE);
}
export async function requireAdmin() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const match = /^admin\.(\d+)\.([a-f0-9]{64})$/.exec(raw);
  if (!match) return false;
  const age = Date.now() - Number(match[1]);
  if (age < 0 || age > MAX_AGE * 1000) return false;
  const value = `admin.${match[1]}`;
  return crypto.timingSafeEqual(
    Buffer.from(match[2]),
    Buffer.from(signature(value)),
  );
}
export { COOKIE };
