import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { createCliDb } from "./client";
import { demoColleges, demoSlug } from "./seed-data";

const db = createCliDb();
async function main() {
  const colleges = await db.college.findMany({ where: { slug: { in: demoColleges.map(([name]) => demoSlug(name)) } }, include: { courses: true, placements: true, reviews: true } });
  assert.equal(colleges.length, 12);
  assert.equal(colleges.flatMap((college) => college.courses).length, 36);
  assert.equal(colleges.flatMap((college) => college.placements).length, 22);
  assert.equal(colleges.flatMap((college) => college.reviews).length, 10);
  assert(colleges.every((college) => college.isDemo));
  assert(colleges.some((college) => college.placements.length === 0));
  const collegeId = colleges[0].id;
  const userId = `verify-${randomUUID()}`;
  try {
    await db.user.create({ data: { id: userId, email: `${userId}@campuslens.example` } });
    await db.savedCollege.create({ data: { userId, collegeId } });
    await assert.rejects(db.savedCollege.create({ data: { userId, collegeId } }), { code: "P2002" });
    await assert.rejects(db.savedCollege.create({ data: { userId, collegeId: "missing-college" } }), { code: "P2003" });
    await assert.rejects(db.review.create({ data: { userId, collegeId, rating: 6, title: "Invalid", body: "Must fail" } }));
    await assert.rejects(db.course.update({ where: { id: colleges[0].courses[0].id }, data: { annualFeeInr: -1 } }));
    await assert.rejects(db.placement.create({ data: { collegeId, year: 2099, eligibleStudents: 10, placedStudents: 11 } }));
    const comparison = await db.savedComparison.create({ data: { userId, name: "Verification", colleges: { create: [{ collegeId, position: 0 }, { collegeId: colleges[1].id, position: 1 }] } }, include: { colleges: { orderBy: { position: "asc" } } } });
    assert.deepEqual(comparison.colleges.map((entry) => entry.position), [0, 1]);
    await assert.rejects(db.comparisonCollege.create({ data: { comparisonId: comparison.id, collegeId: colleges[2].id, position: 0 } }), { code: "P2002" });
    await assert.rejects(db.comparisonCollege.create({ data: { comparisonId: comparison.id, collegeId: colleges[2].id, position: 4 } }));
    await db.user.delete({ where: { id: userId } });
    assert.equal(await db.savedCollege.count({ where: { userId } }), 0);
    assert.equal(await db.savedComparison.count({ where: { userId } }), 0);
    assert.equal(await db.comparisonCollege.count({ where: { comparisonId: comparison.id } }), 0);
  } finally {
    await db.user.deleteMany({ where: { id: userId } });
  }
  console.log("Verified fixture counts, missing data, uniqueness, foreign keys, value constraints, comparison ordering and cascading user deletion.");
}
main().catch(() => { console.error("Database verification failed. Check migrations and run the seed first."); process.exitCode = 1; }).finally(() => db.$disconnect());
