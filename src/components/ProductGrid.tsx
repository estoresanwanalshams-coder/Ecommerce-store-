"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";

type ProductGridProps = {
  baseProducts: Product[];
  categorySlug?: CategorySlug;
  limit?: number;
};

export function ProductGrid({
  baseProducts,
  categorySlug,
  limit,
}: ProductGridProps) {
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setSupabaseProducts(await fetchSupabaseProducts());
      } catch {
        setSupabaseProducts([]);
      }
    }

    const timer = window.setTimeout(loadProducts, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const mergedProducts =
      supabaseProducts.length > 0 ? supabaseProducts : baseProducts;
    const filteredProducts = categorySlug
      ? mergedProducts.filter((product) => product.categorySlug === categorySlug)
      : mergedProducts;

    return typeof limit === "number"
      ? filteredProducts.slice(0, limit)
      : filteredProducts;
  }, [supabaseProducts, baseProducts, categorySlug, limit]);

  if (visibleProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600">
        No products found in this section.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {visibleProducts.map((product, index) => (
        <ProductCard key={product.slug} product={product} index={index + 1} />
      ))}
    </div>
  );
}
