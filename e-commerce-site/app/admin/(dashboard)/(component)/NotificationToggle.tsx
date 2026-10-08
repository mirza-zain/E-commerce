'use client'

import { useEffect, useState } from "react"

function decodeVapidKey(value: string) {
    const padding = "=".repeat((4 - value.length % 4) % 4)
    const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    return Uint8Array.from([...rawData].map((character) => character.charCodeAt(0)))
}

export default function NotificationToggle() {
    const [status, setStatus] = useState<"loading" | "ready" | "enabled" | "unavailable" | "error">("loading")
    const [message, setMessage] = useState("")
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        const checkSupport = async () => {
            if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
                setStatus("unavailable")
                return
            }

            const response = await fetch("/api/push-subscriptions")
            if (!response.ok) throw new Error("Unable to check notification settings.")
            const data: { enabled?: boolean; publicKey?: string | null } = await response.json()
            if (!data.enabled || !data.publicKey) {
                setStatus("unavailable")
                setMessage("Add VAPID keys to enable notifications.")
                return
            }

            const registration = await navigator.serviceWorker.register("/push-sw.js")
            const subscription = await registration.pushManager.getSubscription()
            setStatus(subscription ? "enabled" : "ready")
        }

        checkSupport().catch(() => {
            setStatus("error")
            setMessage("Unable to check notification support.")
        })
    }, [])

    const enableNotifications = async () => {
        setBusy(true)
        setMessage("")
        try {
            const response = await fetch("/api/push-subscriptions")
            if (!response.ok) throw new Error("Unable to check notification settings.")
            const data: { publicKey?: string | null } = await response.json()
            if (!data.publicKey) {
                setStatus("unavailable")
                setMessage("Add VAPID keys to enable notifications.")
                return
            }

            const permission = await Notification.requestPermission()
            if (permission !== "granted") {
                setStatus("ready")
                setMessage("Notifications are blocked. Allow them in your browser settings.")
                return
            }

            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: decodeVapidKey(data.publicKey),
            })

            const saveResponse = await fetch("/api/push-subscriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription.toJSON()),
            })

            if (!saveResponse.ok) throw new Error("Unable to save notification settings.")
            setStatus("enabled")
        } catch (error) {
            setStatus("ready")
            setMessage(error instanceof Error ? error.message : "Unable to enable notifications.")
        } finally {
            setBusy(false)
        }
    }

    const disableNotifications = async () => {
        setBusy(true)
        setMessage("")
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            if (!subscription) {
                setStatus("ready")
                return
            }

            const response = await fetch("/api/push-subscriptions", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ endpoint: subscription.endpoint }),
            })
            if (!response.ok) throw new Error("Unable to disable notifications.")

            await subscription.unsubscribe()
            setStatus("ready")
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to disable notifications.")
        } finally {
            setBusy(false)
        }
    }

    return (
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold text-neutral-900">Order notifications</p>
                <p className="mt-1 text-sm text-neutral-500">
                    Get a browser notification when a new order is placed.
                </p>
                {message && <p className="mt-2 text-xs text-amber-700">{message}</p>}
            </div>
            {status === "enabled" ? (
                <button type="button" onClick={() => void disableNotifications()} disabled={busy} className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:border-black hover:text-black disabled:opacity-50">
                    {busy ? "Updating..." : "Notifications enabled"}
                </button>
            ) : status === "unavailable" ? (
                <span className="text-sm text-neutral-400">Unavailable</span>
            ) : (
                <button type="button" onClick={() => void enableNotifications()} disabled={status === "loading" || busy} className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-50">
                    {status === "loading" || busy ? "Updating..." : "Enable notifications"}
                </button>
            )}
        </section>
    )
}
