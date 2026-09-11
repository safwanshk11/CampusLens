import { z } from "zod";
import { getDb } from "@/lib/db";
import { comparisonSlugs } from "@/lib/comparison-insights";
import { failure, HttpError, privateHeaders, readJson, requireUser, sameOrigin } from "@/server/auth/http";
import { listSaved } from "@/server/saved/items";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { const user = await requireUser(); return Response.json(await listSaved(user.id), { headers: privateHeaders }); }
  catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    const data = z.object({ name: z.string().trim().min(1).max(80), colleges: comparisonSlugs }).strict().parse(await readJson(request));
    const comparison = await getDb().$transaction(async tx => {
      const colleges = await tx.college.findMany({ where: { slug: { in: data.colleges } }, select: { id: true, slug: true } });
      if (colleges.length !== data.colleges.length) throw new HttpError(404, "A selected college is no longer available.");
      const ids = new Map(colleges.map(college => [college.slug, college.id]));
      return tx.savedComparison.create({ data: { userId: user.id, name: data.name, colleges: { create: data.colleges.map((slug, position) => ({ collegeId: ids.get(slug)!, position })) } }, select: { id: true, name: true } });
    });
    return Response.json({ comparison }, { status: 201, headers: privateHeaders });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    const { id } = z.object({ id: z.string().min(1).max(100) }).strict().parse(await readJson(request));
    const deleted = await getDb().savedComparison.deleteMany({ where: { id, userId: user.id } });
    if (!deleted.count) throw new HttpError(404, "Saved comparison not found.");
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) { return failure(error); }
}
