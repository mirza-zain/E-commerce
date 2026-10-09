import { products } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

type Props = {
    params: Promise<{
        id: string
    }>
}

function validateProduct(body: Record<string, unknown>) {
    if (!body || typeof body !== "object") return "Invalid product data"
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const description = typeof body.description === "string" ? body.description.trim() : ""
    const category = typeof body.category === "string" ? body.category : ""
    const price = Number(body.price)
    const stock = Number(body.stock)
    const image = body.image
    const variants = body.variants

    if (!name || name.length > 150) return "Product name is required and must be 150 characters or fewer"
    if (!description || description.length > 2000) return "Product description is required and must be 2000 characters or fewer"
    if (!["mens", "women", "unisex"].includes(category)) return "Invalid product category"
    if (!Number.isFinite(price) || price <= 0) return "Price must be greater than 0"
    if (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0) return "Stock must be a non-negative whole number"
    if (image !== null && image !== "" && typeof image !== "string") return "Invalid product image"
    if (variants !== undefined) {
        if (!Array.isArray(variants) || variants.length > 20) return "Invalid product variations"
        const labels = new Set<string>()
        for (const variant of variants) {
            if (!variant || typeof variant !== "object") return "Invalid product variation"
            const candidate = variant as Record<string, unknown>
            const label = typeof candidate.label === "string" ? candidate.label.trim() : ""
            const variantPrice = Number(candidate.price)
            const variantStock = Number(candidate.stock)
            if (!label || label.length > 30 || !Number.isFinite(variantPrice) || variantPrice <= 0 ||
                !Number.isFinite(variantStock) || !Number.isInteger(variantStock) || variantStock < 0) {
                return "Each variation needs a valid label, price, and stock"
            }
            if (labels.has(label.toLowerCase())) return "Variation labels must be unique"
            labels.add(label.toLowerCase())
        }
    }

    return null
}

function normalizeVariants(value: unknown) {
    if (!Array.isArray(value)) return []
    return value.map((variant) => {
        const item = variant as { label: string, price: number, stock: number }
        return { label: item.label.trim(), price: Number(item.price), stock: Number(item.stock) }
    })
}


export async function GET(_request: Request, {params}: Props) {
    const {id} = await params
    const prodId = Number(id)
    if(!Number.isInteger(prodId) || prodId <= 0) {
        return Response.json (
            {
                error: "Product ID is requried"
            },
            {
                status: 400
            }
        )
    }
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
    const {id} = await params
    const prodId = Number(id)
    const body = await request.json()
    const validationError = validateProduct(body)
    if (validationError) {
        return Response.json({ error: validationError }, { status: 400 })
    }
    if(!Number.isInteger(prodId) || prodId <= 0) {
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
        image: body.image,
        variants: normalizeVariants(body.variants)
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
    const {id} = await params
    const prodId = Number(id)

    if(!Number.isInteger(prodId) || prodId <= 0) {
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