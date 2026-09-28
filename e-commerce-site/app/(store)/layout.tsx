import { Metadata } from "next/dist/types";
import React from "react";
import { CartProvider } from "./context/CartContext";
import Navbar from "./(component)/Navbar";
import Footer from "./(component)/Footer";

export const metadata : Metadata = {
    title: "",
    description: ""
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