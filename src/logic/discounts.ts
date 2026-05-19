export type DiscountCode = {
  code: string;
  label: string;
  type: "percentage" | "fixed";
  value: number;
};

export type AppliedDiscount = {
  code: string;
  label: string;
  amount: number;
};

const discountCodes: DiscountCode[] = [
  {
    code: "SAVE10",
    label: "10% off",
    type: "percentage",
    value: 10,
  },
  {
    code: "FIVER",
    label: "$5 off",
    type: "fixed",
    value: 5,
  },
];

export function normalizeDiscountCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getDiscountCode(code: string): DiscountCode | undefined {
  const normalizedCode = normalizeDiscountCode(code);

  return discountCodes.find((discount) => discount.code === normalizedCode);
}

export function calculateDiscountAmount(
  subtotal: number,
  discount: DiscountCode,
): number {
  if (subtotal <= 0) {
    return 0;
  }

  if (discount.type === "percentage") {
    return roundMoney(subtotal * (discount.value / 100));
  }

  return Math.min(subtotal, discount.value);
}

export function applyDiscountCode(
  subtotal: number,
  code: string,
): AppliedDiscount {
  const normalizedCode = normalizeDiscountCode(code);

  if (!normalizedCode) {
    throw new Error("Enter a discount code.");
  }

  const discount = getDiscountCode(normalizedCode);

  if (!discount) {
    throw new Error("Invalid discount code.");
  }

  return {
    code: discount.code,
    label: discount.label,
    amount: calculateDiscountAmount(subtotal, discount),
  };
}

function roundMoney(amount: number): number {
  return Math.round(amount * 100) / 100;
}
