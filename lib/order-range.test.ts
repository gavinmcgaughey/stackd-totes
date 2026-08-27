import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { addCalendarDays, fromISODate, toISODate } from "./dates";
import { rangeAfterDayClick } from "./order-range";

function d(iso: string): Date {
  return fromISODate(iso);
}

describe("rangeAfterDayClick", () => {
  it("sets delivery on first click and defaults pickup to 14 days later", () => {
    const next = rangeAfterDayClick(undefined, d("2026-09-10"), 14);
    assert.equal(toISODate(next.from), "2026-09-10");
    assert.equal(toISODate(next.to), "2026-09-24");
  });

  it("does not set pickup to the same day as delivery", () => {
    const next = rangeAfterDayClick(undefined, d("2026-09-10"));
    assert.notEqual(toISODate(next.from), toISODate(next.to));
  });

  it("updates pickup when clicking a later date", () => {
    const afterFirst = rangeAfterDayClick(undefined, d("2026-09-10"), 14);
    const next = rangeAfterDayClick(afterFirst, d("2026-10-08"), 14);
    assert.equal(toISODate(next.from), "2026-09-10");
    assert.equal(toISODate(next.to), "2026-10-08");
  });

  it("keeps pickup on or after delivery", () => {
    const afterFirst = rangeAfterDayClick(undefined, d("2026-09-10"), 14);
    const next = rangeAfterDayClick(afterFirst, d("2026-09-12"), 14);
    assert.ok(next.to.getTime() >= next.from.getTime());
    assert.equal(toISODate(next.from), "2026-09-10");
    assert.equal(toISODate(next.to), "2026-09-12");
  });

  it("starts a new delivery when clicking a date before the current one", () => {
    const afterFirst = rangeAfterDayClick(undefined, d("2026-09-20"), 14);
    const next = rangeAfterDayClick(afterFirst, d("2026-09-12"), 14);
    assert.equal(toISODate(next.from), "2026-09-12");
    assert.equal(toISODate(next.to), "2026-09-26");
  });

  it("re-applies the default pickup when delivery is clicked again", () => {
    const afterFirst = rangeAfterDayClick(undefined, d("2026-09-10"), 14);
    const shortened = rangeAfterDayClick(afterFirst, d("2026-09-12"), 14);
    const next = rangeAfterDayClick(shortened, d("2026-09-10"), 14);
    assert.equal(toISODate(next.from), "2026-09-10");
    assert.equal(toISODate(next.to), "2026-09-24");
  });

  it("uses addCalendarDays for a 14-day default", () => {
    const delivery = d("2026-01-31");
    assert.equal(toISODate(addCalendarDays(delivery, 14)), "2026-02-14");
  });
});
