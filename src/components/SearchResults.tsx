import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { fetchSupabaseSearchProducts } from "@/lib/supabase-products";

type SearchResultsProps = {
  query: string;
  page?: number;
};

function createSearchPageHref(query: string, page: number) {
  const queryParam = `q=${encodeURIComponent(query)}`;
  return page <= 1 ? `/search?${queryParam}` : `/search?${queryParam}&page=${page}`;
};

export async function SearchResults({ query, page = 1 }: SearchResultsProps) {
  const currentPage = Math.max(1, page);
  const normalizedQuery = query.trim();
  const { products: results, hasNextPage } = await fetchSupabaseSearchProducts(
    normalizedQuery,
    {
      page: currentPage,
      pageSize: 12,
    },
  ).catch(() => ({ products: [], hasNextPage: false }));

  return (
    <>
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
      {results.length > 0 ? (
        <nav
          className="mt-8 flex items-center justify-center gap-3"
          aria-label="Search pagination"
        >
          {currentPage > 1 ? (
            <Link
              href={createSearchPageHref(normalizedQuery, currentPage - 1)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
            >
              Previous
            </Link>
          ) : null}
          <span className="text-sm font-semibold text-zinc-600">
            Page {currentPage}
          </span>
          {hasNextPage ? (
            <Link
              href={createSearchPageHref(normalizedQuery, currentPage + 1)}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:border-zinc-900"
            >
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </>
  );
}
