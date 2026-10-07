import {db} from "@/app/lib/db"
import {orders, products} from "@/app/db/schema"
import {count, lte, ne, sql, sum} from "drizzle-orm"

export default async function page() {
   const orderStats = await db
        .select({
            totalOrders: count(),
            pendingOrders: sql<number>`
                SUM(
                    CASE
                        WHEN ${orders.status} = 'pending'
                        THEN 1
                        ELSE 0
                    END
                )
            `,
            totalRevenue: sum(orders.totalAmount)
            })
        .from(orders)
            .where(ne(orders.status, "cancelled"))
    
    const lowStockProducts = await db
            .select({
                id: products.id,
                name: products.name,
                stock: products.stock
            })
            .from(products)
            .where(lte(products.stock, "5"))

  return (
        <main className="min-h-screen bg-white px-6 py-8 text-neutral-950 sm:px-10 lg:px-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-2 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                            Store overview
                        </p>
                        <h1 className="font-[Gebuk] text-4xl tracking-tight sm:text-5xl">Dashboard</h1>
                    </div>
                    <p className="text-sm text-neutral-500">A quick look at your store activity</p>
                </div>

                <section className="grid gap-4 py-8 md:grid-cols-3" aria-label="Order summary">
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <p className="text-sm font-medium text-neutral-500">Total orders</p>
                        <p className="mt-4 text-4xl font-semibold tracking-tight">{orderStats[0].totalOrders}</p>
                        <p className="mt-2 text-xs text-neutral-400">All orders received</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <p className="text-sm font-medium text-neutral-500">Pending orders</p>
                        <p className="mt-4 text-4xl font-semibold tracking-tight">{orderStats[0].pendingOrders}</p>
                        <p className="mt-2 text-xs text-neutral-400">Awaiting fulfillment</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                        <p className="text-sm font-medium text-neutral-500">Total revenue</p>
                        <p className="mt-4 text-4xl font-semibold tracking-tight">RS. {orderStats[0].totalRevenue ?? "0"}</p>
                        <p className="mt-2 text-xs text-neutral-400">Revenue from all orders</p>
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-4 py-5 sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Low stock products</h2>
                            <p className="mt-1 text-sm text-neutral-500">Products with five or fewer items remaining</p>
                        </div>
                        <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                            {lowStockProducts.length} items
                        </span>
                    </div>

                    {lowStockProducts.length > 0 ? (
                        <div className="overflow-x-auto">
                              <table className="w-full min-w-lg text-left text-sm">
                                <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-400">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Product</th>
                                        <th className="px-6 py-3 font-semibold">Stock remaining</th>
                                        <th className="px-6 py-3 text-right font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {lowStockProducts.map((product) => (
                                        <tr key={product.id} className="transition-colors hover:bg-neutral-50">
                                            <td className="px-6 py-4 font-medium">{product.name}</td>
                                            <td className="px-6 py-4 text-neutral-600">{product.stock}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                                    Restock soon
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="px-6 py-10 text-center text-sm text-neutral-500">No low stock products right now.</p>
                    )}
                </section>
            </div>
        </main>
  )
}
