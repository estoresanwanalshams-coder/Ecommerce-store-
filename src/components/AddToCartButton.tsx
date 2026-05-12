"use client";

import { useState } from "react";
import { addProductToCart } from "@/lib/cart";
import type { Product } from "@/lib/products";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  label?: string;
};

export function AddToCartButton({
  product,
  className,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addProductToCart(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={className}
      aria-live="polite"
    >
      {added ? "Added" : label}
    </button>
  );
}
