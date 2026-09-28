'use client'

import { FacebookLogoIcon, InstagramLogoIcon, TiktokLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16 items-start">
          {/* Brand Info */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h2 className="font-semibold text-4xl sm:text-5xl font-[Gebuk] tracking-tight">Zarb Official</h2>
            <p className="text-neutral-400 mt-3 text-sm sm:text-base max-w-sm">
              Crafting premium, long-lasting fragrances engineered for elegance and confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold uppercase tracking-wider text-neutral-400 mb-4">Quick Links</h3>
            <ul className="flex flex-col space-y-2.5">
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition text-base font-light">Home</Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition text-base font-light">Featured</Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition text-base font-light">Products</Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition text-base font-light">About Us</Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition text-base font-light">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold uppercase tracking-wider text-neutral-400 mb-4">Contact</h3>
            <p className="text-base text-neutral-300 font-light">Karachi, Pakistan</p>
            <p className="text-sm text-neutral-400 mt-1 font-light">support@zarbofficial.com</p>

            <ul className="flex items-center gap-5 mt-6">
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition">
                  <InstagramLogoIcon className="size-7 sm:size-8" />
                </Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition">
                  <FacebookLogoIcon className="size-7 sm:size-8" />
                </Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition">
                  <WhatsappLogoIcon className="size-7 sm:size-8" />
                </Link>
              </li>
              <li>
                <Link href={'/'} className="text-neutral-300 hover:text-white transition">
                  <TiktokLogoIcon className="size-7 sm:size-8" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-xs sm:text-sm text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Zarb Official. All rights reserved.</p>
          <p className="font-light">Designed for elegance & quality.</p>
        </div>
      </div>
    </footer>
  );
}
