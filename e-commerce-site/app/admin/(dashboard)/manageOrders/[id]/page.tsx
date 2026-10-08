import { notFound, redirect } from "next/navigation";
import { Order } from "@/app/types/order";
import StatusControl from "./StatusControl";
import { db } from "@/app/lib/db";
import { orders, orderItems, products } from "@/app/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import InvoicePrintButton from "./InvoicePrintButton";

type Props = {
    params: Promise<{
        id: string
    }>
}

const statusClasses: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
    processing: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200",
    shipped: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
    delivered: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
};

export default async function OrderDetails({ params }: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        redirect("/admin/login")
    }

    if (session.user.role !== "admin") {
        redirect("/")
    }

    const { id } = await params
    const orderId = Number(id)

    if (Number.isNaN(orderId)) {
        notFound()
    }

    const getOrder = await db
        .select()
        .from(orders)
        .leftJoin(
            orderItems,
            eq(orders.id, orderItems.orderId)
        )
        .leftJoin(
            products,
            eq(orderItems.productId, products.id)
        )
        .where(eq(orders.id, orderId))

    if (getOrder.length === 0) {
        notFound()
    }

    const firstRow = getOrder[0]

    const data: Order = {
        ...firstRow.orders,
        createdAt: firstRow.orders.createdAt.toISOString(),
        items: getOrder
            .filter((row) => row.order_items && row.products)
            .map((row) => ({
                productId: row.products!.id,
                productName: row.products!.name,
                quantity: row.order_items!.quantity,
                price: row.order_items!.price
            }))
    }
    return (
        <div className="min-h-screen bg-neutral-50 px-4 py-6 text-neutral-900 sm:py-10 print:bg-white">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8 print:hidden">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-500">Order</p>
                            <h1 className="mt-2 text-3xl font-bold text-neutral-900">#{data.id}</h1>
                        </div>
                        <span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${statusClasses[data.status] ?? "bg-neutral-100 text-neutral-700"}`}>
                            {data.status}
                        </span>
                        <StatusControl orderId={data.id} initialStatus={data.status} />
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <p className="text-sm text-neutral-500">Customer</p>
                            <p className="mt-2 text-lg font-semibold text-neutral-900">{data.firstName} {data.lastName}</p>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <p className="text-sm text-neutral-500">Total</p>
                            <p className="mt-2 text-lg font-semibold text-emerald-700">Rs. {data.totalAmount}</p>
                            <div className="mt-3 space-y-1 text-xs text-neutral-500">
                                <p>Subtotal: Rs. {data.subTotal}</p>
                                <p>Delivery: Rs. {data.deliveryAmount}</p>
                                <p>Discount: Rs. {data.discountAmount}{data.discountCode ? ` (${data.discountCode})` : ""}</p>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                            <p className="text-sm text-neutral-500">Date</p>
                            <p className="mt-2 text-lg font-semibold text-neutral-900">{new Date(data.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] print:hidden">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-neutral-900">Items</h2>
                        <div className="mt-5 space-y-4">
                            {data.items.map((items) => (
                                <div key={items.productId} className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                                    <div>
                                        <p className="font-medium text-neutral-900">{items.productName}</p>
                                        <p className="mt-1 text-sm text-neutral-500">Quantity: {items.quantity}</p>
                                    </div>
                                    <p className="text-base font-semibold text-neutral-900">Rs. {items.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-neutral-900">Customer Information</h2>
                        <div className="mt-5 space-y-4 text-sm text-neutral-700">
                            <div>
                                <p className="text-neutral-500">Email</p>
                                <p className="mt-1 text-neutral-900">{data.email}</p>
                            </div>
                            <div>
                                <p className="text-neutral-500">Phone</p>
                                <p className="mt-1 text-neutral-900">{data.phoneNum}</p>
                            </div>
                            <div>
                                <p className="text-neutral-500">Address</p>
                                <p className="mt-1 text-neutral-900">{data.address}</p>
                            </div>
                        </div>
                        <InvoicePrintButton order={data} />
                    </div>
                </div>
            </div>
        </div>
    )
}
