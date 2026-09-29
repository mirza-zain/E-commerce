import { products } from "@/app/db/schema";
import { db } from "@/app/lib/db";


export async function POST (request: Request) {
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