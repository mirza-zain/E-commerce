'use client'

import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Blog() {
  return (
    <div className="w-full py-20 px-10 mt-20 flex justify-between items-center">
        <div className="w-1/2 p-5">
            <h3 className="text-xl font-light tracking-wide">THE ZARB STANDARD</h3>
            <h2 className="text-5xl font-bold mt-2 tracking-wider uppercase">Premium Fragrance Without Compromise</h2>
            <p className="text-base font-light mt-2 w-4/5 text-justify tracking-widest">At Zarb, we don't design scents to simply blend into the background. Every bottle is formulated with concentrated perfume oils and rich, grounding notes engineered to project confidence from morning boardroom to late evening. It is subtle up close, commanding from a distance, and unforgettable once you leave.</p>
            <ul className="w-1/5 flex justify-between items-center mt-5">
                <li><Link href={'/'}><InstagramLogoIcon size={42} /></Link></li>
                <li><Link href={'/'}><TiktokLogoIcon size={42} /></Link></li>
                <li><Link href={'/'}><FacebookLogoIcon size={42} /></Link></li>
            </ul>
        </div>
        <div className="w-1/2">
            <div className="w-full h-180 flex items-center justify-center">
                <img src="/images/aboutscent.png" className="w-full h-11/12 object-cover object-top rounded-2xl" alt="blog icon" />
            </div>
        </div>
    </div>
  )
}
