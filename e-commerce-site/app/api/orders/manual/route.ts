import { db } from "@/app/lib/db";
import { orders, orderItems, products } from "@/app/db/schema";
import { and, eq, gte, sql } from "drizzle-orm";
import crypto from "node:crypto";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

type ManualOrderItemInput = {
    productId: number;
    variantLabel?: string | null;
    quantity: number;
    price: number | string;
};

export async function POST(request: Request) {
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

        if (!body || typeof body !== "object") {
            return Response.json({ error: "Invalid sale data" }, { status: 400 });
        }

        const {
            channel = "instagram",
            customerName = "Walk-in Customer",
            phoneNum = "",
            city = "Karachi",
            address = "Direct / In-Person Sale",
            email = "",
            items = [],
            paymentMethod = "Cash",
            paymentStatus = "paid",
            orderStatus = "delivered",
            deliveryAmount = 0,
            discountAmount = 0,
            saleDate,
            deductStock = true,
            notes = ""
        } = body;

        if (!Array.isArray(items) || items.length === 0) {
            return Response.json({ error: "At least one product item is required" }, { status: 400 });
        }

        // Parse customer first and last name
        const trimmedName = String(customerName).trim() || "Customer";
        const nameParts = trimmedName.split(" ");
        const firstName = nameParts[0] || "Customer";
        const lastName = nameParts.slice(1).join(" ") || `(${channel.toUpperCase()})`;

        const cleanEmail = String(email).trim().toLowerCase() || `sale_${channel}_${Date.now()}@zarb.store`;
        const cleanPhone = String(phoneNum).trim() || "+923000000000";
        const cleanCity = String(city).trim() || "Karachi";
        const cleanAddress = String(address).trim() || `${channel.toUpperCase()} Sale`;

        const channelUpper = String(channel).toUpperCase();
        let trackingPrefix = "OFF";
        if (channel === "instagram") trackingPrefix = "IG";
        else if (channel === "reference") trackingPrefix = "REF";
        else if (channel === "whatsapp") trackingPrefix = "WA";
        else if (channel === "direct") trackingPrefix = "DIR";

        const trackingId = `${trackingPrefix}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

        const createdOrder = await db.transaction(async (tx) => {
            const verifiedItems: Array<{
                productId: number;
                variantLabel: string | null;
                quantity: number;
                price: string;
            }> = [];

            let subTotal = 0;

            for (const item of items as ManualOrderItemInput[]) {
                const prodId = Number(item.productId);
                const qty = Number(item.quantity);
                const itemPrice = Number(item.price);

                if (!prodId || isNaN(prodId) || prodId <= 0) {
                    throw new Error("Invalid product ID");
                }
                if (!qty || isNaN(qty) || qty <= 0) {
                    throw new Error("Quantity must be at least 1");
                }
                if (isNaN(itemPrice) || itemPrice < 0) {
                    throw new Error("Price must be a valid positive number");
                }

                // Verify product exists
                const [product] = await tx
                    .select()
                    .from(products)
                    .where(eq(products.id, prodId));

                if (!product) {
                    throw new Error(`Product #${prodId} not found`);
                }

                const variant = typeof item.variantLabel === "string" && item.variantLabel.trim()
                    ? product.variants?.find((candidate) => candidate.label === item.variantLabel)
                    : undefined;

                if (item.variantLabel && !variant) {
                    throw new Error(`Variation "${item.variantLabel}" not found on product`);
                }

                const priceFixed = itemPrice.toFixed(2);
                subTotal += itemPrice * qty;

                verifiedItems.push({
                    productId: product.id,
                    variantLabel: variant?.label ?? null,
                    quantity: qty,
                    price: priceFixed
                });

                // Deduct stock if requested
                if (deductStock) {
                    if (variant) {
                        const variantIndex = product.variants?.findIndex((c) => c.label === variant.label) ?? -1;
                        if (variantIndex >= 0) {
                            await tx.update(products).set({
                                variants: sql`jsonb_set(${products.variants}, ARRAY[${variantIndex}::text, 'stock'], to_jsonb(GREATEST(0, ((${products.variants}->${variantIndex}->>'stock')::int - ${qty}))), false)`
                            }).where(eq(products.id, product.id));
                        }
                    } else {
                        await tx.update(products).set({
                            stock: sql`GREATEST(0, ${products.stock} - ${qty})`
                        }).where(eq(products.id, product.id));
                    }
                }
            }

            const delivAmountNum = Math.max(0, Number(deliveryAmount) || 0);
            const discAmountNum = Math.max(0, Number(discountAmount) || 0);
            const totalAmount = Math.max(0, subTotal + delivAmountNum - discAmountNum);

            // Channel & method formatting: e.g. "Instagram (Bank Transfer)"
            const channelFormatted = channel.charAt(0).toUpperCase() + channel.slice(1);
            const formattedPaymentMethod = `${channelFormatted} - ${paymentMethod}`;
            const discountCodeRecord = notes ? `SRC:${channelUpper} - ${notes}` : `SRC:${channelUpper}`;

            // Parse createdAt if custom date was provided
            let orderCreatedAt = new Date();
            if (saleDate) {
                const parsedDate = new Date(saleDate);
                if (!isNaN(parsedDate.getTime())) {
                    orderCreatedAt = parsedDate;
                }
            }

            const [newOrder] = await tx.insert(orders).values({
                trackingId,
                firstName,
                lastName,
                email: cleanEmail,
                phoneNum: cleanPhone,
                address: cleanAddress,
                city: cleanCity,
                totalAmount: totalAmount.toFixed(2),
                subTotal: subTotal.toFixed(2),
                deliveryAmount: delivAmountNum.toFixed(2),
                discountAmount: discAmountNum.toFixed(2),
                discountCode: discountCodeRecord,
                status: orderStatus,
                paymentMethod: formattedPaymentMethod,
                paymentStatus,
                createdAt: orderCreatedAt
            }).returning();

            await tx.insert(orderItems).values(
                verifiedItems.map((item) => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    variantLabel: item.variantLabel,
                    quantity: item.quantity,
                    price: item.price
                }))
            );

            return newOrder;
        });

        return Response.json({
            success: true,
            order: createdOrder
        }, { status: 201 });

    } catch (error) {
        console.error("Manual order creation failed:", error);
        return Response.json(
            { error: (error as Error).message || "Unable to record offline sale" },
            { status: 500 }
        );
    }
}

