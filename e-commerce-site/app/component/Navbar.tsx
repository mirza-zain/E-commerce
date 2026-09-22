'use client'

import { ListIcon, MagnifyingGlassIcon, ShoppingBagIcon, XIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <nav className="w-full border-b border-neutral-200 bg-[#FAf8F5]/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-[Gebuk] tracking-tight">
            <Link href={'/'}>Zarb Official</Link>
          </h2>
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
              <Link href={'/'}>Blog</Link>
            </li>
          </ul>
        </div>
        <div>
          <ul className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8">
            <li>
              <Link href={'/'}>
                <MagnifyingGlassIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </Link>
            </li>
            <li>
              <Link href={"/"}>
                <ShoppingBagIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </Link>
            </li>
            {
              menuOpen ? 
              <li>
                <XIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </li> 
              :
              <li>
                <ListIcon className="size-6 sm:size-7 md:size-8 hover:opacity-70 transition" />
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}
