import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/categories";

type CategoryRow = {
  name: string;
  slug: string;
  description: string | null;
};

function mapCategoryRow(row: CategoryRow): Category {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
  };
}

export async function fetchSupabaseCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("name, slug, description")
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapCategoryRow(row as CategoryRow));
}

export async function upsertSupabaseCategory(category: Category) {
  const { error } = await supabase.from("categories").upsert(
    {
      name: category.name,
      slug: category.slug,
      description: category.description,
    },
    { onConflict: "slug" },
  );

  if (error) {
    throw error;
  }
}

export async function deleteSupabaseCategory(slug: string) {
  const { error } = await supabase.from("categories").delete().eq("slug", slug);

  if (error) {
    throw error;
  }
}
