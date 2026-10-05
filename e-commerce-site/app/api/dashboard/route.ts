import {db} from "@/app/lib/db"
import {orders, products} from "@/app/db/schema"
import {count, lte, sql, sum} from "drizzle-orm"

export async function GET() {
    
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
    
    const lowStockProducts = await db
            .select({
                id: products.id,
                name: products.name,
                stock: products.stock
            })
            .from(products)
            .where(lte(products.stock, "5"))

    return Response.json({
        orderStats: orderStats[0],
        lowStockProducts
    })
}