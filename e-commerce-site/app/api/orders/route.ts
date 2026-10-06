import { db } from "@/app/lib/db";
import { orders, orderItems, products } from "@/app/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import crypto from "node:crypto"
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!Array.isArray(body.items) || body.items.length === 0) {
            return Response.json(
                { error: "Cart is empty" },
                { status: 400 }
            )
        }
    
        const productIds = body.items.map((item: { id: number }) => item.id)
    
        const uniqueProductIds = new Set(productIds)
    
        if (uniqueProductIds.size !== productIds.length) {
            return Response.json(
                {error: "Duplicate products in order"},
                {status: 400}
            )
        }
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phoneNum",
            "address",
            "city"
        ] as const
    
        for (const field of requiredFields) {
            if (
                typeof body[field] !== "string" ||
                body[field].trim() === ""
            ) {
                return Response.json(
                    { error: `${field} is required` },
                    { status: 400 }
                )
            }
        }
    
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
            return Response.json(
                { error: "Invalid email address" },
                { status: 400 }
            )
        }
        
        const fieldMaxLengths = {
            firstName: 100,
            lastName: 100,
            email: 254,
            phoneNum: 30,
            address: 500,
            city: 100
        } as const
    
        for (const field of requiredFields) {
            if (body[field].length > fieldMaxLengths[field]) {
                return Response.json(
                    { error: `${field} is too long` },
                    { status: 400 }
                )
            }
        }

        const result = await db.transaction(async (tx) => {
    
            const verifiedItems = []
            let calculatedTotal = 0
    
            // Check stock for every product 
    
            for (const item of body.items) {
                if (
                    typeof item.id !== "number" ||
                    !Number.isInteger(item.id) ||
                    item.id <= 0
                ) {
                    throw new Error("Invalid product ID")
                }     
                if (
                    typeof item.quantity !== "number" ||
                    !Number.isInteger(item.quantity) ||
                    item.quantity <= 0
                ) {
                    throw new Error("Invalid quantity")
                }

                const prodResult = await tx
                .select()
                .from(products)
                .where(eq(products.id, item.id))
            
                if(prodResult.length === 0) throw new Error(`Product ${item.id} not found`)
                
                const product = prodResult[0]
        
                if(Number(product.stock) < item.quantity) throw new Error(`${product.name} does not have enough stock`)
        
                const price = Number(product.price)
    
                calculatedTotal += price * item.quantity
    
                verifiedItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                })
            }
    
            function generateTrackingId() {
                return `ZRB-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
            }

            const trackingId = generateTrackingId()

            // Create Order
            
            const newOrder = await tx
            .insert(orders)
            .values({
                trackingId,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phoneNum: body.phoneNum,
                address: body.address,
                city: body.city,
                totalAmount: calculatedTotal.toString(),
                status: "pending"
            })
            .returning()
        
            const orderId = newOrder[0].id
        
            // Create Order Items
        
            await tx.insert(orderItems)
            .values(
                verifiedItems.map((item) => ({
                    orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            )
        
            // Decrease Stock
            
            for(const item of verifiedItems) {
                const updated = await tx
                    .update(products)
                    .set({
                        stock: sql`${products.stock} - ${item.quantity}`,
                    })
                    .where(
                        and(
                            eq(products.id, item.productId),
                            gte(products.stock, item.quantity)
                        )
                    )
                    .returning({ id: products.id })
    
                if(updated.length === 0) throw new Error("Stock changed before the order could be completed")
            }
    
            return newOrder[0]
        })
    
        return Response.json(result)
    } catch(error) {
        console.error("Order transaction failed:", error)

        return Response.json(
            {
                error: "Unable to process order"
            },
            {
                status: 500
            }
        )
    }

}

export async function GET() {
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

    try {
        const result = await db
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

        const formattedOrders = result.reduce((acc, row) => {
            const currentOrder = row.orders
            const item = row.order_items
            const product = row.products

            let exisitingOrder = acc.find(
                (order : any) => order.id === currentOrder.id
            )

            if(!exisitingOrder) {
                exisitingOrder = {
                    ...currentOrder,
                    items: []
                }

                acc.push(exisitingOrder)
            }

            if(item && product) {
                exisitingOrder.items.push({
                    productId: product.id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: item.price
                })
            }

            return acc
        }, [] as any) 


        return Response.json(formattedOrders)
        
    } catch (error) {
        console.error("Get Orders Error: ", error)
        console.error("Error Message: ", (error as Error).message)
        console.error("Error Cause: ", (error as Error).message)

        return Response.json(
            {error: "Failed to fetch orders"},
            {status: 500}
        )
    }
}