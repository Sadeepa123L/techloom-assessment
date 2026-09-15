"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CartButton() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="relative group p-2">
      <span className="sr-only">Cart</span>
      <ShoppingBag className="h-6 w-6 text-zinc-600 transition-colors group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white" />
      {mounted && totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-zinc-950">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
