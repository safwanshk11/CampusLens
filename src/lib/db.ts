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
    // Route handlers own error reporting; raw Prisma errors may expose connection details.
    log: env.NODE_ENV === "development" ? ["warn"] : [],
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
 * Phase 1 supplies the domain models; UI integration starts in Phase 2.
 */
export function getDb(): PrismaClient {
  globalForPrisma.__campuslensPrisma ??= createPrismaClient();
  return globalForPrisma.__campuslensPrisma;
}
