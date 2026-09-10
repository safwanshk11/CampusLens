import assert from "node:assert/strict";
const origin = process.env.TEST_BASE_URL || "http://localhost:3210";
async function main() {
  const response = await fetch(`${origin}/api/colleges/demo-aurora-institute-of-technology`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const { data } = await response.json();
  assert.equal(data.courses.length, 3);
  assert.equal(data.placements[0].year, 2025);
  assert.equal(data.averageRating, 3);
  assert.equal(data.reviewCount, 1);
  assert.equal(data.isDemo, true);
  for (const review of data.reviews) { assert(!("userId" in review)); assert(!("user" in review)); assert(!("email" in review)); }
  const empty = await (await fetch(`${origin}/api/colleges/demo-horizon-fields-institute`)).json();
  assert.equal(empty.data.placements.length, 0);
  assert.equal(empty.data.averageRating, null);
  assert.equal(empty.data.reviews.length, 0);
  for (const slug of ["missing-college", "invalid_slug"]) {
    const result = await fetch(`${origin}/api/colleges/${slug}`);
    assert.equal(result.status, 404);
    assert.equal((await result.json()).error.code, "COLLEGE_NOT_FOUND");
  }
  console.log("Detail API passed: courses, placement ordering, ratings, privacy, demo labels, missing data and 404s.");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
