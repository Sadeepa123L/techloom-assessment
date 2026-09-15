import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

async function getProduct(id: string) {
  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json() as Promise<Product>;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold">Product not found</h2>
        <Link href="/" className="text-indigo-600 hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 lg:max-w-xl">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col pt-4 sm:pt-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-zinc-900 dark:text-zinc-100">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-zinc-700 dark:text-zinc-300">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-10 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
