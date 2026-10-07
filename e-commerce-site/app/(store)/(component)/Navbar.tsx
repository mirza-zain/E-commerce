'use client'

import { ListIcon, ShoppingBagIcon, XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const {cart} = useCart()
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [menuOpen])
  return (
    <nav className="w-full border-b border-neutral-200 bg-[#FAf8F5]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="relative block h-12 w-40 overflow-hidden sm:h-14 sm:w-48" aria-label="Zarb Official home">
            <Image src="/images/logo.jpeg" alt="Zarb Official" fill priority className="object-cover object-center" />
          </Link>
        </div>
        <div className="hidden lg:block">
          <ul className="flex justify-center items-center gap-10">
            <li className="text-lg font-medium hover:opacity-70 transition">
              <Link href={'/'}>Home</Link>
            </li>
            <li className="text-lg font-medium hover:opacity-70 transition">
              <Link href={'/product'}>Product</Link>
            </li>
            <li className="text-lg font-medium hover:opacity-70 transition">
              <Link href={'/track'}>Track</Link>
            </li>
            <li className="text-lg font-medium hover:opacity-70 transition">
              <Link href={'/contact'}>Contact</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
            {/* <li>
              <Link href={'/'}>
                <MagnifyingGlassIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </Link>
            </li> */}
            <li>
              <Link href={"/cart"} className="relative flex justify-center items-center">
                <ShoppingBagIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] sm:text-xs font-semibold rounded-full min-w-4 h-4 sm:min-w-5 sm:h-5 px-1 flex items-center justify-center pointer-events-none" aria-label={`${totalItems} items in cart`}>{totalItems}</span>
                )}
              </Link>
            </li>
            {
              menuOpen ? 
              <button className="block lg:hidden" onClick={() => setMenuOpen(false)}>
                <XIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </button> 
              :
              <button className="block lg:hidden" onClick={() => setMenuOpen(true)}>
                <ListIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </button>
            }
          </ul>
        </div>
      </div>
      {
        menuOpen && 
        <div className="w-full h-screen flex flex-col justify-center items-center ">
         <ul className="flex flex-col justify-center items-center gap-20">
            <li className="text-2xl font-medium hover:opacity-70 transition">
              <Link href={'/'} onClick={() => setMenuOpen(false)} >Home</Link>
            </li>
            <li className="text-2xl font-medium hover:opacity-70 transition">
              <Link href={'/product'} onClick={() => setMenuOpen(false)} >Product</Link>
            </li>
            <li className="text-2xl font-medium hover:opacity-70 transition">
              <Link href={'/track'} onClick={() => setMenuOpen(false)} >Track</Link>
            </li>
            <li className="text-2xl font-medium hover:opacity-70 transition">
              <Link href={'/contact'} onClick={() => setMenuOpen(false)} >Contact</Link>
            </li>
          </ul> 
        </div>
      }
    </nav>
  );
}
