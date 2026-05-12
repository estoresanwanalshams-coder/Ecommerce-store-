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
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-5">
      <p className="text-sm font-bold text-white">Selected products</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.product.slug}
            className="grid grid-cols-[56px_1fr_auto] items-center gap-3"
          >
            <div
              className="h-14 w-14 rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${item.product.imageUrl})` }}
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {item.product.name}
              </p>
              <p className="text-xs text-zinc-300">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold text-white">
              AED {item.product.price * item.quantity}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
        <span>Total</span>
        <span>AED {subtotal}</span>
      </div>
    </div>
  );
}
