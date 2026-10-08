import type { Metadata } from "next";
import React from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./(component)/Navbar";
import Footer from "./(component)/Footer";

export const metadata: Metadata = {
    title: "Shop Premium Fragrances",
    description: "Shop premium fragrances from Zarb Official and discover your next signature scent.",
}

export default function StoreLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="min-h-full flex flex-col font-[batica] bg-[#FAf8F5]">
            <CartProvider>
                <Navbar />
                {children}
                <Footer />
            </CartProvider>
        </div>
    )
}