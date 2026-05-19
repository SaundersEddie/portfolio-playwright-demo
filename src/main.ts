import "./styles/global.css";

import { getProducts } from "./services/productService";
import {
  addToCart,
  getCartItemCount,
  getCartSubtotal,
  removeFromCart,
  updateQuantity,
  type Cart,
} from "./logic/cart";

const products = getProducts();
let cart: Cart = [];
let statusMessage = "";

const appRoot = document.querySelector<HTMLDivElement>("#app")!;

if (!appRoot) {
  throw new Error("App root not found.");
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function setStatus(message: string): void {
  statusMessage = message;
  render();
}

function handleAddToCart(productId: string): void {
  const product = products.find((item) => item.id === productId);

  if (!product) {
    setStatus("Product not found.");
    return;
  }

  try {
    cart = addToCart(cart, product);
    setStatus(`${product.name} added to cart.`);
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unable to add item.");
  }
}

function handleRemoveFromCart(productId: string): void {
  cart = removeFromCart(cart, productId);
  setStatus("Item removed from cart.");
}

function handleQuantityChange(productId: string, quantityValue: string): void {
  const quantity = Number(quantityValue);

  try {
    cart = updateQuantity(cart, productId, quantity);
    setStatus("Cart quantity updated.");
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Unable to update quantity.");
  }
}

function renderProductCards(): string {
  return products
    .map((product) => {
      const isOutOfStock = product.stock <= 0;

      return `
        <article class="product-card" data-testid="product-card">
          <div class="product-card__badge" aria-hidden="true">${product.imageLabel}</div>
          <div class="product-card__body">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="product-card__price">${formatCurrency(product.price)}</p>
            <p class="${isOutOfStock ? "stock stock--empty" : "stock"}">
              ${isOutOfStock ? "Out of stock" : `${product.stock} in stock`}
            </p>
          </div>
          <button
            class="button"
            data-action="add-to-cart"
            data-product-id="${product.id}"
            ${isOutOfStock ? "disabled" : ""}
          >
            ${isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </article>
      `;
    })
    .join("");
}

function renderCart(): string {
  if (cart.length === 0) {
    return `
      <div class="cart-empty" data-testid="cart-empty">
        Your cart is empty. Tragic, but fixable.
      </div>
    `;
  }

  const cartItems = cart
    .map(
      (item) => `
        <li class="cart-item" data-testid="cart-item">
          <div>
            <strong>${item.product.name}</strong>
            <span>${formatCurrency(item.product.price)} each</span>
          </div>

          <label>
            Qty
            <input
              data-action="update-quantity"
              data-product-id="${item.product.id}"
              type="number"
              min="1"
              max="${item.product.stock}"
              value="${item.quantity}"
              aria-label="Quantity for ${item.product.name}"
            />
          </label>

          <button
            class="button button--secondary"
            data-action="remove-from-cart"
            data-product-id="${item.product.id}"
          >
            Remove
          </button>
        </li>
      `,
    )
    .join("");

  return `
    <ul class="cart-list">
      ${cartItems}
    </ul>

    <div class="cart-summary">
      <p>
        <span>Items</span>
        <strong data-testid="cart-count">${getCartItemCount(cart)}</strong>
      </p>
      <p>
        <span>Subtotal</span>
        <strong data-testid="cart-subtotal">${formatCurrency(getCartSubtotal(cart))}</strong>
      </p>
    </div>
  `;
}

function render(): void {
  appRoot.innerHTML = `
    <header class="site-header">
      <div>
        <p class="eyebrow">Playwright Portfolio Demo</p>
        <h1>Testable Trinkets</h1>
        <p class="intro">
          A tiny storefront built to demonstrate clean app logic, useful edge cases,
          and end-to-end testing in both TypeScript and Python.
        </p>
      </div>
    </header>

    <main class="layout">
      <section class="products-section" aria-labelledby="products-heading">
        <div class="section-heading">
          <h2 id="products-heading">Products</h2>
          <p>Small nonsense. Serious test coverage.</p>
        </div>

        <div class="product-grid">
          ${renderProductCards()}
        </div>
      </section>

      <aside class="cart-panel" aria-labelledby="cart-heading">
        <div class="section-heading">
          <h2 id="cart-heading">Cart</h2>
          <p data-testid="status-message" role="status">${statusMessage}</p>
        </div>

        ${renderCart()}
      </aside>
    </main>
  `;

  attachEventHandlers();
}

function attachEventHandlers(): void {
  document.querySelectorAll<HTMLButtonElement>("[data-action='add-to-cart']").forEach((button) => {
    button.addEventListener("click", () => {
      handleAddToCart(button.dataset.productId ?? "");
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-action='remove-from-cart']").forEach((button) => {
    button.addEventListener("click", () => {
      handleRemoveFromCart(button.dataset.productId ?? "");
    });
  });

  document.querySelectorAll<HTMLInputElement>("[data-action='update-quantity']").forEach((input) => {
    input.addEventListener("change", () => {
      handleQuantityChange(input.dataset.productId ?? "", input.value);
    });
  });
}

render();
