import { db } from "@/app/lib/db"
import { pushSubscriptions, user } from "@/app/db/schema"
import { eq } from "drizzle-orm"
import webpush from "web-push"

function configureWebPush() {
    const publicKey = process.env.VAPID_PUBLIC_KEY
    const privateKey = process.env.VAPID_PRIVATE_KEY
    const subject = process.env.VAPID_SUBJECT ?? "mailto:admin@example.com"

    if (!publicKey || !privateKey) return false

    webpush.setVapidDetails(subject, publicKey, privateKey)
    return true
}

export async function sendNewOrderNotification(order: {
    id: number
    firstName: string
    lastName: string
    totalAmount: string
}) {
    if (!configureWebPush()) {
        console.warn("Web Push is not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY.")
        return
    }

    const subscriptions = await db
        .select({
            id: pushSubscriptions.id,
            endpoint: pushSubscriptions.endpoint,
            p256dh: pushSubscriptions.p256dh,
            auth: pushSubscriptions.auth,
        })
        .from(pushSubscriptions)
        .innerJoin(user, eq(pushSubscriptions.userId, user.id))
        .where(eq(user.role, "admin"))

    const payload = JSON.stringify({
        title: "New order received",
        body: `Order #${order.id} from ${order.firstName} ${order.lastName} · Rs. ${order.totalAmount}`,
        url: "/admin/manageOrders",
    })

    await Promise.allSettled(subscriptions.map(async (subscription) => {
        try {
            await webpush.sendNotification({
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth,
                },
            }, payload)
        } catch (error) {
            const statusCode = (error as { statusCode?: number }).statusCode
            if (statusCode === 404 || statusCode === 410) {
                await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, subscription.id))
            }
        }
    }))
}
