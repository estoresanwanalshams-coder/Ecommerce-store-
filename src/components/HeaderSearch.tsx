"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";

export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      setAvailableProducts(await fetchSupabaseProducts().catch(() => []));
    }

    const timer = window.setTimeout(loadProducts, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
    }

    return availableProducts
      .filter((product) => {
        const haystack = [
          product.name,
          product.summary,
          product.categorySlug,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [availableProducts, query]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      window.location.href = "/categories";
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(trimmedQuery)}`;
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="header-search" role="search">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search products"
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <svg
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
            />
          </svg>
        </button>
      </form>
      {suggestions.length > 0 ? (
        <div className="search-suggestions">
          {suggestions.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              prefetch={false}
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <span
                className="h-10 w-10 rounded-md bg-cover bg-center"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
              {product.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
