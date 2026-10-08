import {db} from "@/app/lib/db"
import {orders, products, orderItems} from "@/app/db/schema"
import { eq, sql } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";


type Props = {
    params: Promise<{
        id: string
    }>
}

export async function GET(request: Request, {params}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return Response.json(
        {error: "Unauthorized"},
        {status: 401}
    )

    if(session.user.role !== "admin") return Response.json(
        {error: "Forbidden"},
        {status: 403}
    )
    
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

export async function PUT(request: Request, {params}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return Response.json(
        {error: "Unauthorized"},
        {status: 401}
    )

    if(session.user.role !== "admin") return Response.json(
        {error: "Forbidden"},
        {status: 403}
    )
    const {id} = await params
    const orderId = Number(id)

    if(Number.isNaN(orderId)) throw new Error("Error Getting Order ID")

    const body = await request.json()

    const allowdStatus = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
    ]

    if(!allowdStatus.includes(body.status)) {
        return Response.json(
            {
                error: "Invalid order status"
            },
            {
                status: 400
            }
        )
    }

    const changeStatus = await db 
        .update(orders)
        .set({
            status: body.status
        })
        .where(eq(orders.id, orderId))
        .returning()

    if(changeStatus.length === 0) {
        return Response.json(
            {
                error: "Order not found"
            },
            {
                status: 404
            }
        )
    }

    return Response.json(changeStatus[0])
}

export async function DELETE(request: Request, {params}: Props) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) return Response.json(
        {error: "Unauthorized"},
        {status: 401}
    )

    if(session.user.role !== "admin") return Response.json(
        {error: "Forbidden"},
        {status: 403}
    )

    const orderId = Number((await params).id)
    if(!Number.isInteger(orderId) || orderId <= 0) {
        return Response.json(
            {error: "Invalid order ID"},
            {status: 400}
        )
    }

    const deletedOrder = await db.transaction(async (tx) => {
        const items = await tx
            .select({ productId: orderItems.productId, quantity: orderItems.quantity })
            .from(orderItems)
            .where(eq(orderItems.orderId, orderId))

        for (const item of items) {
            await tx
                .update(products)
                .set({ stock: sql`${products.stock} + ${item.quantity}` })
                .where(eq(products.id, item.productId))
        }

        await tx.delete(orderItems).where(eq(orderItems.orderId, orderId))

        const result = await tx
            .delete(orders)
            .where(eq(orders.id, orderId))
            .returning({ id: orders.id })

        return result[0]
    })

    if(!deletedOrder) {
        return Response.json(
            {error: "Order not found"},
            {status: 404}
        )
    }

    return Response.json({ok: true, id: deletedOrder.id})
}