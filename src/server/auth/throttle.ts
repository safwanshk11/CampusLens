import "server-only";
import { getDb } from "@/lib/db";
import { tokenHash } from "./session";
import { HttpError } from "./http";

async function consume(key: string, limit: number, seconds: number) {
  const db = getDb();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + seconds * 1000);
  // PostgreSQL locks the conflicting row so concurrent attempts cannot lose increments.
  const [{ count }] = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "AuthThrottle" (key, count, "expiresAt") VALUES (${key}, 1, ${expiresAt})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN "AuthThrottle"."expiresAt" <= ${now} THEN 1 ELSE "AuthThrottle".count + 1 END,
      "expiresAt" = CASE WHEN "AuthThrottle"."expiresAt" <= ${now} THEN ${expiresAt} ELSE "AuthThrottle"."expiresAt" END
    RETURNING count
  `;
  if (count > limit) throw new HttpError(429, "Too many attempts. Please try again later.");
}
export async function throttleAuth(email: string) {
  await consume("auth-global", 60, 60);
  await consume(`auth-email:${tokenHash(email)}`, 10, 900);
}
