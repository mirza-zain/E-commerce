import { db } from "@/app/lib/db"
import { deliveryCharges } from "@/app/db/schema"
import { and, asc, eq, ne } from "drizzle-orm"

export async function GET() {
    const result = await db
        .select({ city: deliveryCharges.city })
        .from(deliveryCharges)
        .where(and(eq(deliveryCharges.active, true), ne(deliveryCharges.city, "default")))
        .orderBy(asc(deliveryCharges.city))

    return Response.json({ cities: result.map((delivery) => delivery.city) })
}
