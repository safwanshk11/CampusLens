import test from "node:test";
import assert from "node:assert/strict";
import { realColleges, privateColleges } from "../prisma/real-colleges";
test("directory coverage and identities are stable", () => {
  assert.equal(realColleges.filter(c => c.institutionGroup === "IIT").length, 23);
  assert.equal(realColleges.filter(c => c.institutionGroup === "NIT").length, 31);
  assert.equal(realColleges.filter(c => c.institutionGroup === "AIIMS").length, 23);
  const all = [...realColleges, ...privateColleges];
  assert.equal(new Set(all.map(c => c.name)).size, all.length);
  for (const row of all) {
    assert.ok(row.city && row.state);
    assert.equal(new URL(row.sourceUrl).protocol, "https:");
  }
});
