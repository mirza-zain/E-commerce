'use client'

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type Props = {
    orderId: number
    totalAmount: string
    paymentMethod?: string
    initialPaymentStatus?: string
    paymentReceipt?: string | null
}

const paymentStatusLabels: Record<string, { label: string; class: string }> = {
    pending_verification: {
        label: "Verification Pending",
        class: "bg-amber-100 text-amber-900 border-amber-300"
    },
    paid: {
        label: "Verified & Paid",
        class: "bg-emerald-100 text-emerald-900 border-emerald-300"
    },
    rejected: {
        label: "Payment Declined",
        class: "bg-rose-100 text-rose-900 border-rose-300"
    },
    unpaid: {
        label: "Unpaid",
        class: "bg-neutral-100 text-neutral-800 border-neutral-300"
    }
}

function getOptimizedCloudinaryUrl(url: string, width = 800) {
    if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
        return url
    }
    return url.replace("/upload/", `/upload/w_${width},c_limit,q_auto,f_auto/`)
}

export default function PaymentVerificationCard({
    orderId,
    totalAmount,
    paymentMethod = "cod",
    initialPaymentStatus = "unpaid",
    paymentReceipt,
}: Props) {
    const router = useRouter()
    const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
    const [loadingAction, setLoadingAction] = useState<string | null>(null)
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const isBankTransfer = paymentMethod === "bank_transfer"
    const statusMeta = paymentStatusLabels[paymentStatus] || {
        label: paymentStatus,
        class: "bg-neutral-100 text-neutral-800 border-neutral-300"
    }

    const updatePayment = async (newPaymentStatus: string, newOrderStatus?: string) => {
        setLoadingAction(newPaymentStatus)
        setMessage(null)

        try {
            const payload: { paymentStatus: string; status?: string } = {
                paymentStatus: newPaymentStatus
            }
            if (newOrderStatus) {
                payload.status = newOrderStatus
            }

            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed to update payment status")
            }

            setPaymentStatus(newPaymentStatus)
            setMessage({
                type: "success",
                text: newPaymentStatus === "paid"
                    ? "Payment approved and marked as Paid!"
                    : newPaymentStatus === "rejected"
                    ? "Payment marked as Rejected."
                    : "Payment status updated."
            })
            router.refresh()
        } catch (err) {
            setMessage({
                type: "error",
                text: (err as Error).message || "Error updating payment"
            })
        } finally {
            setLoadingAction(null)
        }
    }

    return (
        <>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200 pb-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                            Payment Details
                        </p>
                        <h2 className="mt-1 text-2xl font-bold text-neutral-900">
                            {isBankTransfer ? "Direct Bank Transfer" : "Cash on Delivery (COD)"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusMeta.class}`}>
                            <span className="size-2 rounded-full bg-current" />
                            {statusMeta.label}
                        </span>
                    </div>
                </div>

                {/* Amount verification info banner */}
                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-neutral-500">Total Expected</p>
                        <p className="text-2xl font-bold text-neutral-950">Rs. {totalAmount}</p>
                    </div>
                    <div className="text-xs text-neutral-600 sm:text-right max-w-sm">
                        {isBankTransfer ? (
                            <p>
                                Verify that the receipt shows an exact transfer of <strong>Rs. {totalAmount}</strong> to your account before approving.
                            </p>
                        ) : (
                            <p>Customer will pay in cash upon order delivery.</p>
                        )}
                    </div>
                </div>

                {/* Screenshot Verification Section */}
                {isBankTransfer && (
                    <div className="mt-6 border-t border-neutral-200 pt-6">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                            Payment Screenshot / Receipt
                        </h3>

                        {paymentReceipt ? (
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <div
                                    onClick={() => setModalOpen(true)}
                                    className="relative h-48 w-48 sm:h-56 sm:w-56 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 border-neutral-200 bg-neutral-100 hover:border-black transition group"
                                    title="Click to view full image"
                                >
                                    <Image
                                        src={getOptimizedCloudinaryUrl(paymentReceipt, 600)}
                                        alt="Uploaded Payment Receipt"
                                        fill
                                        unoptimized
                                        className="object-contain transition group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                                        Click to Enlarge
                                    </div>
                                </div>

                                <div className="flex-1 space-y-3">
                                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-700 space-y-1">
                                        <p className="font-semibold text-neutral-900">Receipt Information:</p>
                                        <p>• Screenshot uploaded by customer at checkout.</p>
                                        <p>• Check transaction reference ID, timestamp, and transferred amount.</p>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(true)}
                                            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:border-black transition"
                                        >
                                            View Full Screen
                                        </button>
                                        <a
                                            href={paymentReceipt}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rounded-xl border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 hover:border-black transition inline-flex items-center gap-1"
                                        >
                                            Open in New Tab ↗
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center text-sm text-neutral-500">
                                No payment screenshot was uploaded for this order.
                            </div>
                        )}
                    </div>
                )}

                {/* Actions: Approve / Reject / Reset */}
                <div className="mt-6 border-t border-neutral-200 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                        Payment Approval Actions
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            disabled={loadingAction !== null || paymentStatus === "paid"}
                            onClick={() => void updatePayment("paid", "processing")}
                            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loadingAction === "paid" ? "Approving..." : "✓ Approve Payment"}
                        </button>

                        <button
                            type="button"
                            disabled={loadingAction !== null || paymentStatus === "rejected"}
                            onClick={() => void updatePayment("rejected")}
                            className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingAction === "rejected" ? "Rejecting..." : "✕ Reject Payment"}
                        </button>

                        {paymentStatus !== "unpaid" && (
                            <button
                                type="button"
                                disabled={loadingAction !== null}
                                onClick={() => void updatePayment("unpaid")}
                                className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-50"
                            >
                                Reset to Unpaid
                            </button>
                        )}
                    </div>

                    {message && (
                        <p className={`mt-3 text-xs font-medium ${
                            message.type === "success" ? "text-emerald-700" : "text-rose-600"
                        }`}>
                            {message.text}
                        </p>
                    )}
                </div>
            </div>

            {/* Modal for full image preview */}
            {modalOpen && paymentReceipt && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="relative max-h-[90vh] max-w-4xl w-full rounded-2xl bg-white p-4 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                            <div>
                                <h4 className="text-base font-bold text-neutral-900">Payment Screenshot</h4>
                                <p className="text-xs text-neutral-500">Order #{orderId} • Expected Amount: Rs. {totalAmount}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={paymentReceipt}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium text-neutral-700 hover:text-black underline mr-2"
                                >
                                    Open Original
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="rounded-lg border border-neutral-200 p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-black"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                        <div className="relative mt-4 h-[70vh] w-full bg-neutral-900/5 rounded-xl overflow-hidden">
                            <Image
                                src={getOptimizedCloudinaryUrl(paymentReceipt, 1600)}
                                alt="Payment Screenshot Full"
                                fill
                                unoptimized
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

