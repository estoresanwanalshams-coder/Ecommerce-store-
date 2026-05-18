"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";

type ProductGridProps = {
  categorySlug?: CategorySlug;
  limit?: number;
};

export function ProductGrid({ categorySlug, limit }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await fetchSupabaseProducts());
      } catch {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = window.setTimeout(loadProducts, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const visibleProducts = useMemo(() => {
    const filteredProducts = categorySlug
      ? products.filter((product) => product.categorySlug === categorySlug)
      : products;

    return typeof limit === "number"
      ? filteredProducts.slice(0, limit)
      : filteredProducts;
  }, [products, categorySlug, limit]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        Loading products...
      </div>
    );
  }

  if (visibleProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        No products available yet. Add products from the admin panel.
      </div>
    );
  }

  return (
    <div className="product-grid">
      {visibleProducts.map((product, index) => (
        <ProductCard key={product.slug} product={product} index={index + 1} />
      ))}
    </div>
  );
}
