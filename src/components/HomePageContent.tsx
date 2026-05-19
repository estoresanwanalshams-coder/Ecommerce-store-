import Link from "next/link";
import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/lib/categories";
import type { Product } from "@/lib/products";
import { fetchMergedCategories } from "@/lib/supabase-categories";
import { fetchSupabaseProductsPage } from "@/lib/supabase-products";
import { defaultSiteSettings, fetchSiteSettings } from "@/lib/site-settings";

function pickProducts(
  sourceProducts: Product[],
  selectedSlugs: string[],
) {
  if (selectedSlugs.length === 0 || sourceProducts.length === 0) {
    return [];
  }

  const selectedProducts = selectedSlugs
    .map((slug) => sourceProducts.find((product) => product.slug === slug))
    .filter(Boolean) as Product[];

  return selectedProducts.length > 0
    ? selectedProducts.slice(0, 8)
    : sourceProducts.slice(0, 8);
}

function getAutoNewArrivalSlugs(sourceProducts: Product[], selectedSlugs: string[]) {
  const latestSlugs = sourceProducts.slice(0, 4).map((product) => product.slug);
  return Array.from(new Set([...latestSlugs, ...selectedSlugs])).slice(0, 8);
}

export async function HomePageContent() {
  const [settings, productsPage, categoryItems] = await Promise.all([
    fetchSiteSettings().catch(() => defaultSiteSettings),
    fetchSupabaseProductsPage({ page: 1, pageSize: 60 }).catch(() => ({
      products: [],
      hasNextPage: false,
    })),
    fetchMergedCategories().catch(() => categories),
  ]);
  const productSource = productsPage.products;

  const newArrivals = pickProducts(
    productSource,
    getAutoNewArrivalSlugs(productSource, settings.newArrivalSlugs),
  );
  const bestSellers = pickProducts(productSource, settings.bestSellerSlugs);
  const featuredProducts = pickProducts(productSource, settings.featuredSlugs);

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <HomeBannerCarousel extraBannerUrl={settings.bannerImageUrl} />

        <HomeProductSection
          eyebrow="Just added"
          title="New arrivals"
          linkLabel="View all products"
          products={newArrivals}
        />

        <HomeProductSection
          eyebrow="Customer favorites"
          title="Best sellers"
          linkLabel="Browse categories"
          products={bestSellers}
        />

        <HomeProductSection
          eyebrow="Featured picks"
          title="Featured products"
          linkLabel="Shop featured"
          products={featuredProducts}
        />

        {categoryItems.map((category) => {
          const categoryProducts = productSource
            .filter((product) => product.categorySlug === category.slug)
            .slice(0, 8);

          if (categoryProducts.length === 0) {
            return null;
          }

          return (
            <HomeProductSection
              key={category.slug}
              eyebrow="Shop by category"
              title={category.name}
              linkLabel="View category"
              href={`/categories/${category.slug}`}
              products={categoryProducts}
            />
          );
        })}
      </div>
    </section>
  );
}

type HomeProductSectionProps = {
  eyebrow: string;
  title: string;
  linkLabel: string;
  href?: string;
  products: Product[];
};

function HomeProductSection({
  eyebrow,
  title,
  linkLabel,
  href = "/categories",
  products: sectionProducts,
}: HomeProductSectionProps) {
  if (sectionProducts.length === 0) {
    return null;
  }

  const marqueeProducts = [...sectionProducts, ...sectionProducts];

  return (
    <section className="home-product-section mt-14">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950">{title}</h2>
        </div>
        <Link href={href} className="text-sm font-bold text-zinc-950">
          {linkLabel}
        </Link>
      </div>
      <div className="home-marquee" aria-label={`${title} products`}>
        <div className="home-marquee-track">
          {marqueeProducts.map((product, index) => (
            <div
              key={`${product.slug}-${index}`}
              className="home-marquee-item"
            >
              <ProductCard
                product={product}
                index={(index % sectionProducts.length) + 1}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
