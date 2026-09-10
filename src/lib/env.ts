import "server-only";
import { z } from "zod";

const databaseUrl = z.url({
  protocol: /^postgres(ql)?$/,
  error: "DATABASE_URL must be a postgres:// or postgresql:// connection string",
});

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: databaseUrl,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | undefined;

/**
 * Validated server environment.
 *
 * Parsed lazily on first use rather than at import time, so routes that never touch
 * the database (all of Phase 0) build and deploy without `DATABASE_URL`. The first
 * data-access call fails fast with a readable report if anything is missing.
 */
export function getServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error(`Invalid server environment variables:\n${z.prettifyError(result.error)}`);
  }

  cachedServerEnv = result.data;
  return cachedServerEnv;
}

/** Whether a valid database URL is present. Never throws and never exposes the value. */
export function isDatabaseConfigured(): boolean {
  return databaseUrl.safeParse(process.env.DATABASE_URL).success;
}

/** Public origin for canonical URLs and Open Graph metadata. */
export function getSiteUrl(): URL {
  const explicit = z.url().safeParse(process.env.NEXT_PUBLIC_SITE_URL);
  if (explicit.success) return new URL(explicit.data);

  if (process.env.VERCEL_URL) return new URL(`https://${process.env.VERCEL_URL}`);

  return new URL("http://localhost:3000");
}
