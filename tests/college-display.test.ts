import assert from "node:assert/strict";
import test from "node:test";
import { discoveryReturn, formatInr, placementRate, safeWebsite } from "../src/lib/college-display";
test("missing and zero amounts stay distinct", () => { assert.equal(formatInr(null), "Unavailable"); assert.equal(formatInr(0), "₹0"); });
test("placement rate requires a known positive denominator", () => { assert.equal(placementRate(0, 10), "0.0%"); assert.equal(placementRate(5, 10), "50.0%"); assert.equal(placementRate(null, 10), "Unavailable"); assert.equal(placementRate(0, 0), "Unavailable"); });
test("only http website links are allowed", () => { assert.equal(safeWebsite("javascript:alert(1)"), null); assert.equal(safeWebsite("https://example.com"), "https://example.com/"); });
test("return links stay on discovery", () => { assert.equal(discoveryReturn("/discover?q=Pune"), "/discover?q=Pune"); for (const value of ["https://example.com", "//example.com", "/discover/../other", ["/discover"]]) assert.equal(discoveryReturn(value), "/discover"); });
