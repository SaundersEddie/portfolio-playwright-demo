import { products } from "../data/products";
import type { Product } from "../data/products";

export function getProducts(): Product[] {
  return products;
}

export function getProductById(productId: string): Product | undefined {
  return products.find((product) => product.id === productId);
}
