import assert from "node:assert/strict";
import test from "node:test";
import { parseCollegeQuery } from "../src/server/colleges/query";

test("defaults and whitespace normalization", () => {
  const result = parseCollegeQuery(new URLSearchParams("q=%20Bengaluru%20"));
  assert(result.success);
  assert.deepEqual(result.data, { q: "Bengaluru", sort: "name_asc", page: 1, pageSize: 12 });
});

for (const query of ["page=0", "page=-1", "page=1.5", "page=1e2", "page=10001", "pageSize=51", "pageSize=", "minFee=-1", "maxFee=2147483648", "minFee=100&maxFee=50", "minRating=5.1", "minRating=NaN", "ownership=private", "degreeLevel=unknown", "sort=name;DROP", "unknown=1", "page=1&page=2", "city=%20", `q=${"a".repeat(101)}`]) {
  test(`rejects ${query.slice(0, 60)}`, () => assert.equal(parseCollegeQuery(new URLSearchParams(query)).success, false));
}

test("accepts zero fees, fractional ratings and combined filters", () => {
  const result = parseCollegeQuery(new URLSearchParams("minFee=0&maxFee=100000&minRating=4.25&ownership=PUBLIC&degreeLevel=UNDERGRADUATE"));
  assert(result.success);
  assert.equal(result.data.minFee, 0);
  assert.equal(result.data.minRating, 4.25);
});
