"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { fetchSupabaseProducts } from "@/lib/supabase-products";
import {
  defaultSiteSettings,
  fetchSiteSettings,
  updateSiteSettings,
  type SiteSettings,
} from "@/lib/site-settings";

type ProductSelectionFieldProps = {
  label: string;
  selectedSlugs: string[];
  products: Product[];
  onChange: (slugs: string[]) => void;
};

export function AdminSiteSettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const [nextSettings, nextProducts] = await Promise.all([
        fetchSiteSettings().catch(() => defaultSiteSettings),
        fetchSupabaseProducts().catch(() => []),
      ]);

      setSettings(nextSettings);
      setProducts(nextProducts);
    }

    const timer = window.setTimeout(loadSettings, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function updateField<K extends keyof SiteSettings>(
    field: K,
    value: SiteSettings[K],
  ) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateSiteSettings(settings);
      setMessage("Homepage settings updated.");
    } catch {
      setMessage("Unable to save settings. Check Supabase site_settings table and policies.");
    }
  }

  return (
    <section className="page-shell border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="content-reveal rounded-2xl bg-zinc-950 p-6 text-white shadow-xl sm:p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Website controls
          </p>
          <h2 className="mt-3 text-3xl font-bold">Homepage settings</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
            Change the top offer text, homepage banner image, and product
            sections from here. These values are saved permanently in Supabase.
          </p>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <label className="form-field">
              Top offer navbar text
              <input
                value={settings.offerText}
                onChange={(event) => updateField("offerText", event.target.value)}
                placeholder="Enter offer text"
                required
              />
            </label>

            <label className="form-field">
              Banner image URL
              <input
                value={settings.bannerImageUrl}
                onChange={(event) =>
                  updateField("bannerImageUrl", event.target.value)
                }
                placeholder="https://image-url.com/banner.jpg"
                required
              />
            </label>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            <ProductSelectionField
              label="New arrivals"
              products={products}
              selectedSlugs={settings.newArrivalSlugs}
              onChange={(slugs) => updateField("newArrivalSlugs", slugs)}
            />
            <ProductSelectionField
              label="Best sellers"
              products={products}
              selectedSlugs={settings.bestSellerSlugs}
              onChange={(slugs) => updateField("bestSellerSlugs", slugs)}
            />
            <ProductSelectionField
              label="Featured products"
              products={products}
              selectedSlugs={settings.featuredSlugs}
              onChange={(slugs) => updateField("featuredSlugs", slugs)}
            />
          </div>

          {message ? (
            <p className="mt-5 rounded-xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-white">
              {message}
            </p>
          ) : null}

          <button className="animated-button inquiry-submit mt-7">
            Save Homepage Settings
          </button>
        </form>
      </div>
    </section>
  );
}

function ProductSelectionField({
  label,
  selectedSlugs,
  products,
  onChange,
}: ProductSelectionFieldProps) {
  function toggleSlug(slug: string) {
    if (selectedSlugs.includes(slug)) {
      onChange(selectedSlugs.filter((selectedSlug) => selectedSlug !== slug));
      return;
    }

    onChange([...selectedSlugs, slug].slice(0, 4));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="mt-1 text-xs text-zinc-300">Select up to 4 products.</p>
      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {products.length === 0 ? (
          <p className="text-sm text-zinc-300">
            Add products in Supabase first, then select them here.
          </p>
        ) : null}
        {products.map((product) => (
          <label
            key={product.slug}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <input
              type="checkbox"
              checked={selectedSlugs.includes(product.slug)}
              onChange={() => toggleSlug(product.slug)}
              className="h-4 w-4 accent-white"
            />
            <span className="line-clamp-1">{product.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
