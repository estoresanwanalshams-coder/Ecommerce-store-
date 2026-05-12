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
  };
}

export async function fetchSupabaseProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("name, slug, category_slug, price, summary, details, image_url")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapProductRow(row as ProductRow));
}

export async function fetchSupabaseProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("name, slug, category_slug, price, summary, details, image_url")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapProductRow(data as ProductRow) : null;
}

export async function upsertSupabaseProduct(product: Product) {
  const { error } = await supabase
    .from("products")
    .upsert(mapProductToRow(product), { onConflict: "slug" });

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
