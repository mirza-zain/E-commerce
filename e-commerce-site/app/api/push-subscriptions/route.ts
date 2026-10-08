import { db } from "@/app/lib/db"
import { pushSubscriptions } from "@/app/db/schema"
import { and, eq } from "drizzle-orm"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"

async function getAdmin() {
    const session = await auth.api.getSession({ headers: await headers() })
    return session?.user.role === "admin" ? session.user : null
}

export async function GET() {
    const admin = await getAdmin()
    if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 })

    return Response.json({
        enabled: Boolean(process.env.VAPID_PUBLIC_KEY),
        publicKey: process.env.VAPID_PUBLIC_KEY ?? null,
    })
}

export async function POST(request: Request) {
    const admin = await getAdmin()
    if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const endpoint = typeof body.endpoint === "string" ? body.endpoint : ""
    const p256dh = typeof body.keys?.p256dh === "string" ? body.keys.p256dh : ""
    const authKey = typeof body.keys?.auth === "string" ? body.keys.auth : ""

    if (!endpoint || !p256dh || !authKey) {
        return Response.json({ error: "Invalid push subscription" }, { status: 400 })
    }

    await db.insert(pushSubscriptions).values({
        userId: admin.id,
        endpoint,
        p256dh,
        auth: authKey,
    }).onConflictDoUpdate({
        target: pushSubscriptions.endpoint,
        set: {
            userId: admin.id,
            p256dh,
            auth: authKey,
        },
    })

    return Response.json({ ok: true })
}

export async function DELETE(request: Request) {
    const admin = await getAdmin()
    if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 })

    const body = await request.json()
    const endpoint = typeof body.endpoint === "string" ? body.endpoint : ""
    if (!endpoint) return Response.json({ error: "Endpoint is required" }, { status: 400 })

    await db.delete(pushSubscriptions).where(and(
        eq(pushSubscriptions.endpoint, endpoint),
        eq(pushSubscriptions.userId, admin.id),
    ))

    return Response.json({ ok: true })
}
