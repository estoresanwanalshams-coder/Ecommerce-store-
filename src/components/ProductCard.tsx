"use client";

import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { getCategoryBySlug } from "@/lib/categories";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  const category = getCategoryBySlug(product.categorySlug);

  return (
    <article
      className="product-card group rounded-xl border border-zinc-200 bg-white"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link href={`/products/${product.slug}`} prefetch={false} className="block">
        <div
          className="product-image relative aspect-[4/3] overflow-hidden rounded-t-xl bg-zinc-100 bg-cover bg-center"
          style={{ backgroundImage: `url(${product.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        </div>
      </Link>
      <div className="p-3.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {category?.name}
        </p>
        <h3 className="mt-2 text-[0.95rem] font-bold text-zinc-950">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">
          {product.summary}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-base font-bold text-zinc-950">AED {product.price}</span>
          <div className="flex items-center gap-2">
            <AddToCartButton
              product={product}
              label="Add"
              className="animated-button rounded-md border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
            />
            <Link
              href={`/products/${product.slug}`}
              prefetch={false}
              className="animated-button rounded-md bg-zinc-950 px-3 py-2 text-sm font-bold text-white transition hover:bg-zinc-700"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
