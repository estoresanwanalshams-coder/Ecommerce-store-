import type { Product } from "@/lib/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

export const cartStorageKey = "storefront-cart";

export function getCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedCart = window.localStorage.getItem(cartStorageKey);

  if (!storedCart) {
    return [];
  }

  try {
    return JSON.parse(storedCart) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addProductToCart(product: Product) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.product.slug === product.slug);

  if (existingItem) {
    existingItem.quantity += 1;
    saveCartItems(items);
    return;
  }

  saveCartItems([...items, { product, quantity: 1 }]);
}
