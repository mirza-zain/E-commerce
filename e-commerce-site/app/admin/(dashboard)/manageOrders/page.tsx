'use client'

import { Order } from "@/app/types/order";
import { TrashIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusClasses: Record<string, string> = {
  Pending: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  Processing: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30",
  Shipped: "bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-500/30",
  Delivered: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  Cancelled: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
};

export default function ManageOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const handleDelete = async (orderId: number) => {
    if (!window.confirm("Delete this order? Its product stock will be restored.")) return

    setDeletingId(orderId)
    setActionError("")
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      const data: { error?: string } = await response.json()
      if (!response.ok) throw new Error(data.error ?? "Unable to delete order")

      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== orderId))
    } catch (error) {
      setActionError((error as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")

        if (!response.ok) throw new Error("Error Fetching Orders")

        const data: Order[] = await response.json()

        setOrders(data)
        setLoading(false)
      } catch (error) {
        setError((error as Error).message)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (loading) return (
    <div className="min-h-screen px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl rounded-2xl border p-8 shadow-2xl shadow-slate-950/40">
        <div className="animate-pulse space-y-4">
          <div className="h-7 w-48 rounded bg-slate-700" />
          <div className="h-12 rounded bg-slate-800" />
          <div className="h-64 rounded bg-slate-800" />
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center shadow-lg shadow-rose-950/30">
        <p className="text-lg font-semibold text-rose-200">Something went wrong</p>
        <p className="mt-2 text-sm text-rose-100/80">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em]">Orders</p>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">Manage Orders</h1>
          </div>
          <div className="w-fit rounded-full border border-cyan-500/30 bg-cyan-500 px-4 py-2 text-sm">
            {orders.length} total orders
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-white">Pending</p>
            <p className="mt-2 text-2xl font-bold text-amber-300">
              {orders.filter((order) => order.status === "pending").length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-white">Processing</p>
            <p className="mt-2 text-2xl font-bold text-cyan-500">
              {orders.filter((order) => order.status === "processing").length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30">
            <p className="text-sm text-white">Delivered</p>
            <p className="mt-2 text-2xl font-bold text-red-500">
              {orders.filter((order) => order.status === "delivered").length}
            </p>
          </div>
        </div>

        {actionError && <p className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{actionError}</p>}

        <div className="overflow-hidden rounded-2xl border shadow-2xl shadow-slate-950/40">
          <div className="overflow-x-auto">
            <table className="w-full min-w-3xl divide-y divide-slate-800 text-left">
              <thead className="bg-slate-900/90">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Orders</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-medium text-cyan-700">#{order.id}</td>
                    <td className="px-6 py-4">{order.firstName} {order.lastName}</td>
                    <td className="px-6 py-4 font-medium">Rs. {order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[order.status] ?? "bg-slate-700 text-slate-200"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/manageOrders/${order.id}`}
                          className="inline-flex items-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-800 transition hover:border-cyan-400 hover:bg-cyan-500/20"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(order.id)}
                          disabled={deletingId === order.id}
                          aria-label={`Delete order ${order.id}`}
                          className="inline-flex items-center rounded-lg border border-rose-500/40 bg-rose-500/10 p-2 text-rose-700 transition hover:border-rose-500 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}