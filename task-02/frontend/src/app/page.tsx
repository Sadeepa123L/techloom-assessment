import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

async function getProducts(search?: string, category?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category) params.append("category", category);
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/products?${params.toString()}`, {
    cache: "no-store", // We want fresh data for e-commerce
  });
  
  if (!res.ok) {
    return [];
  }
  
  return res.json() as Promise<Product[]>;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { search, category } = await searchParams;
  const products = await getProducts(
    typeof search === "string" ? search : undefined,
    typeof category === "string" ? category : undefined
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Our Products
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Premium selection of items tailored for you.
          </p>
        </div>
        
        {/* Basic Filters (Could be extracted to a client component) */}
        <div className="flex items-center gap-4">
          <a
            href="/"
            className={`rounded-full px-4 py-2 text-sm font-medium ${!category ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"}`}
          >
            All
          </a>
          <a
            href="/?category=Electronics"
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === "Electronics" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"}`}
          >
            Electronics
          </a>
          <a
            href="/?category=Accessories"
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === "Accessories" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"}`}
          >
            Accessories
          </a>
          <a
            href="/?category=Furniture"
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === "Furniture" ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"}`}
          >
            Furniture
          </a>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">No products found</h3>
          <p className="text-zinc-500 dark:text-zinc-400">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
