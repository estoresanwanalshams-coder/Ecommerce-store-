"use client";

import { useEffect, useState } from "react";
import {
  fetchSupabaseOrders,
  type OrderRecord,
  type OrderStatus,
  updateSupabaseOrderStatus,
} from "@/lib/supabase-orders";

const statuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function AdminOrdersPanel() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    setOrders(await fetchSupabaseOrders().catch(() => []));
  }

  useEffect(() => {
    const timer = window.setTimeout(loadOrders, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    try {
      await updateSupabaseOrderStatus(id, status);
      await loadOrders();
      setMessage("Order status updated.");
    } catch {
      setMessage("Unable to update order status.");
    }
  }

  return (
    <section className="page-shell border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Orders
        </p>
        <h2 className="mt-3 text-3xl font-bold text-zinc-950">
          Customer orders
        </h2>
        {message ? (
          <p className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-700">
            {message}
          </p>
        ) : null}
        <div className="mt-7 space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600">
              No orders found yet.
            </div>
          ) : null}
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                    {order.orderNumber}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-zinc-950">
                    {order.fullName}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-600">
                    {order.phone} | {order.email}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    {order.addressLine1} {order.addressLine2} {order.city}
                  </p>
                </div>
                <label className="light-form-field min-w-52">
                  Status
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateStatus(order.id, event.target.value as OrderStatus)
                    }
                    className="rounded-xl border border-zinc-300 p-3"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {order.items.map((item) => (
                  <div
                    key={item.product.slug}
                    className="rounded-xl border border-zinc-200 p-3 text-sm"
                  >
                    <p className="font-bold text-zinc-950">{item.product.name}</p>
                    <p className="text-zinc-600">Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-lg font-bold text-zinc-950">
                Total: AED {order.total}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
