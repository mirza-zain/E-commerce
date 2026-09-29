import { products } from "@/app/db/schema";
import { db } from "@/app/lib/db";
import { eq } from "drizzle-orm";

type Props = {
    params: Promise<{
        id: string
    }>
}


export async function GET(_request: Request, {params}: Props) {
    const {id} = await params
    if(Number.isNaN(id)) {
        return Response.json (
            {
                error: "Product ID is requried"
            },
            {
                status: 400
            }
        )
    }
    const prodId = Number(id)
    const result = await db.select().from(products).where(eq(products.id, prodId))
    if(result.length === 0) {
        return Response.json(
            {
                error: "Product Not Found"
            },
            {
                status: 404
            }
        )
    }

    return Response.json(result)
}

export async function PUT(request: Request, {params}: Props) {
    const {id} = await params
    const prodId = Number(id)
    const body = await request.json()
    if(Number.isNaN(prodId)) {
        return Response.json(
            {
                error: "ID is not defined"
            },
            {
                status: 400
            }
        )
    }
    const updateProduct = await db
    .update(products)
    .set({
        name: body.name,
        description: body.description,
        category: body.category,
        price: body.price,
        stock: body.stock,
        image: body.image
    })
    .where(eq(products.id, prodId))
    .returning()

    if(updateProduct.length === 0) {
        return Response.json(
            {
                error: "Product not updated"
            },
            {
                status: 404
            }
        )
    }
    return Response.json(updateProduct)
}

export async function DELETE (_request: Request, {params}: Props) {
    const {id} = await params
    const prodId = Number(id)

    if(Number.isNaN(prodId)) {
        return Response.json (
            {
                error: "ID is required"
            },
            {
                status: 400
            }
        )
    }
    const deleteProd = await db 
    .delete(products)
    .where(eq(products.id, prodId))
    .returning()

    if(deleteProd.length === 0) {
        return Response.json(
            {
                error: "Error Deleting"
            },
            {
                status: 404
            }
        )
    }

    return Response.json(deleteProd)
}