'use client'

import { MagnifyingGlassIcon, ShoppingBagIcon, UserCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full h-1/6 flex justify-between items-center p-5 border-b-2 my-5">
        <div className="px-10">
            <h2 className="text-4xl font-semibold font-[Gebuk]">Zarb Official</h2>
        </div>
        <div>
            <ul className="flex justify-center items-center gap-12">
                <li className="text-xl font-medium"><Link href={'/'}>Home</Link></li>
                <li className="text-xl font-medium"><Link href={'/'}>Product</Link></li>
                <li className="text-xl font-medium"><Link href={'/'}>Blog</Link></li>
            </ul>
        </div>
        <div className="px-10">
            <ul className="flex justify-center items-center gap-10">
                <li><Link href={'/'}><MagnifyingGlassIcon size={35} /></Link></li>
                <li><Link href={"/"}><ShoppingBagIcon size={35} /></Link></li>
                <li><Link href={"/"}><UserCircleIcon size={35} /></Link></li>
            </ul>
        </div>
    </nav>
  )
}
