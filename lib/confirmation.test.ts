import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeConfirmationCode,
  normalizeStripeSessionId,
} from "./confirmation";

describe("success page query guards", () => {
  it("accepts a well-formed confirmation code", () => {
    assert.equal(normalizeConfirmationCode("stk-ab2cd3"), "STK-AB2CD3");
    assert.equal(normalizeConfirmationCode("STK-AB2CD3"), "STK-AB2CD3");
    assert.equal(normalizeConfirmationCode("STK-XXXXXX"), "STK-XXXXXX");
  });

  it("rejects missing or malformed codes", () => {
    assert.equal(normalizeConfirmationCode(undefined), null);
    assert.equal(normalizeConfirmationCode(""), null);
    assert.equal(normalizeConfirmationCode("BOOKED"), null);
    assert.equal(normalizeConfirmationCode("STK-123"), null);
    assert.equal(normalizeConfirmationCode("STK-IIIIII"), null); // I is excluded
  });

  it("accepts Stripe checkout session ids and rejects junk", () => {
    assert.equal(
      normalizeStripeSessionId("cs_test_a1b2c3"),
      "cs_test_a1b2c3",
    );
    assert.equal(normalizeStripeSessionId("cs_live_abc"), "cs_live_abc");
    assert.equal(normalizeStripeSessionId(undefined), null);
    assert.equal(normalizeStripeSessionId("not-a-session"), null);
    assert.equal(normalizeStripeSessionId("session_123"), null);
  });
});
