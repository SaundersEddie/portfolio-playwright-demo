import { describe, expect, it } from "vitest";

import {
  applyDiscountCode,
  calculateDiscountAmount,
  getDiscountCode,
  normalizeDiscountCode,
} from "../../src/logic/discounts";

describe("discount logic", () => {
  it("normalizes discount codes", () => {
    expect(normalizeDiscountCode(" save10 ")).toBe("SAVE10");
  });

  it("finds a valid discount code", () => {
    const discount = getDiscountCode("SAVE10");

    expect(discount).toEqual({
      code: "SAVE10",
      label: "10% off",
      type: "percentage",
      value: 10,
    });
  });

  it("matches discount codes case-insensitively", () => {
    const discount = getDiscountCode("fiver");

    expect(discount?.code).toBe("FIVER");
  });

  it("returns undefined for an invalid discount code", () => {
    expect(getDiscountCode("NOPE")).toBeUndefined();
  });

  it("calculates percentage discount amount", () => {
    const discount = getDiscountCode("SAVE10");

    if (!discount) {
      throw new Error("Expected SAVE10 discount to exist.");
    }

    expect(calculateDiscountAmount(42.5, discount)).toBe(4.25);
  });

  it("calculates fixed discount amount", () => {
    const discount = getDiscountCode("FIVER");

    if (!discount) {
      throw new Error("Expected FIVER discount to exist.");
    }

    expect(calculateDiscountAmount(42.5, discount)).toBe(5);
  });

  it("does not allow fixed discount to reduce subtotal below zero", () => {
    const discount = getDiscountCode("FIVER");

    if (!discount) {
      throw new Error("Expected FIVER discount to exist.");
    }

    expect(calculateDiscountAmount(3, discount)).toBe(3);
  });

  it("returns zero discount for zero subtotal", () => {
    const discount = getDiscountCode("SAVE10");

    if (!discount) {
      throw new Error("Expected SAVE10 discount to exist.");
    }

    expect(calculateDiscountAmount(0, discount)).toBe(0);
  });

  it("applies a valid discount code", () => {
    expect(applyDiscountCode(50, "SAVE10")).toEqual({
      code: "SAVE10",
      label: "10% off",
      amount: 5,
    });
  });

  it("rejects a blank discount code", () => {
    expect(() => applyDiscountCode(50, "   ")).toThrow(
      "Enter a discount code.",
    );
  });

  it("rejects an invalid discount code", () => {
    expect(() => applyDiscountCode(50, "CHAOS")).toThrow(
      "Invalid discount code.",
    );
  });
});
