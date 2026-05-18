"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";

type SearchResultsProps = {
  query: string;
};

export function SearchResults({ query }: SearchResultsProps) {
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      setSupabaseProducts(await fetchSupabaseProducts().catch(() => []));
    }

    const timer = window.setTimeout(loadProducts, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const productSource = supabaseProducts;
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!normalizedQuery) {
      return productSource;
    }

    return productSource.filter((product) =>
      [product.name, product.summary, product.details, product.categorySlug]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [normalizedQuery, productSource]);

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {results.map((product, index) => (
        <ProductCard key={product.slug} product={product} index={index + 1} />
      ))}
      {results.length === 0 ? (
        <div className="col-span-2 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-zinc-600 lg:col-span-4">
          No products found. Try another search term.
        </div>
      ) : null}
    </div>
  );
}
