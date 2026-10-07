import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { deliveryCharges } from "@/app/db/schema"
import { desc } from "drizzle-orm"
import { headers } from "next/headers"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user.role === "admin"
}

export async function GET() {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    return Response.json(await db.select().from(deliveryCharges).orderBy(desc(deliveryCharges.id)))
}

export async function POST(request: Request) {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const city = typeof body.city === "string" ? body.city.trim().toLowerCase() : ""
    const amount = Number(body.amount)
    if (!city || !Number.isFinite(amount) || amount < 0) {
        return Response.json({ error: "Invalid delivery charge details" }, { status: 400 })
    }
    try {
        const result = await db.insert(deliveryCharges).values({
            city, amount: amount.toFixed(2), active: body.active !== false
        }).returning()
        return Response.json(result[0], { status: 201 })
    } catch {
        return Response.json({ error: "A charge for this city already exists" }, { status: 400 })
    }
}
