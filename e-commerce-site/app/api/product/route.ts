import { products } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/db";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { asc, count, eq } from "drizzle-orm";

const getCatalogPage = unstable_cache(
    async (page: number, pageSize: number, category: string) => {
        const categoryFilter = category !== "all" ? eq(products.category, category) : undefined
        const [catalogProducts, totalResult] = await Promise.all([
            db.select({
                id: products.id,
                name: products.name,
                category: products.category,
                price: products.price,
                stock: products.stock,
                image: products.image,
                variants: products.variants
            })
                .from(products)
                .where(categoryFilter)
                .orderBy(asc(products.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize),
            db.select({ total: count() })
                .from(products)
                .where(categoryFilter)
        ])

        return {
            products: catalogProducts,
            total: Number(totalResult[0]?.total ?? 0)
        }
    },
    ["catalog-products"],
    { revalidate: 60 }
)


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
    const validationError = validateProduct(body)
    if (validationError) {
        return Response.json({ error: validationError }, { status: 400 })
    }
    const normalizedVariants = normalizeVariants(body.variants)
    const hasVariants = normalizedVariants.length > 0
    const newProd = await db
    .insert(products)
    .values({
        name: body.name,
        description: body.description,
        category: body.category,
        price: hasVariants ? Math.min(...normalizedVariants.map((variant) => variant.price)) : body.price,
        stock: hasVariants ? normalizedVariants.reduce((total, variant) => total + variant.stock, 0) : body.stock,
        image: body.image,
        variants: normalizeVariants(body.variants)
    })
    .returning()

    return Response.json(newProd)
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
    const hasVariants = Array.isArray(variants) && variants.length > 0
    if (!hasVariants && (!Number.isFinite(price) || price <= 0)) return "Price must be greater than 0"
    if (!hasVariants && (!Number.isFinite(stock) || !Number.isInteger(stock) || stock < 0)) return "Stock must be a non-negative whole number"
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

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams
    const catalogView = searchParams.get("catalog") === "true"

    if (catalogView) {
        const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1)
        const pageSize = Math.min(24, Math.max(1, Number(searchParams.get("pageSize") ?? 8) || 8))
        const category = searchParams.get("category") ?? "all"
        const catalogPage = await getCatalogPage(page, pageSize, category)

        return Response.json({
            ...catalogPage,
            page,
            pageSize,
            totalPages: Math.ceil(catalogPage.total / pageSize)
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
            }
        })
    }

    const allProducts = await db.select().from(products)
    return Response.json(allProducts)
}