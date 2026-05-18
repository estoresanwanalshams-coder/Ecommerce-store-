"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { HomeBannerCarousel } from "@/components/HomeBannerCarousel";
import { ProductCard } from "@/components/ProductCard";
import { categories, type Category } from "@/lib/categories";
import type { Product } from "@/lib/products";
import { fetchMergedCategories } from "@/lib/supabase-categories";
import { fetchSupabaseProducts } from "@/lib/supabase-products";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

function pickProducts(
  sourceProducts: Product[],
  selectedSlugs: string[],
) {
  if (selectedSlugs.length === 0 || sourceProducts.length === 0) {
    return sourceProducts.slice(0, 8);
  }

  const selectedProducts = selectedSlugs
    .map((slug) => sourceProducts.find((product) => product.slug === slug))
    .filter(Boolean) as Product[];

  return selectedProducts.length > 0
    ? selectedProducts.slice(0, 8)
    : sourceProducts.slice(0, 8);
}

export function HomePageContent() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);
  const [categoryItems, setCategoryItems] = useState<Category[]>(categories);

  useEffect(() => {
    async function loadHomeData() {
      const [nextSettings, nextProducts, nextCategories] = await Promise.all([
        fetchSiteSettings().catch(() => defaultSiteSettings),
        fetchSupabaseProducts().catch(() => []),
        fetchMergedCategories().catch(() => categories),
      ]);

      setSettings(nextSettings);
      setSupabaseProducts(nextProducts);
      setCategoryItems(nextCategories);
    }

    const timer = window.setTimeout(loadHomeData, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const productSource = supabaseProducts;

  const newArrivals = useMemo(
    () => pickProducts(productSource, settings.newArrivalSlugs),
    [productSource, settings.newArrivalSlugs],
  );

  const bestSellers = useMemo(
    () => pickProducts(productSource, settings.bestSellerSlugs),
    [productSource, settings.bestSellerSlugs],
  );

  const featuredProducts = useMemo(
    () => pickProducts(productSource, settings.featuredSlugs),
    [productSource, settings.featuredSlugs],
  );

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
    <section className="mt-14">
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
