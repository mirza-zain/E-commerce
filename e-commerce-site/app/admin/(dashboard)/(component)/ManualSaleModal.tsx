'use client'

import { useEffect, useState } from "react";
import { 
  XIcon, 
  PlusIcon, 
  TrashIcon, 
  CheckCircleIcon,
  InstagramLogoIcon,
  UsersIcon,
  WhatsappLogoIcon,
  StorefrontIcon,
  ReceiptIcon
} from "@phosphor-icons/react";

type ProductVariant = {
  label: string;
  price: number;
  stock: number;
};

type Product = {
  id: number;
  name: string;
  price: string | number;
  stock: string | number;
  variants?: ProductVariant[];
};

type SelectedItem = {
  productId: number;
  variantLabel: string;
  quantity: number;
  price: number;
  maxStock: number;
};

type ManualSaleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function ManualSaleModal({ isOpen, onClose, onSuccess }: ManualSaleModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [channel, setChannel] = useState<"instagram" | "reference" | "whatsapp" | "direct">("instagram");
  const [customerName, setCustomerName] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [city, setCity] = useState("Karachi");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  
  const [items, setItems] = useState<SelectedItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "unpaid">("paid");
  const [orderStatus, setOrderStatus] = useState<"delivered" | "processing" | "pending">("delivered");
  const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [deliveryAmount, setDeliveryAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [deductStock, setDeductStock] = useState(true);

  // Load products on mount
  useEffect(() => {
    if (!isOpen) return;
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch("/api/product");
        if (!res.ok) throw new Error("Failed to load products");
        const data: Product[] = await res.json();
        setProducts(data);

        // Pre-add 1 empty item if items list is empty
        if (items.length === 0 && data.length > 0) {
          const first = data[0];
          const initialVariant = first.variants?.[0];
          setItems([{
            productId: first.id,
            variantLabel: initialVariant?.label || "",
            quantity: 1,
            price: initialVariant ? Number(initialVariant.price) : Number(first.price),
            maxStock: initialVariant ? initialVariant.stock : Number(first.stock)
          }]);
        }
      } catch (err) {
        console.error("Products fetch error:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProductChange = (index: number, productId: number) => {
    const selectedProd = products.find(p => p.id === productId);
    if (!selectedProd) return;

    const initialVariant = selectedProd.variants?.[0];
    const newItems = [...items];
    newItems[index] = {
      productId,
      variantLabel: initialVariant?.label || "",
      quantity: 1,
      price: initialVariant ? Number(initialVariant.price) : Number(selectedProd.price),
      maxStock: initialVariant ? initialVariant.stock : Number(selectedProd.stock)
    };
    setItems(newItems);
  };

  const handleVariantChange = (index: number, variantLabel: string) => {
    const item = items[index];
    const prod = products.find(p => p.id === item.productId);
    const variant = prod?.variants?.find(v => v.label === variantLabel);

    const newItems = [...items];
    newItems[index] = {
      ...item,
      variantLabel,
      price: variant ? Number(variant.price) : Number(prod?.price || item.price),
      maxStock: variant ? variant.stock : Number(prod?.stock || 0)
    };
    setItems(newItems);
  };

  const handlePriceChange = (index: number, price: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], price };
    setItems(newItems);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], quantity: Math.max(1, quantity) };
    setItems(newItems);
  };

  const addItemRow = () => {
    if (products.length === 0) return;
    const prod = products[0];
    const variant = prod.variants?.[0];
    setItems([
      ...items,
      {
        productId: prod.id,
        variantLabel: variant?.label || "",
        quantity: 1,
        price: variant ? Number(variant.price) : Number(prod.price),
        maxStock: variant ? variant.stock : Number(prod.stock)
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const netTotal = Math.max(0, subTotal + Number(deliveryAmount || 0) - Number(discountAmount || 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Please add at least one fragrance item.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        channel,
        customerName: customerName.trim() || `${channel.toUpperCase()} Customer`,
        phoneNum: phoneNum.trim(),
        city: city.trim() || "Karachi",
        address: address.trim() || `${channel.toUpperCase()} Direct Sale`,
        items: items.map(i => ({
          productId: i.productId,
          variantLabel: i.variantLabel || null,
          quantity: i.quantity,
          price: i.price
        })),
        paymentMethod,
        paymentStatus,
        orderStatus,
        deliveryAmount: Number(deliveryAmount) || 0,
        discountAmount: Number(discountAmount) || 0,
        saleDate: saleDate ? new Date(saleDate).toISOString() : new Date().toISOString(),
        deductStock,
        notes: notes.trim()
      };

      const res = await fetch("/api/orders/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to record sale");

      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-neutral-200 my-8 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-black text-white">
              <ReceiptIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900">
                Record Offline / External Sale
              </h2>
              <p className="text-xs text-neutral-500">
                Add sales from Instagram, Referrals, WhatsApp, or Walk-ins to update dashboard stats.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800">
              {error}
            </div>
          )}

          {/* 1. Channel Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
              Sale Channel / Origin
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setChannel("instagram")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  channel === "instagram"
                    ? "border-fuchsia-600 bg-fuchsia-50 text-fuchsia-800 ring-2 ring-fuchsia-400/30"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <InstagramLogoIcon className="size-4 text-fuchsia-600" />
                <span>Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("reference")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  channel === "reference"
                    ? "border-indigo-600 bg-indigo-50 text-indigo-800 ring-2 ring-indigo-400/30"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <UsersIcon className="size-4 text-indigo-600" />
                <span>Reference</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("whatsapp")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  channel === "whatsapp"
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400/30"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <WhatsappLogoIcon className="size-4 text-emerald-600" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setChannel("direct")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition ${
                  channel === "direct"
                    ? "border-amber-600 bg-amber-50 text-amber-800 ring-2 ring-amber-400/30"
                    : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                }`}
              >
                <StorefrontIcon className="size-4 text-amber-600" />
                <span>In-Person</span>
              </button>
            </div>
          </div>

          {/* 2. Purchased Items & Custom Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                Products Sold ({items.length})
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:underline"
              >
                <PlusIcon className="size-3.5" />
                <span>Add Another Item</span>
              </button>
            </div>

            {loadingProducts ? (
              <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-500 animate-pulse text-center">
                Loading store fragrances...
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item, idx) => {
                  const currentProd = products.find(p => p.id === item.productId);
                  const hasVariants = currentProd?.variants && currentProd.variants.length > 0;

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/60 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                    >
                      {/* Product select */}
                      <div className="flex-1 w-full sm:w-auto">
                        <select
                          value={item.productId}
                          onChange={(e) => handleProductChange(idx, Number(e.target.value))}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-black"
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} (Stock: {p.stock})
                            </option>
                          ))}
                        </select>

                        {/* Variant select if available */}
                        {hasVariants && (
                          <div className="mt-1.5">
                            <select
                              value={item.variantLabel}
                              onChange={(e) => handleVariantChange(idx, e.target.value)}
                              className="w-full rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-[11px] text-neutral-700"
                            >
                              {currentProd.variants?.map((v) => (
                                <option key={v.label} value={v.label}>
                                  Variation: {v.label} - Rs. {v.price} (Stock: {v.stock})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Quantity */}
                      <div className="w-24 shrink-0">
                        <label className="block text-[10px] text-neutral-500 mb-0.5">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-center focus:ring-2 focus:ring-black"
                        />
                      </div>

                      {/* Selling Price Per Unit (Editable!) */}
                      <div className="w-32 shrink-0">
                        <label className="block text-[10px] text-neutral-500 mb-0.5">Price / bottle</label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">Rs.</span>
                          <input
                            type="number"
                            min="0"
                            value={item.price}
                            onChange={(e) => handlePriceChange(idx, Number(e.target.value))}
                            className="w-full rounded-lg border border-neutral-300 bg-white pl-8 pr-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:ring-2 focus:ring-black"
                          />
                        </div>
                      </div>

                      {/* Item Total & Remove */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-2 sm:pt-4">
                        <span className="text-xs font-bold text-neutral-900 whitespace-nowrap">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="text-rose-600 hover:text-rose-800 p-1"
                          >
                            <TrashIcon className="size-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Deduct Stock Option */}
            <label className="inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={deductStock}
                onChange={(e) => setDeductStock(e.target.checked)}
                className="size-4 rounded border-neutral-300 text-black focus:ring-black"
              />
              <span>Deduct sold quantities from inventory stock</span>
            </label>
          </div>

          {/* 3. Customer & Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Customer Name / Handle
              </label>
              <input
                type="text"
                placeholder={channel === "instagram" ? "@insta_buyer or Name" : "Customer Name"}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Phone Number (optional)
              </label>
              <input
                type="text"
                placeholder="03001234567"
                value={phoneNum}
                onChange={(e) => setPhoneNum(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                City / Location
              </label>
              <input
                type="text"
                placeholder="Karachi, Lahore, etc."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Sale Date
              </label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Address / Delivery Notes (optional)
              </label>
              <input
                type="text"
                placeholder="Handed over personally, courier address, or referral notes"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* 4. Payment & Order Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-neutral-100">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              >
                <option value="Cash">Cash (In-hand)</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                <option value="COD">Cash on Delivery (Courier)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as "paid" | "unpaid")}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              >
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid / Pending</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Order Status
              </label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as "delivered" | "processing" | "pending")}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-xs text-neutral-900 focus:ring-2 focus:ring-black"
              >
                <option value="delivered">Delivered / Handed Over</option>
                <option value="processing">Processing (Needs Dispatch)</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* 5. Financial Summary Callout */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-neutral-900">Rs. {subTotal.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-0.5">Delivery Fee (if any)</label>
                <input
                  type="number"
                  min="0"
                  value={deliveryAmount}
                  onChange={(e) => setDeliveryAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 mb-0.5">Discount (if any)</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
              <span className="text-sm font-bold text-neutral-900">Total Sale Amount:</span>
              <span className="text-xl font-black text-emerald-700">Rs. {netTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold transition shadow-sm active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <span>Recording Sale...</span>
              ) : (
                <>
                  <CheckCircleIcon className="size-4" />
                  <span>Save Sale to Dashboard</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

