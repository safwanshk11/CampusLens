import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export type HealthResponse = {
  status: "ok";
  service: "campuslens";
  phase: 0;
  /** Whether a valid DATABASE_URL is configured. No connection is attempted in Phase 0. */
  database: "configured" | "not_configured";
  timestamp: string;
};

export function GET() {
  const body: HealthResponse = {
    status: "ok",
    service: "campuslens",
    phase: 0,
    database: isDatabaseConfigured() ? "configured" : "not_configured",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
}
