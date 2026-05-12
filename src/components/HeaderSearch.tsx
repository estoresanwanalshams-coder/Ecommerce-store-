"use client";

import { useState } from "react";

export function HeaderSearch() {
  const [query, setQuery] = useState("");

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
  );
}
