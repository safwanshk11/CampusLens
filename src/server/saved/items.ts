import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { currentUser } from "@/server/auth/session";

export const savedCollegeIds = cache(async () => {
  const user = await currentUser();
  if (!user) return [] as string[];
  const saved = await getDb().savedCollege.findMany({ where: { userId: user.id }, select: { collegeId: true } });
  return saved.map(item => item.collegeId);
});
export async function listSaved(userId: string) {
  const [colleges, comparisons] = await getDb().$transaction([
    getDb().savedCollege.findMany({ where: { userId }, orderBy: [{ createdAt: "desc" }, { collegeId: "asc" }], select: { college: { select: { id: true, slug: true, name: true, city: true, state: true, isDemo: true } } } }),
    getDb().savedComparison.findMany({ where: { userId }, orderBy: [{ createdAt: "desc" }, { id: "asc" }], select: { id: true, name: true, colleges: { orderBy: { position: "asc" }, select: { college: { select: { slug: true, name: true } } } } } }),
  ], { isolationLevel: "RepeatableRead" });
  return { colleges: colleges.map(item => item.college), comparisons };
}
