import { getDb } from "@/lib/db";
import { generateCollegeEnrichment, GeminiError } from "@/server/colleges/gemini";
export const runtime = "nodejs";
export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const db = getDb();
  const college = await db.college.findUnique({ where: { slug }, select: { id: true, name: true, sourceUrl: true, aiEnrichment: true } });
  if (!college) return Response.json({ error: "College not found." }, { status: 404 });
  if (college.aiEnrichment) return Response.json({ data: college.aiEnrichment, cached: true });
  if (!college.sourceUrl) return Response.json({ error: "No official source is available for this college." }, { status: 422 });
  try {
    const source = await fetch(college.sourceUrl, { signal: AbortSignal.timeout(12000), headers: { "User-Agent": "CampusLens research preview" } });
    if (!source.ok) return Response.json({ error: "The official source could not be fetched." }, { status: 502 });
    const html = await source.text();
    const data = await generateCollegeEnrichment(college.name, college.sourceUrl, html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " "));
    await db.college.update({ where: { id: college.id }, data: { aiEnrichment: data } });
    return Response.json({ data, cached: false });
  } catch (error) { const status = error instanceof GeminiError && error.code === "RATE_LIMITED" ? 429 : 503; return Response.json({ error: "AI enrichment is unavailable right now." }, { status }); }
}
