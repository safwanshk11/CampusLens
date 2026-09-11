import "server-only";
import { getDb } from "@/lib/db";
import { tokenHash } from "./session";
import { HttpError } from "./http";

async function consume(key: string, limit: number, seconds: number) {
  const db = getDb();
  const now = new Date();
  const existing = await db.authThrottle.findUnique({ where: { key } });
  const expired = !existing || existing.expiresAt <= now;
  const count = expired ? 1 : existing.count + 1;
  await db.authThrottle.upsert({
    where: { key },
    create: { key, count: 1, expiresAt: new Date(now.getTime() + seconds * 1000) },
    update: { count, ...(expired ? { expiresAt: new Date(now.getTime() + seconds * 1000) } : {}) },
  });
  if (count > limit) throw new HttpError(429, "Too many attempts. Please try again later.");
}
export async function throttleAuth(email: string) {
  await consume("auth-global", 60, 60);
  await consume(`auth-email:${tokenHash(email)}`, 10, 900);
}
