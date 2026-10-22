import { db } from "@/app/lib/db";
import { featuredProducts, products } from "@/app/db/schema";
import { asc, eq, inArray } from "drizzle-orm";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function GET() {
    try {
        const rows = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                category: products.category,
                price: products.price,
                stock: products.stock,
                image: products.image,
                variants: products.variants,
                position: featuredProducts.position
            })
            .from(featuredProducts)
            .innerJoin(products, eq(featuredProducts.productId, products.id))
            .orderBy(asc(featuredProducts.position));

        // If no featured products configured yet, fallback to top 4 products
        if (rows.length === 0) {
            const fallback = await db
                .select({
                    id: products.id,
                    name: products.name,
                    description: products.description,
                    category: products.category,
                    price: products.price,
                    stock: products.stock,
                    image: products.image,
                    variants: products.variants,
                    position: products.id
                })
                .from(products)
                .orderBy(asc(products.id))
                .limit(4);

            return Response.json({
                featuredProducts: fallback.map((p, idx) => ({ ...p, position: idx + 1 }))
            }, {
                headers: {
                    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120"
                }
            });
        }

        return Response.json({
            featuredProducts: rows
        }, {
            headers: {
                "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120"
            }
        });

    } catch (error) {
        console.error("GET /api/featured-products error:", error);
        return Response.json(
            { error: "Failed to load featured products" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const body = await request.json();
        const { productIds } = body as { productIds?: unknown };

        if (!Array.isArray(productIds)) {
            return Response.json({ error: "productIds must be an array" }, { status: 400 });
        }

        if (productIds.length > 4) {
            return Response.json({ error: "Maximum of 4 featured products allowed" }, { status: 400 });
        }

        // Clean and validate IDs
        const cleanedIds: number[] = [];
        for (const rawId of productIds) {
            const id = Number(rawId);
            if (!id || isNaN(id) || id <= 0) {
                return Response.json({ error: `Invalid product ID: ${rawId}` }, { status: 400 });
            }
            if (!cleanedIds.includes(id)) {
                cleanedIds.push(id);
            }
        }

        // Verify products exist in DB
        if (cleanedIds.length > 0) {
            const existingProds = await db
                .select({ id: products.id })
                .from(products)
                .where(inArray(products.id, cleanedIds));

            if (existingProds.length !== cleanedIds.length) {
                return Response.json({ error: "One or more selected products do not exist" }, { status: 400 });
            }
        }

        // Atomic transaction to replace featured items
        await db.transaction(async (tx) => {
            await tx.delete(featuredProducts);

            for (let i = 0; i < cleanedIds.length; i++) {
                await tx.insert(featuredProducts).values({
                    productId: cleanedIds[i],
                    position: i + 1
                });
            }
        });

        // Fetch updated list to return
        const updatedRows = await db
            .select({
                id: products.id,
                name: products.name,
                description: products.description,
                category: products.category,
                price: products.price,
                stock: products.stock,
                image: products.image,
                variants: products.variants,
                position: featuredProducts.position
            })
            .from(featuredProducts)
            .innerJoin(products, eq(featuredProducts.productId, products.id))
            .orderBy(asc(featuredProducts.position));

        return Response.json({
            success: true,
            featuredProducts: updatedRows
        });

    } catch (error) {
        console.error("PUT /api/featured-products error:", error);
        return Response.json(
            { error: (error as Error).message || "Failed to update featured products" },
            { status: 500 }
        );
    }
}
