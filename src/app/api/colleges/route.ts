import { NextResponse } from "next/server";
import { parseCollegeQuery } from "@/server/colleges/query";
import { searchColleges } from "@/server/colleges/search";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const parsed = parseCollegeQuery(new URL(request.url).searchParams);
  if (!parsed.success) return NextResponse.json({ error: { code: "INVALID_QUERY", message: "Check the search parameters.", issues: parsed.issues } }, { status: 400, headers });
  try {
    return NextResponse.json(await searchColleges(parsed.data), { headers });
  } catch {
    // Never log raw connection/config errors: they can contain credentials.
    console.error("College search failed: database query unavailable.");
    return NextResponse.json({ error: { code: "SEARCH_UNAVAILABLE", message: "College search is temporarily unavailable. Please try again." } }, { status: 503, headers });
  }
}
