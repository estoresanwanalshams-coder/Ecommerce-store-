import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/ProductCard";
import { getCategoryBySlug } from "@/lib/categories";
import { getProductBySlug, getProductsByCategory, products } from "@/lib/products";
import { fetchSupabaseProductBySlug, fetchSupabaseProducts } from "@/lib/supabase-products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabaseProducts = await fetchSupabaseProducts().catch(() => []);
  const product =
    (await fetchSupabaseProductBySlug(slug).catch(() => null)) ??
    getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = getCategoryBySlug(product.categorySlug);
  const relatedSource =
    supabaseProducts.length > 0
      ? supabaseProducts
      : getProductsByCategory(product.categorySlug);
  const relatedProducts = relatedSource
    .filter((relatedProduct) => relatedProduct.categorySlug === product.categorySlug)
    .filter((relatedProduct) => relatedProduct.slug !== product.slug)
    .slice(0, 4);

  return (
    <section className="page-shell bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="content-reveal grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="product-card rounded-2xl border border-zinc-200 bg-white p-5">
            <div
              className="product-image relative aspect-square overflow-hidden rounded-xl bg-zinc-100 bg-cover bg-center"
              style={{ backgroundImage: `url(${product.imageUrl})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
              {category?.name}
            </p>
            <h1 className="mt-3 text-4xl font-bold text-zinc-950 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">{product.details}</p>
            <p className="mt-6 text-3xl font-bold text-zinc-950">AED {product.price}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton
                product={product}
                className="animated-button rounded-md bg-zinc-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-700"
              />
              <Link
                href={`/inquiry/${product.slug}`}
                className="animated-button rounded-md border border-zinc-950 px-6 py-3 text-center text-sm font-bold text-zinc-950 transition hover:bg-zinc-950 hover:text-white"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-3xl font-bold text-zinc-950">Related products</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard
                key={relatedProduct.slug}
                product={relatedProduct}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
