import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { getDb } from "../src/lib/db";
import { throttleAuth } from "../src/server/auth/throttle";
import { tokenHash } from "../src/server/auth/session";
process.loadEnvFile(".env.local");
assert(["localhost", "127.0.0.1"].includes(new URL(process.env.DATABASE_URL!).hostname), "Use a local test database");
const email = `throttle-${randomUUID()}@example.test`;
const key = `auth-email:${tokenHash(email)}`;
async function main() {
  try {
    const results = await Promise.allSettled(Array.from({ length: 12 }, () => throttleAuth(email)));
    assert.equal(results.filter(result => result.status === "fulfilled").length, 10);
    assert.equal((await getDb().authThrottle.findUniqueOrThrow({ where: { key } })).count, 12);
    await getDb().authThrottle.update({ where: { key }, data: { expiresAt: new Date(0) } });
    await throttleAuth(email);
    assert.equal((await getDb().authThrottle.findUniqueOrThrow({ where: { key } })).count, 1);
    console.log("Throttle passed: concurrent attempt limit and expired-window reset.");
  } finally {
    await getDb().authThrottle.deleteMany({ where: { key } });
    await getDb().$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
