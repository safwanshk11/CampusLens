import test from "node:test";
import assert from "node:assert/strict";
import { matchDemoCourse, studentProfileSchema } from "../src/lib/student-profile";
const input = { stream: "Engineering", tenth: "", twelfth: "60", jeePercentile: "70", neetScore: null, examYear: "", otherExam: "", otherScore: "", state: "", interests: "", budget: "" };
const course = { discipline: "Engineering", degreeLevel: "UNDERGRADUATE", annualFeeInr: 100000 };
test("blank scores remain unknown and zero remains a score", () => {
  assert.equal(studentProfileSchema.parse(input).tenth, null);
  assert.equal(studentProfileSchema.parse({ ...input, tenth: "0" }).tenth, 0);
  for (const tenth of [-1, 101, true, "not a number"]) assert.equal(studentProfileSchema.safeParse({ ...input, tenth }).success, false);
});
test("matching handles boundaries, missing scores, budget and unknown real rules", () => {
  const profile = studentProfileSchema.parse(input);
  assert.equal(matchDemoCourse(profile, course, true)?.status, "Meets demo criteria");
  assert.equal(matchDemoCourse({ ...profile, jeePercentile: 69.9 }, course, true)?.status, "Below demo criteria");
  assert.equal(matchDemoCourse({ ...profile, jeePercentile: null }, course, true)?.status, "More information needed");
  assert.equal(matchDemoCourse({ ...profile, budget: 0 }, course, true), null);
  assert.equal(matchDemoCourse(profile, course, false)?.status, "Requirements unavailable");
  assert.equal(matchDemoCourse({ ...profile, stream: "Medical" }, course, true), null);
});
