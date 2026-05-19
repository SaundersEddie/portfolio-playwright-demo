import { describe, expect, it } from "vitest";

import type { Product } from "../../src/data/products";
import {
  addToCart,
  getCartItemCount,
  getCartSubtotal,
  removeFromCart,
  updateQuantity,
  type Cart,
} from "../../src/logic/cart";

const testProduct: Product = {
  id: "test-product",
  name: "Test Product",
  description: "A product used for cart tests.",
  price: 10,
  stock: 5,
  imageLabel: "TP",
};

const secondProduct: Product = {
  id: "second-product",
  name: "Second Product",
  description: "Another product used for cart tests.",
  price: 4.5,
  stock: 3,
  imageLabel: "SP",
};

const outOfStockProduct: Product = {
  id: "out-of-stock-product",
  name: "Out of Stock Product",
  description: "A product that cannot be purchased.",
  price: 99,
  stock: 0,
  imageLabel: "OS",
};

describe("cart logic", () => {
  it("adds a product to an empty cart", () => {
    const cart = addToCart([], testProduct);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual({
      product: testProduct,
      quantity: 1,
    });
  });

  it("increments quantity when adding the same product again", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);
    cart = addToCart(cart, testProduct);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  it("adds multiple different products", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);
    cart = addToCart(cart, secondProduct);

    expect(cart).toHaveLength(2);
    expect(getCartItemCount(cart)).toBe(2);
  });

  it("removes a product from the cart", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);
    cart = addToCart(cart, secondProduct);

    const updatedCart = removeFromCart(cart, testProduct.id);

    expect(updatedCart).toHaveLength(1);
    expect(updatedCart[0].product.id).toBe(secondProduct.id);
  });

  it("updates product quantity", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);

    const updatedCart = updateQuantity(cart, testProduct.id, 4);

    expect(updatedCart[0].quantity).toBe(4);
  });

  it("calculates cart subtotal", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);
    cart = updateQuantity(cart, testProduct.id, 2);
    cart = addToCart(cart, secondProduct);

    expect(getCartSubtotal(cart)).toBe(24.5);
  });

  it("calculates total item count", () => {
    let cart: Cart = [];

    cart = addToCart(cart, testProduct);
    cart = updateQuantity(cart, testProduct.id, 3);
    cart = addToCart(cart, secondProduct);

    expect(getCartItemCount(cart)).toBe(4);
  });

  it("blocks adding an out-of-stock product", () => {
    expect(() => addToCart([], outOfStockProduct)).toThrow(
      "Out of Stock Product is out of stock.",
    );
  });

  it("blocks quantity below 1", () => {
    const cart = addToCart([], testProduct);

    expect(() => updateQuantity(cart, testProduct.id, 0)).toThrow(
      "Quantity must be at least 1.",
    );
  });

  it("blocks quantity above available stock", () => {
    const cart = addToCart([], testProduct);

    expect(() => updateQuantity(cart, testProduct.id, 6)).toThrow(
      "Only 5 Test Product available.",
    );
  });

  it("blocks adding more than available stock", () => {
    let cart: Cart = [];

    cart = updateQuantity(addToCart(cart, testProduct), testProduct.id, 5);

    expect(() => addToCart(cart, testProduct)).toThrow(
      "Only 5 Test Product available.",
    );
  });
});
