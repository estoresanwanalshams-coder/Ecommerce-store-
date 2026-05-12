"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";
import { products } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

function pickProducts(
  sourceProducts: Product[],
  selectedSlugs: string[],
  fallbackProducts: Product[],
) {
  if (selectedSlugs.length === 0) {
    return fallbackProducts;
  }

  const selectedProducts = selectedSlugs
    .map((slug) => sourceProducts.find((product) => product.slug === slug))
    .filter(Boolean) as Product[];

  return selectedProducts.length > 0 ? selectedProducts : fallbackProducts;
}

export function HomePageContent() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [supabaseProducts, setSupabaseProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadHomeData() {
      const [nextSettings, nextProducts] = await Promise.all([
        fetchSiteSettings().catch(() => defaultSiteSettings),
        fetchSupabaseProducts().catch(() => []),
      ]);

      setSettings(nextSettings);
      setSupabaseProducts(nextProducts);
    }

    const timer = window.setTimeout(loadHomeData, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const productSource = supabaseProducts.length > 0 ? supabaseProducts : products;

  const newArrivals = useMemo(
    () =>
      pickProducts(
        productSource,
        settings.newArrivalSlugs,
        productSource.slice(0, 4),
      ).slice(0, 4),
    [productSource, settings.newArrivalSlugs],
  );

  const bestSellers = useMemo(
    () =>
      pickProducts(
        productSource,
        settings.bestSellerSlugs,
        [productSource[3], productSource[6], productSource[10], productSource[12]]
          .filter(Boolean) as Product[],
      ).slice(0, 4),
    [productSource, settings.bestSellerSlugs],
  );

  const featuredProducts = useMemo(
    () =>
      pickProducts(
        productSource,
        settings.featuredSlugs,
        productSource.slice(4, 8),
      ).slice(0, 4),
    [productSource, settings.featuredSlugs],
  );

  return (
    <section className="page-shell">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="home-hero content-reveal overflow-hidden rounded-3xl bg-zinc-950 text-white shadow-2xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:p-10">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                General products store
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
                Everyday essentials with a premium shopping experience.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
                Browse curated home, electronic, baby, automotive, health, and
                beauty essentials for UAE, Saudi Arabia, Qatar, Oman, and the
                wider GCC. Add items to cart, review quantities, and send
                checkout inquiries quickly from any mobile device.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/categories"
                  className="animated-button rounded-md bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 transition hover:bg-zinc-200"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/contact"
                  className="rounded-md border border-white/20 px-6 py-3 text-center text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div
              className="min-h-[320px] rounded-2xl bg-cover bg-center shadow-xl lg:min-h-[430px]"
              style={{ backgroundImage: `url(${settings.bannerImageUrl})` }}
            />
          </div>
        </div>

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
      </div>
    </section>
  );
}

type HomeProductSectionProps = {
  eyebrow: string;
  title: string;
  linkLabel: string;
  products: Product[];
};

function HomeProductSection({
  eyebrow,
  title,
  linkLabel,
  products: sectionProducts,
}: HomeProductSectionProps) {
  return (
    <section className="mt-14">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-zinc-950">{title}</h2>
        </div>
        <Link href="/categories" className="text-sm font-bold text-zinc-950">
          {linkLabel}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {sectionProducts.map((product, index) => (
          <ProductCard key={product.slug} product={product} index={index + 1} />
        ))}
      </div>
    </section>
  );
}
