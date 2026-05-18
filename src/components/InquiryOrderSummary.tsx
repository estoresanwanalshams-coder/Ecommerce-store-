"use client";

import { useEffect, useMemo, useState } from "react";
import { type CartItem, getCartItems } from "@/lib/cart";
import type { Product } from "@/lib/products";

type InquiryOrderSummaryProps = {
  fallbackProduct: Product;
};

export function InquiryOrderSummary({ fallbackProduct }: InquiryOrderSummaryProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setCartItems(getCartItems()), 0);

    return () => window.clearTimeout(timer);
  }, []);

  const items = useMemo(
    () =>
      cartItems.length > 0
        ? cartItems
        : [
            {
              product: fallbackProduct,
              quantity: 1,
            },
          ],
    [cartItems, fallbackProduct],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      ),
    [items],
  );

  return (
    <div className="checkout-order-summary">
      <p className="text-sm font-bold text-zinc-900">Your items</p>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.product.slug}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2"
          >
            <span
              className="h-14 w-14 shrink-0 rounded-lg bg-cover bg-center"
              style={{ backgroundImage: `url(${item.product.imageUrl})` }}
            />
            <span className="min-w-0 flex-1 text-sm font-semibold text-zinc-900">
              {item.product.name}
              {item.quantity > 1 ? ` × ${item.quantity}` : ""}
            </span>
            <span className="text-sm font-bold text-zinc-700">
              AED {item.product.price * item.quantity}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex justify-between border-t border-zinc-200 pt-4 text-lg font-bold text-zinc-950">
        <span>Total</span>
        <span>AED {subtotal}</span>
      </div>
    </div>
  );
}
