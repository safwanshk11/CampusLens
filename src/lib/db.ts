import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { getServerEnv } from "@/lib/env";

const globalForPrisma = globalThis as typeof globalThis & {
  __campuslensPrisma?: PrismaClient;
};

function createPrismaClient(): PrismaClient {
  const env = getServerEnv();
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

/**
 * Shared Prisma client, created on first call.
 *
 * - Lazy: importing this module never validates env or opens a connection, so it
 *   cannot break a build.
 * - Cached on `globalThis`: Next.js hot reload re-evaluates modules in development;
 *   without the cache every reload would open a new connection pool.
 * - `server-only`: importing this from a Client Component fails the build instead
 *   of leaking database code to the browser.
 *
 * Phase 0 defines no models, so nothing calls this yet.
 */
export function getDb(): PrismaClient {
  globalForPrisma.__campuslensPrisma ??= createPrismaClient();
  return globalForPrisma.__campuslensPrisma;
}
