import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { discountCodes } from "@/app/db/schema"
import { desc } from "drizzle-orm"
import { headers } from "next/headers"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user.role === "admin"
}

export async function GET() {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    return Response.json(await db.select().from(discountCodes).orderBy(desc(discountCodes.id)))
}

export async function POST(request: Request) {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    const body = await request.json()
    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : ""
    const type = body.type === "fixed" ? "fixed" : "percentage"
    const value = Number(body.value)
    const minAmount = Number(body.minAmount ?? 0)
    if (!code || !Number.isFinite(value) || value <= 0 || !Number.isFinite(minAmount) || minAmount < 0 || (type === "percentage" && value > 100)) {
        return Response.json({ error: "Invalid discount details" }, { status: 400 })
    }
    try {
        const result = await db.insert(discountCodes).values({
            code, type, value: value.toFixed(2), minAmount: minAmount.toFixed(2),
            maxUses: body.maxUses ? Number(body.maxUses) : null,
            expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            active: body.active !== false
        }).returning()
        return Response.json(result[0], { status: 201 })
    } catch {
        return Response.json({ error: "Discount code already exists or is invalid" }, { status: 400 })
    }
}
