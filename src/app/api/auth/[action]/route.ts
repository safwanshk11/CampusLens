import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { credentialsSchema, registrationSchema } from "@/lib/auth-validation";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { cookieOptions, currentUser, newSession, SESSION_COOKIE, SESSION_SECONDS, tokenHash } from "@/server/auth/session";
import { failure, HttpError, privateHeaders, readJson, sameOrigin } from "@/server/auth/http";
import { throttleAuth } from "@/server/auth/throttle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ action: string }> };
type PublicUser = { id: string; name: string | null; email: string };
export async function GET(_request: Request, context: Context) {
  try {
    if ((await context.params).action !== "session") throw new HttpError(404, "Not found.");
    return Response.json({ user: await currentUser() }, { headers: privateHeaders });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    sameOrigin(request);
    const { action } = await context.params;
    const jar = await cookies();
    const previous = jar.get(SESSION_COOKIE)?.value;
    if (action === "logout") {
      if (previous) await getDb().session.deleteMany({ where: { tokenHash: tokenHash(previous) } });
      jar.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
      return Response.json({ ok: true }, { headers: privateHeaders });
    }
    if (action !== "register" && action !== "login") throw new HttpError(404, "Not found.");
    const body = await readJson(request);
    const credentials = credentialsSchema.parse(action === "register" ? (() => { const data = registrationSchema.parse(body); return { email: data.email, password: data.password }; })() : body);
    await throttleAuth(credentials.email);
    const session = newSession();
    let user: PublicUser;
    if (action === "register") {
      const { name } = registrationSchema.parse(body);
      const passwordHash = await hashPassword(credentials.password);
      user = await getDb().$transaction(async tx => {
        const created = await tx.user.create({ data: { email: credentials.email, name, passwordHash }, select: { id: true, name: true, email: true } });
        await tx.session.create({ data: { userId: created.id, tokenHash: session.tokenHash, expiresAt: session.expiresAt } });
        if (previous) await tx.session.deleteMany({ where: { tokenHash: tokenHash(previous) } });
        return created;
      });
    } else {
      const existing = await getDb().user.findUnique({ where: { email: credentials.email }, select: { id: true, name: true, email: true, passwordHash: true } });
      if (!(await verifyPassword(credentials.password, existing?.passwordHash ?? null)) || !existing) throw new HttpError(401, "Email or password is incorrect.");
      user = { id: existing.id, name: existing.name, email: existing.email };
      await getDb().$transaction(async tx => {
        if (previous) await tx.session.deleteMany({ where: { tokenHash: tokenHash(previous) } });
        await tx.session.create({ data: { userId: user.id, tokenHash: session.tokenHash, expiresAt: session.expiresAt } });
      });
    }
    jar.set(SESSION_COOKIE, session.token, { ...cookieOptions, maxAge: SESSION_SECONDS, expires: session.expiresAt });
    return Response.json({ user }, { status: action === "register" ? 201 : 200, headers: privateHeaders });
  } catch (error) { return failure(error); }
}
