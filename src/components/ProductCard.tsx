"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  index: number;
};

export function ProductCard({ product, index }: ProductCardProps) {
  const images = useMemo(
    () =>
      Array.from(
        new Set([product.imageUrl, ...(product.imageUrls ?? [])].filter(Boolean)),
      ),
    [product.imageUrl, product.imageUrls],
  );

  const [imageIndex, setImageIndex] = useState(0);
  const activeImage = images[imageIndex] ?? product.imageUrl;

  function handleMouseEnter() {
    if (images.length > 1) {
      setImageIndex(1);
    }
  }

  function handleMouseLeave() {
    setImageIndex(0);
  }

  return (
    <article
      className="product-card group flex h-full flex-col overflow-hidden bg-white"
      style={{ animationDelay: `${index * 70}ms` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/products/${product.slug}`}
        prefetch={false}
        className="product-card-media block shrink-0"
      >
        <div className="product-image relative aspect-[4/3] overflow-hidden bg-zinc-100">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5">
        <Link
          href={`/products/${product.slug}`}
          prefetch={false}
          className="block flex-1"
        >
          <h3 className="line-clamp-2 min-h-[2.75rem] text-[0.98rem] font-bold leading-snug text-zinc-950">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href={`/products/${product.slug}`}
            prefetch={false}
            className="text-base font-bold text-zinc-950"
          >
            AED {product.price}
          </Link>
          <AddToCartButton
            product={product}
            label="Add to Cart"
            className="animated-button shrink-0 rounded-md bg-zinc-950 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-zinc-700 sm:px-3 sm:text-sm"
          />
        </div>
      </div>
    </article>
  );
}
