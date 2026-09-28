'use client'

import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Blog() {
  return (
    <div className="w-full py-16 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="w-full lg:w-1/2">
            <h3 className="text-sm sm:text-base md:text-xl font-light tracking-wide text-neutral-600">THE ZARB STANDARD</h3>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mt-2 md:tracking-wider uppercase">Premium Fragrance Without Compromise</h2>
            <p className="text-sm sm:text-base font-light mt-4 w-full lg:w-4/5 text-justify leading-relaxed md:tracking-wider">At Zarb, we don't design scents to simply blend into the background. Every bottle is formulated with concentrated perfume oils and rich, grounding notes engineered to project confidence from morning boardroom to late evening. It is subtle up close, commanding from a distance, and unforgettable once you leave.</p>
            <ul className="flex gap-6 items-center mt-6">
                <li><Link href={'/'}><InstagramLogoIcon className="size-8 sm:size-10 hover:opacity-75 transition" /></Link></li>
                <li><Link href={'/'}><TiktokLogoIcon className="size-8 sm:size-10 hover:opacity-75 transition" /></Link></li>
                <li><Link href={'/'}><FacebookLogoIcon className="size-8 sm:size-10 hover:opacity-75 transition" /></Link></li>
            </ul>
        </div>
        <div className="w-full lg:w-1/2 flex items-center justify-center">
            <img src="/images/aboutscent.png" className="w-full max-h-[450px] lg:max-h-[550px] object-cover object-top rounded-2xl shadow-sm shadow-black/20" alt="blog icon" />
        </div>
    </div>
  )
}
