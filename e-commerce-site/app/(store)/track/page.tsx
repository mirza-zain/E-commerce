'use client'

import React, { useState } from "react";

type TrackedOrder = {
    trackingId: string
    status: string
    totalAmount: string
    createdAt: string
}

export default function TrackOrder() {
  const [trackingId, setTrackingId] = useState("")
    const [order, setOrder] = useState<TrackedOrder | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
    const [trackingCopied, setTrackingCopied] = useState(false)

    const copyTrackingId = async (value: string) => {
        await navigator.clipboard.writeText(value)
        setTrackingCopied(true)
        window.setTimeout(() => setTrackingCopied(false), 2000)
    }

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
                                <span className="inline-flex flex-wrap items-center gap-2">
                                    <span>{order.trackingId}</span>
                                    <button
                                        type="button"
                                        onClick={() => void copyTrackingId(order.trackingId)}
                                        className="rounded-md border border-neutral-300 px-2 py-1 text-xs font-medium text-neutral-700 transition hover:border-black hover:text-black"
                                    >
                                        {trackingCopied ? "Copied" : "Copy"}
                                    </button>
                                </span>
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
