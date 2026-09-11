import "server-only";
import { z } from "zod";
import { Prisma } from "@/generated/prisma/client";
import { currentUser } from "./session";

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export const privateHeaders = { "Cache-Control": "private, no-store", Vary: "Cookie" };
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin || request.headers.get("sec-fetch-site") === "cross-site") throw new HttpError(403, "This request is not allowed.");
}
export async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new HttpError(415, "Send JSON data.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Request data is missing.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { value, done } = await reader.read(); if (done) break;
    size += value.length;
    if (size > 8192) { await reader.cancel(); throw new HttpError(413, "Request is too large."); }
    chunks.push(value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new HttpError(400, "Invalid JSON data."); }
}
export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new HttpError(401, "Sign in to continue.");
  return user;
}
export function failure(error: unknown) {
  if (error instanceof HttpError) return Response.json({ error: error.message }, { status: error.status, headers: privateHeaders });
  if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message || "Check your input." }, { status: 400, headers: privateHeaders });
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") return Response.json({ error: "Could not create this account. Try signing in instead." }, { status: 409, headers: privateHeaders });
  console.error("Account request failed.");
  return Response.json({ error: "The service is temporarily unavailable. Please try again." }, { status: 503, headers: privateHeaders });
}
