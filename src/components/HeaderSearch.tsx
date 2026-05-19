"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SearchSuggestion = {
  slug: string;
  name: string;
  imageUrl: string;
};

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    const timer = window.setTimeout(async () => {
      const response = await fetch(
        `/api/products/suggest?q=${encodeURIComponent(normalizedQuery)}`,
      ).catch(() => null);

      if (!response?.ok) {
        setSuggestions([]);
        return;
      }

      const payload = (await response.json()) as { products?: SearchSuggestion[] };
      setSuggestions(payload.products ?? []);
    }, 200);

    return () => window.clearTimeout(timer);
  }, [query]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/categories");
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
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
              className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              <span className="relative h-10 w-10 overflow-hidden rounded-md bg-zinc-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="40px"
                  loading="lazy"
                  className="object-cover"
                />
              </span>
              {product.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
