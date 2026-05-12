"use client";

import { useEffect, useMemo, useState } from "react";
import { createProductSlug } from "@/lib/admin-products";
import {
  categories as fallbackCategories,
  type Category,
  type CategorySlug,
} from "@/lib/categories";
import type { Product } from "@/lib/products";
import {
  deleteSupabaseProduct,
  fetchSupabaseProducts,
  upsertSupabaseProduct,
} from "@/lib/supabase-products";
import { fetchSupabaseCategories } from "@/lib/supabase-categories";

const emptyForm = {
  name: "",
  categorySlug: "home-and-kitchen" as CategorySlug,
  price: "",
  imageUrl: "",
  summary: "",
  details: "",
};

type ProductForm = typeof emptyForm;

export function AdminProductPanel() {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [categoryItems, setCategoryItems] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    async function loadProducts() {
      try {
        const [nextProducts, nextCategories] = await Promise.all([
          fetchSupabaseProducts(),
          fetchSupabaseCategories().catch(() => []),
        ]);
        setAdminProducts(nextProducts);
        setCategoryItems(nextCategories.length > 0 ? nextCategories : fallbackCategories);
      } catch {
        setMessage("Create the Supabase products table before using admin CRUD.");
      } finally {
        setIsLoading(false);
      }
    }

    const timer = window.setTimeout(loadProducts, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const allProducts = useMemo(() => adminProducts, [adminProducts]);

  function updateForm(field: keyof ProductForm, value: string) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function resetForm() {
    setEditingSlug(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const slug = editingSlug ?? createProductSlug(form.name);
    const product: Product = {
      name: form.name,
      slug,
      categorySlug: form.categorySlug,
      price: Number(form.price),
      imageUrl: form.imageUrl,
      summary: form.summary,
      details: form.details,
    };

    try {
      await upsertSupabaseProduct(product);
      setAdminProducts(await fetchSupabaseProducts());
      setMessage(editingSlug ? "Product updated." : "Product added.");
      resetForm();
    } catch {
      setMessage("Unable to save product. Check Supabase table and policies.");
    }
  }

  function editProduct(product: Product) {
    setEditingSlug(product.slug);
    setForm({
      name: product.name,
      categorySlug: product.categorySlug,
      price: String(product.price),
      imageUrl: product.imageUrl,
      summary: product.summary,
      details: product.details,
    });
  }

  async function deleteProduct(slug: string) {
    try {
      await deleteSupabaseProduct(slug);
      setAdminProducts(await fetchSupabaseProducts());
      setMessage("Product deleted.");
    } catch {
      setMessage("Unable to delete product. Check Supabase table and policies.");
    }
  }

  return (
    <section className="page-shell">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="content-reveal h-fit rounded-2xl bg-zinc-950 p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Admin panel
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            {editingSlug ? "Edit product" : "Add new product"}
          </h1>

          <div className="mt-7 grid gap-4">
            <label className="form-field">
              Product name
              <input
                value={form.name}
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Enter product name"
                required
              />
            </label>

            <label className="form-field">
              Category
              <select
                value={form.categorySlug}
                onChange={(event) =>
                  updateForm("categorySlug", event.target.value)
                }
              >
                {categoryItems.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              Price
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(event) => updateForm("price", event.target.value)}
                placeholder="AED price"
                required
              />
            </label>

            <label className="form-field">
              Image URL
              <input
                value={form.imageUrl}
                onChange={(event) => updateForm("imageUrl", event.target.value)}
                placeholder="https://image-url.com/product.jpg"
                required
              />
            </label>

            <label className="form-field">
              Short summary
              <textarea
                value={form.summary}
                onChange={(event) => updateForm("summary", event.target.value)}
                placeholder="Short text for product card"
                rows={3}
                required
              />
            </label>

            <label className="form-field">
              Product details
              <textarea
                value={form.details}
                onChange={(event) => updateForm("details", event.target.value)}
                placeholder="Detailed product page description"
                rows={4}
                required
              />
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="animated-button inquiry-submit flex-1">
              {editingSlug ? "Save Changes" : "Add Product"}
            </button>
            {editingSlug ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-white/20 px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="content-reveal">
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Product manager
          </p>
          <h2 className="mt-3 text-3xl font-bold text-zinc-950">
            Current products
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-600">
            Products shown here are stored permanently in Supabase and appear on
            the website for every visitor.
          </p>
          {message ? (
            <p className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-700">
              {message}
            </p>
          ) : null}

          <div className="mt-7 space-y-4">
            {isLoading ? (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-600">
                Loading Supabase products...
              </div>
            ) : null}
            {allProducts.map((product) => {
              return (
                <article
                  key={product.slug}
                  className="cart-row rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className="h-24 w-24 shrink-0 rounded-xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${product.imageUrl})` }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-zinc-950">
                      {product.name}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600">
                      AED {product.price}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => editProduct(product)}
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:border-zinc-950"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.slug)}
                      className="rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
