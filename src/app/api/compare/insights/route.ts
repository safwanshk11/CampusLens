import { getCollegeDetail } from "@/server/colleges/detail";
import { comparisonSlugs, explainComparison } from "@/lib/comparison-insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const parsed = comparisonSlugs.safeParse(params.get("colleges"));
  if (!parsed.success || params.getAll("colleges").length !== 1)
    return Response.json(
      { error: "Choose two to four distinct college slugs." },
      { status: 400, headers },
    );
  try {
    const records = await Promise.all(parsed.data.map(getCollegeDetail));
    if (records.some((record) => !record))
      return Response.json(
        { error: "One or more colleges were not found." },
        { status: 404, headers },
      );
    const data = explainComparison(
      records.map((record) => ({
        slug: record!.slug,
        name: record!.name,
        isDemo: record!.isDemo,
        minFee: record!.courses[0]?.annualFeeInr ?? null,
        rating: record!.averageRating,
        reviewCount: record!.reviewCount,
        medianSalary: record!.placements[0]?.medianSalaryInr ?? null,
        placementYear: record!.placements[0]?.year ?? null,
      })),
    );
    return Response.json({ data }, { headers });
  } catch {
    console.error("Comparison analysis unavailable.");
    return Response.json(
      { error: "Analysis is temporarily unavailable. Please try again." },
      { status: 503, headers },
    );
  }
}
