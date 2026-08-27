import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { computePrice } from "./pricing";
import { getPackage } from "./packages";

const medium = getPackage("medium")!;

describe("computePrice extra weeks", () => {
  it("charges only the base price for a 14-day rental", () => {
    const b = computePrice(medium, "2026-09-10", "2026-09-24");
    assert.equal(b.days, 14);
    assert.equal(b.extraWeeks, 0);
    assert.equal(b.extra, 0);
    assert.equal(b.total, medium.price);
  });

  it("adds one extra week when pickup is more than 14 days after delivery", () => {
    const b = computePrice(medium, "2026-09-10", "2026-09-25");
    assert.equal(b.days, 15);
    assert.equal(b.extraWeeks, 1);
    assert.equal(b.extra, medium.extraWeekPrice);
    assert.equal(b.total, medium.price + medium.extraWeekPrice);
  });

  it("matches /pricing extra-week rates for each package", () => {
    assert.equal(getPackage("small")!.extraWeekPrice, 25);
    assert.equal(getPackage("medium")!.extraWeekPrice, 35);
    assert.equal(getPackage("large")!.extraWeekPrice, 45);
  });

  it("bills two extra weeks for a 28-day span", () => {
    const b = computePrice(medium, "2026-09-10", "2026-10-08");
    assert.equal(b.days, 28);
    assert.equal(b.extraWeeks, 2);
    assert.equal(b.extra, 70);
    assert.equal(b.total, 185 + 70);
  });
});
