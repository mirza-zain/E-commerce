'use client'

import { ListIcon, ShoppingBagIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart()
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto"
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [menuOpen])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Product", href: "/product" },
    { name: "Track", href: "/track" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <>
      <nav className="w-full border-b border-neutral-200 bg-[#FAf8F5]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
          <div>
            <Link href="/" className="relative block h-12 w-56 overflow-hidden sm:h-14 sm:w-48" aria-label="Zarb Store home">
              <Image src="/images/logo.png" alt="Zarb Store" fill priority className="object-cover object-center" />
            </Link>
          </div>

          <div className="hidden lg:block">
            <ul className="flex justify-center items-center gap-10">
              {navLinks.map((item) => (
                <li key={item.href} className="text-lg font-medium hover:opacity-70 transition">
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ul className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
              <li>
                <Link href={"/cart"} className="relative flex justify-center items-center" aria-label="Open cart">
                  <ShoppingBagIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] sm:text-xs font-semibold rounded-full min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center pointer-events-none" aria-label={`${totalItems} items in cart`}>
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
              <li className="lg:hidden">
                <button
                  type="button"
                  className="block p-1 hover:opacity-70 transition"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-label={menuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={menuOpen}
                >
                  {menuOpen ? <XIcon className="size-6 sm:size-7 md:size-8" /> : <ListIcon className="size-6 sm:size-7 md:size-8" />}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[60] lg:hidden bg-black/45 backdrop-blur-[2px] flex justify-end animate-[drawer-fade-in_0.2s_ease-out]"
          onClick={() => setMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          <div
            className="w-4/5 max-w-sm h-full bg-[#FAf8F5] p-6 shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-[drawer-slide-in_0.3s_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
                <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Zarb Store home" className="relative block h-11 w-40 overflow-hidden">
                  <Image src="/images/logo.png" alt="Zarb Store" fill className="object-cover object-center" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-neutral-200 text-neutral-700 transition"
                  aria-label="Close menu"
                >
                  <XIcon size={22} />
                </button>
              </div>

              <ul className="flex flex-col gap-5 mt-8">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-base uppercase font-semibold tracking-widest text-neutral-800 hover:text-black transition py-1"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between text-base uppercase font-semibold tracking-widest text-neutral-800 hover:text-black transition py-1"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBagIcon size={20} />
                      <span>Cart</span>
                    </span>
                    {totalItems > 0 && (
                      <span className="bg-black text-white text-xs font-bold rounded-full px-2.5 py-0.5">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-neutral-200 space-y-2">
              <p className="text-xs text-neutral-500 tracking-wide uppercase">Premium Fragrances</p>
              <p className="text-[11px] text-neutral-400">© 2026 Zarb Store</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
