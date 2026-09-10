import { getCollegeDetail } from "@/server/colleges/detail";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const college = await getCollegeDetail((await params).slug);
    return college
      ? Response.json({ data: college }, { headers })
      : Response.json(
          {
            error: { code: "COLLEGE_NOT_FOUND", message: "College not found." },
          },
          { status: 404, headers },
        );
  } catch {
    console.error("College detail unavailable.");
    return Response.json(
      {
        error: {
          code: "DETAIL_UNAVAILABLE",
          message: "College details are temporarily unavailable.",
        },
      },
      { status: 503, headers },
    );
  }
}
