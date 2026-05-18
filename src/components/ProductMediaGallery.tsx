"use client";

import { useMemo, useState } from "react";

type ProductMediaGalleryProps = {
  images: string[];
  videoUrl?: string;
};

function getYouTubeEmbedUrl(url?: string) {
  if (!url) {
    return "";
  }

  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
}

export function ProductMediaGallery({ images, videoUrl }: ProductMediaGalleryProps) {
  const safeImages = images.length > 0 ? images : ["/placeholder-product.png"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(videoUrl), [videoUrl]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div
        className="product-image aspect-square rounded-xl bg-zinc-100 bg-cover bg-center"
        style={{ backgroundImage: `url(${activeImage})` }}
      />
      <div className="mt-4 grid grid-cols-5 gap-2">
        {safeImages.map((image) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveImage(image)}
            className={`aspect-square rounded-lg bg-cover bg-center transition ${
              activeImage === image ? "ring-2 ring-zinc-900" : "ring-1 ring-transparent"
            }`}
            style={{ backgroundImage: `url(${image})` }}
            aria-label="Preview product image"
          />
        ))}
      </div>
      {embedUrl ? (
        <div className="mt-5 overflow-hidden rounded-xl">
          <iframe
            className="aspect-video w-full"
            src={embedUrl}
            title="Product video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  );
}
