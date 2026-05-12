export type Category = {
  name: string;
  slug: string;
  description: string;
};

export const categories: Category[] = [
  {
    name: "Home and Kitchen",
    slug: "home-and-kitchen",
    description: "Useful kitchen tools, dining basics, storage, and home essentials.",
  },
  {
    name: "Electronic Gadgets",
    slug: "electronic-gadgets",
    description: "Smart accessories, compact tech, chargers, and everyday gadgets.",
  },
  {
    name: "Baby & Toys",
    slug: "baby-toys",
    description: "Baby care items, playful toys, learning products, and gifting picks.",
  },
  {
    name: "Automative",
    slug: "automative",
    description: "Car accessories, maintenance helpers, organizers, and travel tools.",
  },
  {
    name: "Health & Beauty",
    slug: "health-beauty",
    description: "Self-care, grooming, beauty tools, and wellness essentials.",
  },
] as const satisfies Category[];

export type CategorySlug = string;

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
