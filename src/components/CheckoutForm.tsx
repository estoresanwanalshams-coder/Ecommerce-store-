"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { getCartItems, saveCartItems, type CartItem } from "@/lib/cart";
import type { Product } from "@/lib/products";
import {
  createOrderNumber,
  createSupabaseOrder,
} from "@/lib/supabase-orders";

type CheckoutFormProps = {
  fallbackProduct: Product;
};

export function CheckoutForm({ fallbackProduct }: CheckoutFormProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [message, setMessage] = useState("");
  const [successOrderNumber, setSuccessOrderNumber] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const cartItems = getCartItems();
      setItems(
        cartItems.length > 0
          ? cartItems
          : [{ product: fallbackProduct, quantity: 1 }],
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fallbackProduct]);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [items],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const orderNumber = createOrderNumber();

    try {
      await createSupabaseOrder({
        orderNumber,
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        items,
        total,
      });
      await fetch("/api/orders/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          fullName,
          email,
          phone,
          addressLine1,
          addressLine2,
          city,
          items,
          total,
        }),
      }).catch(() => null);
      saveCartItems([]);
      setSuccessOrderNumber(orderNumber);
      setMessage("");
    } catch {
      setMessage("Unable to place order. Please check Supabase orders table.");
    }
  }

  return (
    <>
      {successOrderNumber ? (
        <OrderSuccessModal
          orderNumber={successOrderNumber}
          onClose={() => setSuccessOrderNumber("")}
        />
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="checkout-form checkout-form-panel grid gap-5 p-6 sm:p-8 lg:p-10 md:grid-cols-2"
      >
        <label className="form-field md:col-span-2">
          Full Name*
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            type="text"
            placeholder="Enter full name"
            required
          />
        </label>
        <label className="form-field">
          Email*
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter email address"
            required
          />
        </label>
        <label className="form-field">
          Phone number*
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            type="text"
            inputMode="tel"
            placeholder="Enter phone number"
            required
          />
        </label>
        <label className="form-field md:col-span-2">
          Address line 1*
          <input
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
            placeholder="Street, building, apartment"
            required
          />
        </label>
        <label className="form-field">
          Address line 2
          <input
            value={addressLine2}
            onChange={(event) => setAddressLine2(event.target.value)}
            placeholder="Area or landmark"
          />
        </label>
        <label className="form-field">
          City*
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city"
            required
          />
        </label>
        <button type="submit" className="animated-button checkout-submit md:col-span-2">
          Place Order
        </button>
        {message ? (
          <p className="md:col-span-2 text-sm font-bold text-red-600">{message}</p>
        ) : null}
      </form>
    </>
  );
}
