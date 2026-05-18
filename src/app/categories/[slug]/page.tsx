import { ProductGrid } from "@/components/ProductGrid";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { fetchMergedCategories } from "@/lib/supabase-categories";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const mergedCategories = await fetchMergedCategories().catch(() => categories);

  return mergedCategories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const allCategories = await fetchMergedCategories().catch(() => categories);
  const category = getCategoryBySlug(slug, allCategories) ?? {
    name: slug
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    slug,
    description: "Browse available products in this category.",
  };

  return (
    <section className="page-shell bg-zinc-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="content-reveal">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Category
          </p>
          <h1 className="mt-3 text-3xl font-bold text-zinc-950 sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            {category.description}
          </p>

          <div className="mt-8">
            <ProductGrid categorySlug={category.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
