import { db } from "@/app/lib/db";
import { sitePromo } from "@/app/db/schema";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const rows = await db.select().from(sitePromo).limit(1);
        const promo = rows[0];

        if (!promo || !promo.isActive) {
            return Response.json({ promo: null }, {
                headers: {
                    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
                },
            });
        }

        return Response.json(
            {
                promo: {
                    id: promo.id,
                    imageUrl: promo.imageUrl,
                    linkUrl: promo.linkUrl,
                    isActive: promo.isActive,
                    updatedAt: promo.updatedAt,
                },
            },
            {
                headers: {
                    "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
                },
            }
        );
    } catch (error) {
        console.error("GET /api/site-promo error:", error);
        return Response.json({ error: "Failed to load promo" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== "admin") {
            return Response.json({ error: "Forbidden: Admin access required" }, { status: 403 });
        }

        const body = await request.json();
        const imageUrl = typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
        const linkUrlRaw = typeof body.linkUrl === "string" ? body.linkUrl.trim() : "";
        const isActive = typeof body.isActive === "boolean" ? body.isActive : true;

        if (!imageUrl) {
            return Response.json({ error: "Image URL is required" }, { status: 400 });
        }

        const linkUrl = linkUrlRaw || null;
        const now = new Date();

        const existing = await db.select({ id: sitePromo.id }).from(sitePromo).limit(1);

        if (existing.length > 0) {
            await db
                .update(sitePromo)
                .set({
                    imageUrl,
                    linkUrl,
                    isActive,
                    updatedAt: now,
                })
                .where(eq(sitePromo.id, existing[0].id));
        } else {
            await db.insert(sitePromo).values({
                imageUrl,
                linkUrl,
                isActive,
                updatedAt: now,
            });
        }

        const rows = await db.select().from(sitePromo).limit(1);
        return Response.json({ success: true, promo: rows[0] ?? null });
    } catch (error) {
        console.error("PUT /api/site-promo error:", error);
        return Response.json(
            { error: (error as Error).message || "Failed to save promo" },
            { status: 500 }
        );
    }
}
