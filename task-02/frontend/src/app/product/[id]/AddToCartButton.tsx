"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={product.stock <= 0}
      className="flex w-full items-center justify-center gap-3 rounded-full bg-indigo-600 px-8 py-4 text-base font-medium text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:hover:bg-indigo-600 sm:w-auto"
    >
      <ShoppingCart className="h-5 w-5" />
      {product.stock <= 0 ? "Out of Stock" : added ? "Added to Cart!" : "Add to Cart"}
    </button>
  );
}
