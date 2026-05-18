import { supabase } from "@/lib/supabase";
import type { CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/products";

type ProductRow = {
  name: string;
  slug: string;
  category_slug: string;
  price: number;
  summary: string;
  details: string;
  image_url: string;
  image_urls: string[] | null;
  video_url: string | null;
};

function mapProductRow(row: ProductRow): Product {
  return {
    name: row.name,
    slug: row.slug,
    categorySlug: row.category_slug as CategorySlug,
    price: Number(row.price),
    summary: row.summary,
    details: row.details,
    imageUrl: row.image_url,
    imageUrls: row.image_urls ?? [row.image_url],
    videoUrl: row.video_url ?? undefined,
  };
}

function mapProductToRow(product: Product): ProductRow {
  return {
    name: product.name,
    slug: product.slug,
    category_slug: product.categorySlug,
    price: product.price,
    summary: product.summary,
    details: product.details,
    image_url: product.imageUrl,
    image_urls: product.imageUrls ?? [product.imageUrl],
    video_url: product.videoUrl ?? null,
  };
}

export async function fetchSupabaseProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("name, slug, category_slug, price, summary, details, image_url, image_urls, video_url")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function fetchSupabaseProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("name, slug, category_slug, price, summary, details, image_url, image_urls, video_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProductRow(data as ProductRow) : null;
}

export async function upsertSupabaseProduct(product: Product) {
  const payload = mapProductToRow(product);

  if (!payload.name.trim() || !payload.slug.trim()) {
    throw new Error("Product name is required.");
  }

  const { data: existing, error: lookupError } = await supabase
    .from("products")
    .select("slug")
    .eq("slug", payload.slug)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existing) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("slug", payload.slug);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from("products").insert(payload);

  if (error) {
    throw error;
  }
}

export async function deleteSupabaseProduct(slug: string) {
  const { error } = await supabase.from("products").delete().eq("slug", slug);

  if (error) {
    throw error;
  }
}

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const filePath = `${crypto.randomUUID()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
