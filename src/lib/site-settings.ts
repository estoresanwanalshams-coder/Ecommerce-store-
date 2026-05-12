import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  offerText: string;
  bannerImageUrl: string;
  newArrivalSlugs: string[];
  bestSellerSlugs: string[];
  featuredSlugs: string[];
};

type SiteSettingsRow = {
  id: string;
  offer_text: string | null;
  banner_image_url: string | null;
  new_arrival_slugs: string[] | null;
  best_seller_slugs: string[] | null;
  featured_slugs: string[] | null;
};

export const defaultSiteSettings: SiteSettings = {
  offerText: "Free shipping on orders over Rs. 999 | New season offers are live",
  bannerImageUrl:
    "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  newArrivalSlugs: [],
  bestSellerSlugs: [],
  featuredSlugs: [],
};

function mapSettingsRow(row: SiteSettingsRow): SiteSettings {
  return {
    offerText: row.offer_text ?? defaultSiteSettings.offerText,
    bannerImageUrl: row.banner_image_url ?? defaultSiteSettings.bannerImageUrl,
    newArrivalSlugs: row.new_arrival_slugs ?? [],
    bestSellerSlugs: row.best_seller_slugs ?? [],
    featuredSlugs: row.featured_slugs ?? [],
  };
}

function mapSettingsToRow(settings: SiteSettings) {
  return {
    id: "main",
    offer_text: settings.offerText,
    banner_image_url: settings.bannerImageUrl,
    new_arrival_slugs: settings.newArrivalSlugs,
    best_seller_slugs: settings.bestSellerSlugs,
    featured_slugs: settings.featuredSlugs,
  };
}

export async function fetchSiteSettings() {
  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "id, offer_text, banner_image_url, new_arrival_slugs, best_seller_slugs, featured_slugs",
    )
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapSettingsRow(data as SiteSettingsRow) : defaultSiteSettings;
}

export async function updateSiteSettings(settings: SiteSettings) {
  const { error } = await supabase
    .from("site_settings")
    .upsert(mapSettingsToRow(settings), { onConflict: "id" });

  if (error) {
    throw error;
  }
}
