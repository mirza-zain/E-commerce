'use client'

import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        const {data, error} = await authClient.signIn.email({
            email,
            password
        })

        if(error) return setError(error.message || "Login Failed")

        router.push("/admin")
    }

    return (
        <main className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit}
                className="w-full max-w-md space-y-5 p-8 border rounded-xl"
            >
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <input type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />
                <input type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-3 rounded"
                    required
                />

                { error && (
                    <p className="text-red-500">{error}</p>
                )}

                <button type="submit" className="w-full bg-black text-white p-3 rounded">Login</button>
            </form>
        </main>
    )
}