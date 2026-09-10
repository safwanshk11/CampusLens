import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

for (const file of [".env.local", ".env"]) {
  try { process.loadEnvFile(file); }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export function createCliDb() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Set DATABASE_URL in .env.local before running database commands.");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}
