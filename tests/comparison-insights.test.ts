import test from "node:test";
import assert from "node:assert/strict";
import {
  comparisonSlugs,
  explainComparison,
} from "../src/lib/comparison-insights";
const a = {
  slug: "alpha",
  name: "Alpha",
  isDemo: true,
  minFee: 40000,
  rating: 4,
  reviewCount: 2,
  medianSalary: 500000,
  placementYear: 2025,
};
const b = {
  ...a,
  slug: "beta",
  name: "Beta",
  minFee: 60000,
  medianSalary: 700000,
};
test("leaders reflect opposing strengths and preserve ties", () => {
  const result = explainComparison([a, b]);
  assert.deepEqual(
    result.insights.map((item) => item.leaders),
    [["alpha"], ["beta"], ["alpha", "beta"]],
  );
  assert.match(result.notice, /fictional/);
});
test("missing figures and mismatched years never produce a salary winner", () => {
  for (const changed of [
    { ...b, placementYear: 2024 },
    { ...b, medianSalary: null },
  ]) {
    assert.deepEqual(explainComparison([a, changed]).insights[1].leaders, []);
  }
  assert.deepEqual(
    explainComparison([a, { ...b, rating: null }]).insights[2].leaders,
    [],
  );
});
test("zero fee is real data", () =>
  assert.deepEqual(
    explainComparison([a, { ...b, minFee: 0 }]).insights[0].leaders,
    ["beta"],
  ));
test("comparison input is bounded, distinct and strict", () => {
  assert(comparisonSlugs.safeParse("alpha,beta").success);
  for (const raw of [
    "alpha",
    "alpha,alpha",
    "a,b,c,d,e",
    "alpha,",
    "alpha,invalid_slug",
  ])
    assert(!comparisonSlugs.safeParse(raw).success);
});
