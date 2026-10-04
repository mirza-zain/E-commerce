import { notFound } from "next/navigation";
import { Order } from "@/app/types/order";

type Props = {
    params: Promise<{
        id: string
    }>
}

const statusClasses: Record<string, string> = {
    Pending: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
    Processing: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30",
    Shipped: "bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-500/30",
    Delivered: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
    Cancelled: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
};

export default async function OrderDetails({ params }: Props) {
    let data: Order | null = null

    try {
        const { id } = await params
        const orderId = Number(id)

        if (Number.isNaN(orderId)) notFound()

        const response = await fetch(`http://localhost:3000/api/orders/${orderId}`)

        if (!response.ok) throw new Error("Error Finding Order")

        data = await response.json()
    } catch {
        notFound()
    }

    if (!data) notFound()

    return (
        <div className="min-h-screen px-4 py-10 ">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 md:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300">Order</p>
                            <h1 className="mt-2 text-3xl font-bold text-white">#{data.id}</h1>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${statusClasses[data.status] ?? "bg-slate-700 text-slate-200"}`}>
                            {data.status}
                        </span>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-sm text-slate-400">Customer</p>
                            <p className="mt-2 text-lg font-semibold text-white">{data.firstName} {data.lastName}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-sm text-slate-400">Total</p>
                            <p className="mt-2 text-lg font-semibold text-emerald-300">Rs. {data.totalAmount}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-sm text-slate-400">Date</p>
                            <p className="mt-2 text-lg font-semibold text-white">{new Date(data.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
                        <h2 className="text-xl font-semibold text-white">Items</h2>
                        <div className="mt-5 space-y-4">
                            {data.items.map((items) => (
                                <div key={items.productId} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                                    <div>
                                        <p className="font-medium text-white">{items.productName}</p>
                                        <p className="mt-1 text-sm text-slate-400">Quantity: {items.quantity}</p>
                                    </div>
                                    <p className="text-base font-semibold text-cyan-300">Rs. {items.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/30">
                        <h2 className="text-xl font-semibold text-white">Customer Information</h2>
                        <div className="mt-5 space-y-4 text-sm text-slate-300">
                            <div>
                                <p className="text-slate-400">Email</p>
                                <p className="mt-1 text-white">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Phone</p>
                                <p className="mt-1 text-white">{data.phoneNum}</p>
                            </div>
                            <div>
                                <p className="text-slate-400">Address</p>
                                <p className="mt-1 text-white">{data.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
