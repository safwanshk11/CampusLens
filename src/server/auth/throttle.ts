import "server-only";
import { getDb } from "@/lib/db";
import { tokenHash } from "./session";
import { HttpError } from "./http";

async function consume(key: string, limit: number, seconds: number) {
  const rows = await getDb().$queryRaw<{ count: number }[]>`
    INSERT INTO "AuthThrottle" ("key", "count", "expiresAt") VALUES (${key}, 1, NOW() + ${seconds} * INTERVAL '1 second')
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "AuthThrottle"."expiresAt" <= NOW() THEN 1 ELSE "AuthThrottle"."count" + 1 END,
      "expiresAt" = CASE WHEN "AuthThrottle"."expiresAt" <= NOW() THEN NOW() + ${seconds} * INTERVAL '1 second' ELSE "AuthThrottle"."expiresAt" END
    RETURNING "count"`;
  if (rows[0].count > limit) throw new HttpError(429, "Too many attempts. Please try again later.");
}
export async function throttleAuth(email: string) {
  await consume("auth-global", 60, 60);
  await consume(`auth-email:${tokenHash(email)}`, 10, 900);
}
