import { getDb } from "@/lib/db";
import { studentProfileSchema } from "@/lib/student-profile";
import { failure, privateHeaders, readJson, requireUser, sameOrigin } from "@/server/auth/http";

export async function PUT(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    const profile = studentProfileSchema.parse(await readJson(request));
    await getDb().user.update({ where: { id: user.id }, data: { studentProfile: profile } });
    return Response.json({ ok: true }, { headers: privateHeaders });
  } catch (error) { return failure(error); }
}
