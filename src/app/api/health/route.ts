import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/env";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export type HealthResponse = {
  status: "ok" | "unavailable";
  service: "campuslens";
  database: "connected" | "unavailable" | "not_configured";
  timestamp: string;
};

export async function GET() {
  let database: HealthResponse["database"] = "not_configured";
  if (isDatabaseConfigured()) {
    try {
      await getDb().$queryRaw`SELECT 1`;
      database = "connected";
    } catch {
      database = "unavailable";
    }
  }
  const body: HealthResponse = {
    status: database === "connected" ? "ok" : "unavailable",
    service: "campuslens",
    database,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { status: body.status === "ok" ? 200 : 503, headers: { "Cache-Control": "no-store" } });
}
