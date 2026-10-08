import { db } from "@/app/lib/db"
import { orders } from "@/app/db/schema"
import { eq } from "drizzle-orm";

type Props = {
    params: Promise<{
        trackingId: string
    }>
}

export async function GET(request: Request, {params}: Props) {
    const {trackingId} = await params
    if (!/^ZRB-[A-F0-9]{8}$/.test(trackingId)) {
        return Response.json({ error: "Invalid tracking ID" }, { status: 400 })
    }

    const result = await db 
        .select({
            trackingId: orders.trackingId,
            status: orders.status,
            createdAt: orders.createdAt,
            totalAmount: orders.totalAmount
        })
        .from(orders)
        .where(eq(orders.trackingId, trackingId))

    if(result.length === 0) {
        return Response.json(
            {
                error: "Order not found"
            },
            {
                status: 404
            }
        )
    }

    return Response.json(result[0])
}