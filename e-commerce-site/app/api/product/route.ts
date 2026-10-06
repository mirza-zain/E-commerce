import { products } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { headers } from "next/headers";


export async function POST (request: Request) {
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
    const body = await request.json()
    const newProd = await db
    .insert(products)
    .values({
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        image: body.image
    })
    .returning()

    return Response.json(newProd)
}

export async function GET() {
    const allProducts = await db.select().from(products)
    return Response.json(allProducts)
}