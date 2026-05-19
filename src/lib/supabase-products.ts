import { supabase } from "@/lib/supabase";
import type { CategorySlug } from "@/lib/categories";
import { normalizeImageUrl, normalizeImageUrls } from "@/lib/image-url";
import type { Product } from "@/lib/products";

type ProductRow = {
  name: string;
  slug: string;
  category_slug: string;
  price: number | string;
  summary: string | null;
  details: string | null;
  image_url: string | null;
  image_urls: string[] | null;
  video_url: string | null;
};

export type ProductListResult = {
  products: Product[];
  hasNextPage: boolean;
};

function mapProductRow(row: ProductRow): Product {
  const primaryImage = normalizeImageUrl(
    row.image_url ?? row.image_urls?.[0] ?? "/banners/banner-1.png",
  );
  return {
    name: row.name,
    slug: row.slug,
    categorySlug: row.category_slug as CategorySlug,
    price: Number(row.price),
    summary: row.summary ?? "",
    details: row.details ?? "",
    imageUrl: primaryImage,
    imageUrls: normalizeImageUrls(
      row.image_urls?.length ? row.image_urls : [primaryImage],
    ),
    videoUrl: row.video_url ?? undefined,
  };
}

function mapProductToRow(product: Product): ProductRow {
  const mainImage = normalizeImageUrl(product.imageUrl);
  const imageUrls = normalizeImageUrls(product.imageUrls ?? [mainImage]);

  return {
    name: product.name,
    slug: product.slug,
    category_slug: product.categorySlug,
    price: product.price,
    summary: product.summary,
    details: product.details,
    image_url: mainImage,
    image_urls: imageUrls,
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

type FetchSupabaseProductsPageOptions = {
  categorySlug?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchSupabaseProductsPage(
  options: FetchSupabaseProductsPageOptions = {},
): Promise<ProductListResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, Math.min(40, options.pageSize ?? 12));
  const from = (page - 1) * pageSize;
  const to = from + pageSize;

  let query = supabase
    .from("products")
    .select("name, slug, category_slug, price, image_url, image_urls")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (options.categorySlug) {
    query = query.eq("category_slug", options.categorySlug);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProductRow[];
  const hasNextPage = rows.length > pageSize;
  const currentRows = hasNextPage ? rows.slice(0, pageSize) : rows;

  return {
    products: currentRows.map((row) => mapProductRow(row)),
    hasNextPage,
  };
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

export async function fetchSupabaseRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
) {
  const { data, error } = await supabase
    .from("products")
    .select("name, slug, category_slug, price, image_url, image_urls")
    .eq("category_slug", categorySlug)
    .neq("slug", excludeSlug)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return ((data ?? []) as ProductRow[]).map((row) => mapProductRow(row));
}

type FetchSupabaseSearchProductsOptions = {
  page?: number;
  pageSize?: number;
};

export async function fetchSupabaseSearchProducts(
  queryText: string,
  options: FetchSupabaseSearchProductsOptions = {},
): Promise<ProductListResult> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.max(1, Math.min(40, options.pageSize ?? 12));
  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const query = queryText.trim();

  let builder = supabase
    .from("products")
    .select("name, slug, category_slug, price, image_url, image_urls")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (query) {
    const likeQuery = `%${query}%`;
    builder = builder.or(
      `name.ilike.${likeQuery},summary.ilike.${likeQuery},details.ilike.${likeQuery}`,
    );
  }

  const { data, error } = await builder;

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as ProductRow[];
  const hasNextPage = rows.length > pageSize;
  const currentRows = hasNextPage ? rows.slice(0, pageSize) : rows;

  return {
    products: currentRows.map((row) => mapProductRow(row)),
    hasNextPage,
  };
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
