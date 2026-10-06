'use client'

import React, { useState } from "react";


export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("")
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setLoading(true)
    setError("")
    setOrder(null)

    try {
        const response = await fetch(`/api/track/${trackingId.trim()}`)

        const data = await response.json()

        if(!response.ok) throw new Error(data.error || "Order not found")

        setOrder(data)

    } catch (error) {
        setError((error as Error).message)
    } finally {
        setLoading(false)
    }
}
    return (
    <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
            <h1 className="text-3xl font-bold text-center">Track Your Order</h1>
            <p className="text-center mt-3">Enter your tracking ID to check your order status.</p>

            <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
                <input type="text" value={trackingId} onChange={(event) => setTrackingId(event.target.value)} 
                    placeholder="ZRB-DiDD3499" 
                    className="flex-1 border border-neutral-300 rounded-lg px-4 py-3 focus:outline-none focus:border-black"
                    required
                />
                <button type="submit" disabled={loading} className="px-5 py-3 bg-black text-white rounded-lg disabled:opacity-50">
                    {loading ? "Searching..." : "Track"}
                </button>
            </form>
            {
                error && (
                    <p className="mt-6 text-red-600 text-center">{error}</p>
                )
            }
            {
                order && (
                    <div className="mt-8 border border-neutral-200 rounded-xl p-6">
                        <h2 className="text-xl font-semi-bold">Order Found</h2>
                        <div className="mt-4 space-y-3">
                            <p>
                                <span className="font-medium">
                                    Tracking ID:
                                </span>{" "}
                                {order.trackingId}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Status:
                                </span>{" "}
                                {order.status}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Total:
                                </span>{" "}
                                Rs. {order.totalAmount}
                            </p>
                            <p>
                                <span className="font-medium">
                                    Ordered:
                                </span>{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                )
            }
        </div>
    </main>
  )
}
