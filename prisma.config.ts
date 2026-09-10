import { defineConfig } from "prisma/config";

// The Prisma CLI does not read .env files by itself. Node's built-in loader
// (Node >= 20.12) covers it without a dotenv dependency. Missing files are
// expected: on Vercel, variables come from project settings. Existing
// variables are never overwritten, so .env.local takes precedence.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
