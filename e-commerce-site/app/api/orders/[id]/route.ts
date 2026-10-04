import {db} from "@/app/lib/db"
import {orders, products, orderItems} from "@/app/db/schema"
import { eq } from "drizzle-orm";


type Props = {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: Request, {params}: Props) {
    const {id} = await params
    const orderID = Number(id)
    
    if(Number.isNaN(orderID)) {
        return Response.json(
            {
                error: "Order Id not found"
            },
            {
                status: 400
            }
        )
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
    .where(eq(orders.id, orderID))

    if(getOrder.length === 0) {
        return Response.json(
            {
                error: "Order not found"
            },
            {
                status: 404
            }
        )
    }
    
    const firstRow = getOrder[0]

    const formattedOrder = {
        ...firstRow.orders,
        items: getOrder
            .filter((row) => row.order_items && row.products)
            .map(row => ({
                productId: row.products!.id,
                productName: row.products!.name,
                quantity: row.order_items!.quantity,
                price: row.order_items!.price
            }))
    }

    return Response.json(formattedOrder)
}