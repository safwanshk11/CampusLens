import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

process.loadEnvFile(".env.local");
const origin = process.env.TEST_BASE_URL || "http://localhost:3210";
assert(["localhost", "127.0.0.1"].includes(new URL(origin).hostname), "Use a local test server");
assert(["localhost", "127.0.0.1"].includes(new URL(process.env.DATABASE_URL!).hostname), "Use a local test database");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const emails = [0, 1].map(i => `phase7-${randomUUID()}-${i}@example.test`);
const password = randomUUID();
async function request(path: string, cookie = "", method = "GET", body?: unknown, source = origin) {
  return fetch(`${origin}${path}`, { method, headers: { cookie, origin: source, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
}
async function main() {
  try {
    assert.equal((await request("/api/saved/comparisons")).status, 401);
    const cookies: string[] = [];
    for (const email of emails) {
      const response = await request("/api/auth/register", "", "POST", { name: "Phase 7 test", email, password });
      assert.equal(response.status, 201);
      const cookie = response.headers.get("set-cookie")!;
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /SameSite=lax/i);
      cookies.push(cookie.split(";")[0]);
      const { user } = await response.json();
      assert(!("passwordHash" in user));
    }
    const [a, b] = cookies;
    const { data: college } = await (await request("/api/colleges/demo-aurora-institute-of-technology")).json();
    const save = { collegeId: college.id, saved: true };
    assert.equal((await request("/api/saved/colleges", a, "POST", save, "https://foreign.example")).status, 403);
    for (let i = 0; i < 2; i++) assert.equal((await request("/api/saved/colleges", a, "POST", save)).status, 200);
    assert.equal((await (await request("/api/saved/comparisons", a)).json()).colleges.length, 1);
    assert.equal((await (await request("/api/saved/comparisons", b)).json()).colleges.length, 0);
    const response = await request("/api/saved/comparisons", a, "POST", { name: "Test shortlist", colleges: [college.slug, "demo-bluehaven-university"].join(",") });
    assert.equal(response.status, 201);
    const { comparison } = await response.json();
    assert.equal((await request("/api/saved/comparisons", b, "DELETE", { id: comparison.id })).status, 404);
    assert.equal((await request("/api/saved/comparisons", a, "DELETE", { id: comparison.id })).status, 200);
    const profile = { stream: "Engineering", tenth: 90, twelfth: 85, jeePercentile: 95, neetScore: null, examYear: 2026, otherExam: "", otherScore: "", state: "", interests: "", budget: null };
    assert.equal((await request("/api/account/profile", a, "PUT", { ...profile, tenth: 101 })).status, 400);
    assert.equal((await request("/api/account/profile", a, "PUT", profile)).status, 200);
    assert.deepEqual((await db.user.findUniqueOrThrow({ where: { email: emails[0] } })).studentProfile, profile);
    const filtered = await (await request("/discover?q=Bathinda", a)).text();
    assert(!filtered.includes("All India Institute of Medical Sciences Bathinda"));
    const unfiltered = await (await request("/discover?q=Bathinda&academic=off", a)).text();
    assert(unfiltered.includes("All India Institute of Medical Sciences Bathinda"));
    assert.equal((await request("/api/auth/logout", a, "POST")).status, 200);
    assert.equal((await request("/api/saved/comparisons", a)).status, 401);
    assert.equal((await request("/api/auth/login", "", "POST", { email: emails[0], password: "incorrect-password" })).status, 401);
    assert.equal((await request("/api/auth/login", "", "POST", { email: emails[0], password })).status, 200);
    console.log("Account API passed: registration, cookie flags, login/logout, profile validation/persistence, idempotent saves, user isolation and origin protection.");
  } finally {
    await db.user.deleteMany({ where: { email: { in: emails } } });
    await db.authThrottle.deleteMany({ where: { key: { in: emails.map(email => `auth-email:${createHash("sha256").update(email).digest("hex")}`) } } });
    await db.$disconnect();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
