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
                image: products.image
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