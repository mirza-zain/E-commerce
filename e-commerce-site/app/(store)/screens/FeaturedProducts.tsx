'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ShoppingBagIcon, SparkleIcon } from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";

type ProductVariant = {
  label: string;
  price: number;
  stock: number;
};

type FeaturedProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  variants: ProductVariant[];
  position?: number;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cart } = useCart();

  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/featured-products");
        if (!res.ok) throw new Error("Failed to load featured fragrances");
        const data = await res.json();
        setProducts(data.featuredProducts || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-700 text-xs font-semibold tracking-widest uppercase">
          <SparkleIcon className="size-3.5 text-amber-600" />
          <span>Curated Selection</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-950 font-[Gebuk]">
          Featured Fragrances
        </h2>

        <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto font-light">
          Handpicked signature editions commanding attention with extraordinary sillage and longevity.
        </p>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="aspect-4/5 w-full rounded-2xl bg-neutral-200" />
              <div className="h-4 w-24 rounded bg-neutral-200 mx-auto" />
              <div className="h-6 w-48 rounded bg-neutral-200 mx-auto" />
              <div className="h-12 w-full rounded-md bg-neutral-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error Fallback */}
      {error && !loading && (
        <div className="text-center py-12 text-sm text-neutral-500">
          Unable to display featured collection right now.
        </div>
      )}

      {/* Curated 4-Product Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((item) => {
            const minPrice = item.variants?.length
              ? Math.min(...item.variants.map((v) => Number(v.price) || item.price))
              : item.price;

            const selectedQuantity = cart.find((c) => c.id === item.id)?.quantity ?? 0;

            return (
              <div className="w-full flex flex-col group" key={item.id}>
                <Link href={`/productDetail/${item.id}`} className="block flex-1">
                  <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl shadow-sm bg-neutral-100 border border-neutral-100 transition-all duration-300 group-hover:shadow-lg">
                    {item.image ? (
                      <Image
                        src={item.image}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={`${item.name} perfume`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                        No Image Available
                      </div>
                    )}

                    {/* Curated Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      Featured
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 uppercase tracking-widest mt-4 text-center">
                    Zarb Store ©
                  </p>

                  <div className="flex flex-col justify-center items-center gap-1 mt-1 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-neutral-700 transition">
                      {item.name}
                    </h3>
                    <p className="text-base sm:text-lg font-light text-neutral-700">
                      {item.variants?.length ? `From Rs. ${minPrice.toLocaleString()}` : `Rs. ${Number(item.price).toLocaleString()}`}
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col gap-2 items-center mt-5 justify-center">
                  {item.variants?.length ? (
                    <Link
                      href={`/productDetail/${item.id}`}
                      className="w-full py-3.5 text-sm sm:text-base font-semibold flex items-center justify-center border-2 border-black rounded-xl uppercase transition-all duration-150 hover:bg-neutral-100 active:scale-[0.98]"
                    >
                      Choose Edition
                    </Link>
                  ) : (
                    <button
                      disabled={Number(item.stock) <= 0}
                      onClick={() => addToCart(item)}
                      aria-label={selectedQuantity > 0 ? `${selectedQuantity} selected, add another ${item.name}` : `Add ${item.name} to cart`}
                      className={`w-full py-3.5 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 border-2 rounded-xl uppercase transition-all duration-150 active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${
                        selectedQuantity > 0
                          ? "border-black bg-black text-white hover:bg-neutral-800"
                          : "border-black hover:bg-neutral-100 text-neutral-900"
                      }`}
                    >
                      <ShoppingBagIcon className="size-5" />
                      {Number(item.stock) > 0 ? (selectedQuantity > 0 ? `Added (${selectedQuantity})` : "Add to Cart") : "Out of Stock"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explore All Catalog CTA */}
      <div className="mt-14 sm:mt-16 text-center">
        <Link
          href="/product"
          className="inline-flex items-center gap-2.5 rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase text-neutral-900 hover:border-black hover:bg-black hover:text-white transition-all duration-200 shadow-xs"
        >
          <span>Explore All Fragrances</span>
          <ArrowRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  );
}
