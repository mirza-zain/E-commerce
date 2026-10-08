import { db } from "@/app/lib/db";
import { discountCodes, deliveryCharges, orders, orderItems, products } from "@/app/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import crypto from "node:crypto"
import { calculateDiscount } from "@/app/lib/pricing";
import { sendNewOrderNotification } from "@/app/lib/push";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json()

        if (!body || typeof body !== "object") {
            return Response.json({ error: "Invalid order data" }, { status: 400 })
        }

        if (!Array.isArray(body.items) || body.items.length === 0) {
            return Response.json(
                { error: "Cart is empty" },
                { status: 400 }
            )
        }
    
        const productIds = body.items.map((item: { id: number }) => item?.id)
    
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
            "phoneCountryCode",
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
    
        const namePattern = /^[A-Za-z][A-Za-z '-]{1,99}$/
        const addressPattern = /^[A-Za-z0-9][A-Za-z0-9 .,#/'-]{4,499}$/
        const cityPattern = /^[A-Za-z][A-Za-z '-]{1,99}$/

        if (!namePattern.test(body.firstName.trim()) || !namePattern.test(body.lastName.trim())) {
            return Response.json(
                { error: "Names must contain 2 to 100 letters and may include spaces, apostrophes, or hyphens" },
                { status: 400 }
            )
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
            return Response.json(
                { error: "Invalid email address" },
                { status: 400 }
            )
        }

        const allowedCountryCodes = ["+92", "+1", "+44", "+61", "+91", "+966", "+971"]
        if (!allowedCountryCodes.includes(body.phoneCountryCode)) {
            return Response.json(
                { error: "Invalid country code" },
                { status: 400 }
            )
        }

        if (!/^\d{7,11}$/.test(body.phoneNum)) {
            return Response.json(
                { error: "Phone number must contain 7 to 11 digits" },
                { status: 400 }
            )
        }

        if (!addressPattern.test(body.address.trim())) {
            return Response.json(
                { error: "Invalid address" },
                { status: 400 }
            )
        }

        if (!cityPattern.test(body.city.trim())) {
            return Response.json(
                { error: "City must contain 2 to 100 letters and may include spaces, apostrophes, or hyphens" },
                { status: 400 }
            )
        }
        
        const fieldMaxLengths = {
            firstName: 100,
            lastName: 100,
            email: 254,
            phoneCountryCode: 5,
            phoneNum: 11,
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
            let subTotal = 0
    
            // Check stock for every product 
    
            for (const item of body.items) {
                if (
                    !item ||
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
    
                subTotal += price * item.quantity
    
                verifiedItems.push({
                    productId: product.id,
                    quantity: item.quantity,
                    price: product.price
                })
            }
    
            function generateTrackingId() {
                return `ZRB-${crypto.randomBytes(4).toString("hex").toUpperCase()}`
            }

            const discountCode = typeof body.discountCode === "string"
                ? body.discountCode.trim().toUpperCase()
                : ""
            const discountResult = discountCode
                ? await tx.select().from(discountCodes).where(eq(discountCodes.code, discountCode))
                : []
            const discount = discountResult[0] ?? null
            const discountAmount = calculateDiscount(subTotal, discount)
            if (discountCode && discountAmount === 0) {
                throw new Error("Invalid or ineligible discount code")
            }

            const deliveryResult = await tx
                .select()
                .from(deliveryCharges)
                .where(eq(deliveryCharges.city, body.city.trim().toLowerCase()))
            const defaultDelivery = await tx
                .select()
                .from(deliveryCharges)
                .where(eq(deliveryCharges.city, "default"))
            const deliveryAmount = Number(deliveryResult[0]?.active
                ? deliveryResult[0].amount
                : defaultDelivery[0]?.active
                    ? defaultDelivery[0].amount
                    : "0")
            const totalAmount = subTotal - discountAmount + deliveryAmount
            const trackingId = generateTrackingId()

            // Create Order
            
            const newOrder = await tx
            .insert(orders)
            .values({
                trackingId,
                firstName: body.firstName.trim(),
                lastName: body.lastName.trim(),
                email: body.email.trim().toLowerCase(),
                phoneNum: `${body.phoneCountryCode}${body.phoneNum}`,
                address: body.address.trim(),
                city: body.city.trim(),
                totalAmount: totalAmount.toFixed(2),
                status: "pending",
                subTotal: subTotal.toFixed(2),
                discountAmount: discountAmount.toFixed(2),
                deliveryAmount: deliveryAmount.toFixed(2),
                discountCode: discountAmount > 0 ? discountCode : null
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

            if (discountAmount > 0 && discount) {
                await tx
                    .update(discountCodes)
                    .set({ usedCount: sql`${discountCodes.usedCount} + 1` })
                    .where(eq(discountCodes.id, discount.id))
            }
        
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

        try {
            await sendNewOrderNotification({
                id: result.id,
                firstName: result.firstName,
                lastName: result.lastName,
                totalAmount: result.totalAmount,
            })
        } catch (error) {
            console.error("Order notification failed:", error)
        }
    
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

        type FormattedOrder = (typeof result)[number]["orders"] & {
            items: Array<{
                productId: number
                productName: string
                quantity: number
                price: string
            }>
        }

        const formattedOrders = result.reduce<FormattedOrder[]>((acc, row) => {
            const currentOrder = row.orders
            const item = row.order_items
            const product = row.products

            let existingOrder = acc.find((order) => order.id === currentOrder.id)

            if(!existingOrder) {
                existingOrder = {
                    ...currentOrder,
                    items: []
                }

                acc.push(existingOrder)
            }

            if(item && product) {
                existingOrder.items.push({
                    productId: product.id,
                    productName: product.name,
                    quantity: item.quantity,
                    price: item.price
                })
            }

            return acc
        }, [])


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