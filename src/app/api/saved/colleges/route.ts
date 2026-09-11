import { z } from "zod";
import { getDb } from "@/lib/db";
import { failure, HttpError, privateHeaders, readJson, requireUser, sameOrigin } from "@/server/auth/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    const { collegeId, saved } = z.object({ collegeId: z.string().min(1).max(100), saved: z.boolean() }).strict().parse(await readJson(request));
    if (saved) {
      if (!(await getDb().college.findUnique({ where: { id: collegeId }, select: { id: true } }))) throw new HttpError(404, "College not found.");
      await getDb().savedCollege.upsert({ where: { userId_collegeId: { userId: user.id, collegeId } }, create: { userId: user.id, collegeId }, update: {} });
    } else await getDb().savedCollege.deleteMany({ where: { userId: user.id, collegeId } });
    return Response.json({ saved }, { headers: privateHeaders });
  } catch (error) { return failure(error); }
}
