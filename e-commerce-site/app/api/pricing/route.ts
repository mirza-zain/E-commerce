import { db } from "@/app/lib/db"
import { calculateDiscount } from "@/app/lib/pricing"
import { deliveryCharges, discountCodes, products } from "@/app/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        if (!body || typeof body !== "object") {
            return Response.json({ error: "Invalid pricing data" }, { status: 400 })
        }
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return Response.json({ error: "Cart is empty" }, { status: 400 })
        }

        const verifiedIds = new Set<number>()
        let subtotal = 0
        for (const item of body.items) {
            if (!item || typeof item !== "object" || !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity <= 0 || verifiedIds.has(item.id)) {
                return Response.json({ error: "Invalid cart" }, { status: 400 })
            }
            verifiedIds.add(item.id)
            const result = await db.select().from(products).where(eq(products.id, item.id))
            const product = result[0]
            if (!product || Number(product.stock) < item.quantity) {
                return Response.json({ error: "A product is unavailable" }, { status: 400 })
            }
            subtotal += Number(product.price) * item.quantity
        }

        const code = typeof body.discountCode === "string" ? body.discountCode.trim().toUpperCase() : ""
        const discountResult = code
            ? await db.select().from(discountCodes).where(eq(discountCodes.code, code))
            : []
        const discountAmount = calculateDiscount(subtotal, discountResult[0] ?? null)
        const city = typeof body.city === "string" ? body.city.trim().toLowerCase() : ""
        const cityResult = city ? await db.select().from(deliveryCharges).where(eq(deliveryCharges.city, city)) : []
        const defaultResult = await db.select().from(deliveryCharges).where(eq(deliveryCharges.city, "default"))
        const deliveryAmount = Number(cityResult[0]?.active
            ? cityResult[0].amount
            : defaultResult[0]?.active
                ? defaultResult[0].amount
                : "0")

        return Response.json({
            subtotal: subtotal.toFixed(2),
            discountAmount: discountAmount.toFixed(2),
            deliveryAmount: deliveryAmount.toFixed(2),
            totalAmount: (subtotal - discountAmount + deliveryAmount).toFixed(2),
            discountCode: discountAmount > 0 ? code : null
        })
    } catch (error) {
        console.error("Pricing error", error)
        return Response.json({ error: "Unable to calculate pricing" }, { status: 500 })
    }
}
