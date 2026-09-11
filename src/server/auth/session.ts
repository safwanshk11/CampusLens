import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { createHash, randomBytes } from "node:crypto";
import { getDb } from "@/lib/db";

export const SESSION_COOKIE = "campuslens_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function newSession() {
  const token = randomBytes(32).toString("hex");
  return { token, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000) };
}
export const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/" };
export const currentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await getDb().session.findUnique({ where: { tokenHash: tokenHash(token) }, select: { expiresAt: true, user: { select: { id: true, name: true, email: true } } } });
  return session && session.expiresAt > new Date() ? session.user : null;
});
