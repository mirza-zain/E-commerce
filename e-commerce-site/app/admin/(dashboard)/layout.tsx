import { Metadata } from "next/dist/types";
import React from "react";
import Navbar from "./(component)/Navbar";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: "",
    description: ""
}

export default async function AdminLayout({children} : {children: React.ReactNode}) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session) {
        redirect("/admin/login")
    }

    if(session.user.role !== "admin") {
        redirect('/')
    }
    return (
        <div className="flex min-h-screen flex-col md:flex-row">  
            <Navbar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}