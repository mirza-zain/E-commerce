import { auth } from "@/app/lib/auth"
import { db } from "@/app/lib/db"
import { deliveryCharges } from "@/app/db/schema"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"

async function requireAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user.role === "admin"
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    const id = Number((await params).id)
    const body = await request.json()
    const result = await db.update(deliveryCharges).set({ active: Boolean(body.active) }).where(eq(deliveryCharges.id, id)).returning()
    return result[0] ? Response.json(result[0]) : Response.json({ error: "Delivery charge not found" }, { status: 404 })
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireAdmin()) return Response.json({ error: "Forbidden" }, { status: 403 })
    const id = Number((await params).id)
    const result = await db.delete(deliveryCharges).where(eq(deliveryCharges.id, id)).returning({ id: deliveryCharges.id })
    return result[0] ? Response.json({ ok: true }) : Response.json({ error: "Delivery charge not found" }, { status: 404 })
}
