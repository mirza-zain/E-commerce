import { db } from "@/app/lib/db";
import { orders, orderItems } from "@/app/db/schema";

export async function POST(request: Request) {
    const body = await request.json()

    const newOrder = await db
    .insert(orders)
    .values({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNum: body.phoneNum,
        address: body.address,
        city: body.city,
        totalAmount: body.totalAmount,
        status: "pending"
    })
    .returning()

    const orderId = newOrder[0].id

    await db.insert(orderItems)
    .values(
        body.items.map((item: any) => ({
            orderId: orderId,
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        }))
    )

    return Response.json(newOrder)
}