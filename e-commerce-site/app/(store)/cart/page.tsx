'use client'

import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingBagIcon, 
  TrashIcon, 
  ArrowLeftIcon, 
  PlusIcon, 
  MinusIcon, 
  ShieldCheckIcon, 
  TruckIcon 
} from "@phosphor-icons/react";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const delivery = 0; // Free delivery
  const total = subtotal + delivery;

  if (cart.length === 0) {
    return (
      <main className="w-full min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div className="size-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
            <ShoppingBagIcon className="size-10 text-neutral-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Your Cart is Empty</h1>
          <p className="mt-3 text-neutral-600 text-base leading-relaxed">
            Looks like you haven't added any luxury fragrances to your collection yet.
          </p>
          <Link
            href="/product"
            className="mt-8 px-8 py-4 bg-black text-white font-semibold uppercase rounded-lg hover:bg-neutral-800 transition active:scale-[0.98]"
          >
            Explore Fragrances
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-[80vh] py-10 sm:py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-neutral-200">
        <div>
          <Link href="/product" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition mb-2">
            <ArrowLeftIcon className="size-4" /> Continue Shopping
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
            Shopping Cart <span className="text-lg font-normal text-neutral-500">({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row items-center gap-5 sm:gap-6"
            >
              {/* Product Thumbnail */}
              <div className="relative w-28 h-28 sm:w-24 sm:h-24 aspect-square rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                <Image
                  src={item.image!}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Zarb Official</p>
                <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 truncate mt-0.5">
                  {item.name}
                </h3>
                <p className="text-sm text-neutral-500 line-clamp-1 mt-1">
                  {item.description}
                </p>
                <p className="text-base sm:text-lg font-semibold text-neutral-900 mt-2 sm:hidden">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>

              {/* Stepper Quantity Controls & Total */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                <p className="hidden sm:block text-lg font-semibold text-neutral-900">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>

                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-neutral-50">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-2 hover:bg-neutral-200 text-neutral-700 transition active:bg-neutral-300"
                      aria-label="Decrease quantity"
                    >
                      <MinusIcon className="size-3.5" />
                    </button>
                    <span className="px-3 py-1 text-sm font-semibold text-neutral-900 select-none min-w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 hover:bg-neutral-200 text-neutral-700 transition active:bg-neutral-300"
                      aria-label="Increase quantity"
                    >
                      <PlusIcon className="size-3.5" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm sticky top-24">
          <h2 className="text-xl font-bold tracking-tight text-neutral-900 pb-4 border-b border-neutral-200">
            Order Summary
          </h2>

          <div className="space-y-4 py-5 text-sm border-b border-neutral-200">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              <span className="font-medium text-neutral-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Delivery</span>
              <span className="text-emerald-600 font-medium">FREE</span>
            </div>
          </div>

          <div className="flex justify-between items-center py-5 text-lg font-bold text-neutral-900">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <Link
            href={`/payment?id=${cart[0]?.id}`}
            className="w-full mt-2 py-4 bg-black text-white text-base sm:text-lg font-semibold uppercase rounded-lg hover:bg-neutral-800 transition flex items-center justify-center text-center active:scale-[0.98]"
          >
            Proceed to Checkout
          </Link>

          {/* Trust Guarantees */}
          <div className="mt-8 pt-6 border-t border-neutral-100 space-y-3">
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              <TruckIcon className="size-5 text-neutral-800 shrink-0" />
              <span>Free, fast delivery nationwide</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-600">
              <ShieldCheckIcon className="size-5 text-neutral-800 shrink-0" />
              <span>100% authentic, premium concentrated oils</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

