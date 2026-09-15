"use client";

import { useCartStore } from "@/store/useCartStore";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { items, removeItem, updateQuantity } = useCartStore();
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Your cart is empty</h2>
        <p className="mb-8 text-zinc-500 dark:text-zinc-400">Looks like you haven&apos;t added anything yet.</p>
        <Link href="/" className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
        Shopping Cart
      </h1>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ul role="list" className="divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {items.map((item) => (
              <li key={item.id} className="flex py-6 sm:py-10">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 sm:h-32 sm:w-32">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={128}
                    height={128}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <h3 className="text-sm">
                        <Link href={`/product/${item.id}`} className="font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400">
                          {item.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 w-min">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="absolute right-0 top-0">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="-m-2 inline-flex p-2 text-zinc-400 hover:text-red-500"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-6">Order Summary</h2>
            <div className="flow-root">
              <dl className="-my-4 divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                <div className="flex items-center justify-between py-4">
                  <dt className="text-zinc-600 dark:text-zinc-400">Subtotal</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">${totalPrice.toFixed(2)}</dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-zinc-600 dark:text-zinc-400">Shipping</dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-100">Free</dd>
                </div>
                <div className="flex items-center justify-between py-4">
                  <dt className="text-base font-medium text-zinc-900 dark:text-zinc-100">Order total</dt>
                  <dd className="text-base font-bold text-zinc-900 dark:text-zinc-100">${totalPrice.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => router.push('/checkout')}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
