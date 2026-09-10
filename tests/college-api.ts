import assert from "node:assert/strict";
import type { CollegeSearchResponse } from "../src/server/colleges/search";

const origin = process.env.TEST_BASE_URL || "http://localhost:3210";
async function search(query = ""): Promise<CollegeSearchResponse> {
  const response = await fetch(`${origin}/api/colleges?${query}`);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  return response.json();
}
async function main() {
  const all = await search("pageSize=50");
  assert.equal(all.pagination.total, 12, "Run against the Phase 1 seed database only");
  assert.equal(all.data.length, 12);
  assert(all.meta.demoDataNotice);
  assert(all.data.every((college) => college.isDemo));
  assert(all.data.every((college) => !("email" in college) && !("reviews" in college)));
  const city = await search("q=bEnGaLuRu");
  assert.equal(city.data.length, 2);
  assert(city.data.every((college) => college.city === "Bengaluru"));
  assert.equal((await search("q=computer%20science")).pagination.total, 12);
  assert.equal((await search("q=aurora")).data[0].slug, "demo-aurora-institute-of-technology");
  const filtered = await search("city=bengaluru&state=karnataka&ownership=PUBLIC&discipline=engineering&degreeLevel=UNDERGRADUATE&maxFee=50000");
  assert.equal(filtered.data.length, 1);
  assert.equal(filtered.data[0].minAnnualFeeInr, 40000);
  assert.equal(filtered.data[0].matchingCourseCount, 1);
  // Aurora has a 52k BBA but its engineering programme costs 40k.
  assert.equal((await search("q=aurora&discipline=Engineering&minFee=50000&maxFee=60000")).pagination.total, 0);
  assert.equal((await search("q=business&discipline=Engineering")).pagination.total, 0);
  const fees = await search("sort=fee_desc&pageSize=50");
  assert.deepEqual(fees.data.map((college) => college.minAnnualFeeInr), all.data.map((college) => college.minAnnualFeeInr).sort((a, b) => b! - a!));
  const ratings = await search("sort=rating_desc&pageSize=50");
  assert.equal(ratings.data.at(-1)?.averageRating, null);
  assert((await search("minRating=4.5")).data.every((college) => college.averageRating! >= 4.5));
  const noReviews = all.data.find((college) => college.slug === "demo-horizon-fields-institute")!;
  assert.equal(noReviews.averageRating, null);
  assert.equal(noReviews.reviewCount, 0);
  assert.equal(noReviews.placementYear, null);
  assert.equal(noReviews.medianSalaryInr, null);
  const partial = all.data.find((college) => college.slug === "demo-suncrest-college")!;
  assert.equal(partial.placementYear, 2025);
  assert.equal(partial.medianSalaryInr, null);
  const pages = [];
  for (let page = 1; page <= 4; page++) pages.push(...(await search(`page=${page}&pageSize=3`)).data);
  assert.deepEqual(pages.map((college) => college.id), all.data.map((college) => college.id));
  const outside = await search("page=100");
  assert.equal(outside.data.length, 0);
  assert.equal(outside.pagination.total, 12);
  assert.equal(outside.pagination.hasNextPage, false);
  for (const query of ["q=does-not-exist", "q=%25", "q=_", "q=%27%20OR%201%3D1--", "q=%5C"]) {
    const empty = await search(query);
    assert.equal(empty.pagination.total, 0);
    assert.equal(empty.pagination.totalPages, 0);
    assert.equal(empty.pagination.hasPreviousPage, false);
  }
  for (const query of ["page=0", "pageSize=99999", "sort=invalid", "minFee=10&maxFee=1", "city=a&city=b", "extra=1"]) {
    const response = await fetch(`${origin}/api/colleges?${query}`);
    assert.equal(response.status, 400);
    assert.equal((await response.json()).error.code, "INVALID_QUERY");
  }
  assert.equal((await fetch(`${origin}/api/colleges`, { method: "POST" })).status, 405);
  console.log("College API passed: search, combined filters, matching-course fees, sort, missing data, stable pages, literal wildcard/injection inputs, validation and unsupported method.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
