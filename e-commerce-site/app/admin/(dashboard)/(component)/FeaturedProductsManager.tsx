'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  StarIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  XIcon, 
  PlusIcon, 
  CheckIcon, 
  MagnifyingGlassIcon,
  SparkleIcon,
  ArrowsLeftRightIcon
} from "@phosphor-icons/react";

export type AdminProduct = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
  variants?: { label: string; price: number; stock: number }[];
};

type Props = {
  allProducts: AdminProduct[];
  onFeaturedUpdated?: (featuredIds: number[]) => void;
};

export default function FeaturedProductsManager({ allProducts, onFeaturedUpdated }: Props) {
  // Array of exactly 4 slots (or fewer)
  const [slots, setSlots] = useState<(AdminProduct | null)[]>([null, null, null, null]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal selector state
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load current featured products
  useEffect(() => {
    async function loadFeatured() {
      try {
        setLoading(true);
        const res = await fetch("/api/featured-products");
        if (!res.ok) throw new Error("Failed to load featured products");
        const data = await res.json();
        const loaded: AdminProduct[] = data.featuredProducts || [];

        const newSlots: (AdminProduct | null)[] = [null, null, null, null];
        for (let i = 0; i < 4; i++) {
          newSlots[i] = loaded[i] || null;
        }

        setSlots(newSlots);
        if (onFeaturedUpdated) {
          onFeaturedUpdated(loaded.map((p) => p.id));
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  // Handle slot assignment
  const handleSelectProduct = (product: AdminProduct) => {
    if (activeSlotIndex === null) return;

    // Check if this product is already in another slot
    const existingIndex = slots.findIndex((s) => s?.id === product.id);

    const newSlots = [...slots];
    if (existingIndex !== -1 && existingIndex !== activeSlotIndex) {
      // Swap them
      newSlots[existingIndex] = newSlots[activeSlotIndex];
    }
    newSlots[activeSlotIndex] = product;

    setSlots(newSlots);
    setHasChanges(true);
    setActiveSlotIndex(null);
    setSearchQuery("");
  };

  // Remove from slot
  const handleRemoveSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots[index] = null;
    setSlots(newSlots);
    setHasChanges(true);
  };

  // Move slot left
  const handleMoveLeft = (index: number) => {
    if (index <= 0) return;
    const newSlots = [...slots];
    const temp = newSlots[index - 1];
    newSlots[index - 1] = newSlots[index];
    newSlots[index] = temp;
    setSlots(newSlots);
    setHasChanges(true);
  };

  // Move slot right
  const handleMoveRight = (index: number) => {
    if (index >= 3) return;
    const newSlots = [...slots];
    const temp = newSlots[index + 1];
    newSlots[index + 1] = newSlots[index];
    newSlots[index] = temp;
    setSlots(newSlots);
    setHasChanges(true);
  };

  // Save to DB
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      // Extract non-null product IDs in current order
      const productIds = slots.filter((s): s is AdminProduct => s !== null).map((s) => s.id);

      const res = await fetch("/api/featured-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update featured products");

      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

      if (onFeaturedUpdated) {
        onFeaturedUpdated(productIds);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const selectedIds = new Set(slots.filter((s): s is AdminProduct => s !== null).map((s) => s.id));

  const filteredCatalog = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <StarIcon className="size-4" weight="fill" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">
              Home Page Featured Showcase
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Choose exactly 4 fragrances from your catalog to highlight in the &quot;Featured Fragrances&quot; section on the home page.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {saveSuccess && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <CheckIcon className="size-3.5" />
              <span>Showcase Saved!</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition active:scale-[0.98] ${
              hasChanges
                ? "bg-black text-white hover:bg-neutral-800 shadow-sm"
                : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
            }`}
          >
            <SparkleIcon className="size-4 text-amber-400" />
            <span>{saving ? "Saving..." : hasChanges ? "Save Home Page Showcase" : "Showcase Synced"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* 4 Showcase Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[0, 1, 2, 3].map((slotIdx) => {
          const item = slots[slotIdx];

          return (
            <div
              key={slotIdx}
              className={`relative rounded-2xl border transition-all p-4 flex flex-col justify-between min-h-[300px] ${
                item
                  ? "border-neutral-200 bg-neutral-50/60 shadow-xs"
                  : "border-dashed border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50/30"
              }`}
            >
              {/* Slot Indicator Pill */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[11px] font-bold text-neutral-700 border border-neutral-200 shadow-2xs">
                  <span>Slot {slotIdx + 1}</span>
                  {slotIdx === 0 && <span className="text-[10px] text-amber-600 font-normal">(Hero)</span>}
                </span>

                {item && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={slotIdx === 0}
                      onClick={() => handleMoveLeft(slotIdx)}
                      aria-label="Move slot left"
                      className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowLeftIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={slotIdx === 3}
                      onClick={() => handleMoveRight(slotIdx)}
                      aria-label="Move slot right"
                      className="p-1 rounded-md text-neutral-400 hover:text-black hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(slotIdx)}
                      aria-label="Remove item from slot"
                      className="p-1 rounded-md text-rose-500 hover:bg-rose-50"
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Slot Content */}
              {item ? (
                <div className="py-4 flex flex-col items-center text-center flex-1">
                  <div className="relative size-24 rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-2xs mb-3 shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-[10px] text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {item.category}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-900 mt-0.5 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-600 mt-1">
                    Rs. {Number(item.price).toLocaleString()}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Stock: {item.stock} in inventory
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveSlotIndex(slotIdx)}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-black hover:bg-neutral-50 transition"
                  >
                    <ArrowsLeftRightIcon className="size-3.5" />
                    <span>Change Perfume</span>
                  </button>
                </div>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center flex-1 space-y-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400">
                    <PlusIcon className="size-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-700">Empty Slot {slotIdx + 1}</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">No fragrance chosen</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSlotIndex(slotIdx)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 transition"
                  >
                    <PlusIcon className="size-3.5" />
                    <span>Assign Perfume</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Select Fragrance for Slot */}
      {activeSlotIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Select Perfume for Slot {activeSlotIndex + 1}
                </h3>
                <p className="text-xs text-neutral-500">
                  Choose any fragrance from your database to display in this slot.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveSlotIndex(null);
                  setSearchQuery("");
                }}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-black"
              >
                <XIcon className="size-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search perfumes by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-xs text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="overflow-y-auto p-4 space-y-2 flex-1 divide-y divide-neutral-100">
              {filteredCatalog.map((prod) => {
                const isCurrent = slots[activeSlotIndex]?.id === prod.id;
                const slotIndexForProd = slots.findIndex((s) => s?.id === prod.id);
                const isAssignedElseWhere = slotIndexForProd !== -1 && slotIndexForProd !== activeSlotIndex;

                return (
                  <div
                    key={prod.id}
                    className="flex items-center justify-between gap-3 pt-3 first:pt-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                        {prod.image ? (
                          <Image
                            src={prod.image}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-[10px] text-neutral-400">
                            N/A
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-neutral-900">{prod.name}</p>
                          <span className="text-[10px] uppercase font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                            {prod.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Rs. {Number(prod.price).toLocaleString()} • Stock: {prod.stock}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                          <CheckIcon className="size-3.5" />
                          <span>Current</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelectProduct(prod)}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:border-black hover:bg-neutral-50 transition"
                        >
                          {isAssignedElseWhere ? (
                            <span>Swap from Slot {slotIndexForProd + 1}</span>
                          ) : (
                            <span>Choose</span>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredCatalog.length === 0 && (
                <div className="py-8 text-center text-xs text-neutral-400">
                  No perfumes match &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
