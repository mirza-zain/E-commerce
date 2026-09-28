import { Metadata } from "next/dist/types";
import React from "react";
import Navbar from "./(component)/Navbar";


export const metadata: Metadata = {
    title: "",
    description: ""
}

export default function AdminLayout({children} : {children: React.ReactNode}) {
    return (
        <div className="flex min-h-screen">  
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}