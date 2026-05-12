"use client";

import { useEffect, useState } from "react";
import { createProductSlug } from "@/lib/admin-products";
import { categories as fallbackCategories, type Category } from "@/lib/categories";
import {
  deleteSupabaseCategory,
  fetchSupabaseCategories,
  upsertSupabaseCategory,
} from "@/lib/supabase-categories";

export function AdminCategoryPanel() {
  const [items, setItems] = useState<Category[]>(fallbackCategories);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function loadCategories() {
    const nextCategories = await fetchSupabaseCategories().catch(() => []);
    setItems(nextCategories.length > 0 ? nextCategories : fallbackCategories);
  }

  useEffect(() => {
    const timer = window.setTimeout(loadCategories, 0);

    return () => window.clearTimeout(timer);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await upsertSupabaseCategory({
        name,
        slug: createProductSlug(name),
        description,
      });
      await loadCategories();
      setName("");
      setDescription("");
      setMessage("Category saved.");
    } catch {
      setMessage("Unable to save category. Check Supabase category policies.");
    }
  }

  async function handleDelete(slug: string) {
    try {
      await deleteSupabaseCategory(slug);
      await loadCategories();
      setMessage("Category deleted.");
    } catch {
      setMessage("Unable to delete category. Make sure no products are using it.");
    }
  }

  return (
    <section className="page-shell border-t border-zinc-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="content-reveal h-fit rounded-2xl bg-zinc-950 p-6 text-white shadow-xl"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Category manager
          </p>
          <h2 className="mt-3 text-3xl font-bold">Add category</h2>
          <div className="mt-7 grid gap-4">
            <label className="form-field">
              Category name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter category name"
                required
              />
            </label>
            <label className="form-field">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short category description"
                rows={3}
                required
              />
            </label>
          </div>
          <button className="animated-button inquiry-submit mt-6 w-full">
            Save Category
          </button>
        </form>

        <div className="content-reveal">
          <h2 className="text-3xl font-bold text-zinc-950">Current categories</h2>
          {message ? (
            <p className="mt-4 rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-700">
              {message}
            </p>
          ) : null}
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {items.map((category) => (
              <article
                key={category.slug}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-xl font-bold text-zinc-950">{category.name}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  {category.description}
                </p>
                <button
                  type="button"
                  onClick={() => handleDelete(category.slug)}
                  className="mt-4 rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
