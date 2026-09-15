"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {

  return (
    <Link href={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200 transition-all hover:shadow-md dark:bg-zinc-900 dark:ring-zinc-800">
      <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.availableStock <= 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-black/60">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-medium text-white dark:bg-white dark:text-zinc-900">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {product.category}
        </div>
        <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {product.name}
        </h3>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            ${product.price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
