import { notFound } from "next/navigation";
import { CategorySidebar } from "@/components/CategorySidebar";
import { ProductGrid } from "@/components/ProductGrid";
import { categories, getCategoryBySlug } from "@/lib/categories";
import { products } from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <section className="page-shell bg-zinc-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <CategorySidebar activeSlug={category.slug} />

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
            <ProductGrid baseProducts={products} categorySlug={category.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
