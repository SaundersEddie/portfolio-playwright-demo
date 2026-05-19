import type { Product } from "../data/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = CartItem[];

export function addToCart(cart: Cart, product: Product): Cart {
  if (product.stock <= 0) {
    throw new Error(`${product.name} is out of stock.`);
  }

  const existingItem = cart.find((item) => item.product.id === product.id);

  if (!existingItem) {
    return [...cart, { product, quantity: 1 }];
  }

  if (existingItem.quantity >= product.stock) {
    throw new Error(`Only ${product.stock} ${product.name} available.`);
  }

  return cart.map((item) =>
    item.product.id === product.id
      ? { ...item, quantity: item.quantity + 1 }
      : item,
  );
}

export function removeFromCart(cart: Cart, productId: string): Cart {
  return cart.filter((item) => item.product.id !== productId);
}

export function updateQuantity(cart: Cart, productId: string, quantity: number): Cart {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Quantity must be at least 1.");
  }

  return cart.map((item) => {
    if (item.product.id !== productId) {
      return item;
    }

    if (quantity > item.product.stock) {
      throw new Error(`Only ${item.product.stock} ${item.product.name} available.`);
    }

    return { ...item, quantity };
  });
}

export function getCartSubtotal(cart: Cart): number {
  return cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );
}

export function getCartItemCount(cart: Cart): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
