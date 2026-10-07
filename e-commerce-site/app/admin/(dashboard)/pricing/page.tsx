'use client'

import { FormEvent, useEffect, useState } from "react"

type Discount = { id: number; code: string; type: string; value: string; minAmount: string; usedCount: number; maxUses: number | null; active: boolean }
type Delivery = { id: number; city: string; amount: string; active: boolean }

export default function PricingPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([])
    const [deliveries, setDeliveries] = useState<Delivery[]>([])
    const [discountForm, setDiscountForm] = useState({ code: "", type: "percentage", value: "", minAmount: "0", maxUses: "" })
    const [deliveryForm, setDeliveryForm] = useState({ city: "", amount: "" })
    const [message, setMessage] = useState("")

    const load = async () => {
        const [discountResponse, deliveryResponse] = await Promise.all([
            fetch("/api/discount-codes"), fetch("/api/delivery-charges")
        ])
        setDiscounts(await discountResponse.json())
        setDeliveries(await deliveryResponse.json())
    }

    useEffect(() => {
        const timer = setTimeout(() => { void load() }, 0)
        return () => clearTimeout(timer)
    }, [])

    const submit = async (event: FormEvent, url: string, body: object, reset: () => void) => {
        event.preventDefault()
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
        const data = await response.json()
        setMessage(response.ok ? "Saved" : data.error ?? "Unable to save")
        if (response.ok) { reset(); await load() }
    }

    const toggle = async (url: string, active: boolean) => {
        await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !active }) })
        await load()
    }

    const remove = async (url: string) => { await fetch(url, { method: "DELETE" }); await load() }

    return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-8">
        <header><h1 className="text-3xl font-bold">Pricing Rules</h1><p className="mt-1 text-sm text-neutral-500">Control checkout discounts and city delivery charges.</p></header>
        {message && <p className="rounded-lg bg-neutral-100 px-4 py-3 text-sm">{message}</p>}
        <section className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">Add discount code</h2>
                <form className="space-y-3" onSubmit={(event) => submit(event, "/api/discount-codes", discountForm, () => setDiscountForm({ code: "", type: "percentage", value: "", minAmount: "0", maxUses: "" }))}>
                    <input required placeholder="Code" value={discountForm.code} onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border px-3 py-2" />
                    <div className="grid grid-cols-2 gap-3"><select value={discountForm.type} onChange={(e) => setDiscountForm({ ...discountForm, type: e.target.value })} className="rounded-lg border px-3 py-2"><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select><input required type="number" min="0.01" step="0.01" placeholder="Value" value={discountForm.value} onChange={(e) => setDiscountForm({ ...discountForm, value: e.target.value })} className="rounded-lg border px-3 py-2" /></div>
                    <div className="grid grid-cols-2 gap-3"><input type="number" min="0" step="0.01" placeholder="Minimum order" value={discountForm.minAmount} onChange={(e) => setDiscountForm({ ...discountForm, minAmount: e.target.value })} className="rounded-lg border px-3 py-2" /><input type="number" min="1" placeholder="Max uses (optional)" value={discountForm.maxUses} onChange={(e) => setDiscountForm({ ...discountForm, maxUses: e.target.value })} className="rounded-lg border px-3 py-2" /></div>
                    <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">Create discount</button>
                </form>
                <div className="divide-y border-t">{discounts.map((discount) => <div key={discount.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div><b>{discount.code}</b><p className="text-neutral-500">{discount.type === "percentage" ? `${discount.value}%` : `Rs. ${discount.value}`} off, used {discount.usedCount}{discount.maxUses ? `/${discount.maxUses}` : ""}</p></div><div className="flex gap-2"><button onClick={() => toggle(`/api/discount-codes/${discount.id}`, discount.active)} className="rounded border px-2 py-1">{discount.active ? "Disable" : "Enable"}</button><button onClick={() => remove(`/api/discount-codes/${discount.id}`)} className="rounded border border-red-200 px-2 py-1 text-red-600">Delete</button></div></div>)}</div>
            </div>
            <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6">
                <h2 className="text-xl font-semibold">Add delivery charge</h2>
                <form className="space-y-3" onSubmit={(event) => submit(event, "/api/delivery-charges", deliveryForm, () => setDeliveryForm({ city: "", amount: "" }))}>
                    <input required placeholder="City or default" value={deliveryForm.city} onChange={(e) => setDeliveryForm({ ...deliveryForm, city: e.target.value })} className="w-full rounded-lg border px-3 py-2" /><input required type="number" min="0" step="0.01" placeholder="Charge" value={deliveryForm.amount} onChange={(e) => setDeliveryForm({ ...deliveryForm, amount: e.target.value })} className="w-full rounded-lg border px-3 py-2" />
                    <button className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white">Create delivery rule</button>
                </form>
                <div className="divide-y border-t">{deliveries.map((delivery) => <div key={delivery.id} className="flex items-center justify-between gap-3 py-3 text-sm"><div><b className="capitalize">{delivery.city}</b><p className="text-neutral-500">Rs. {delivery.amount}</p></div><div className="flex gap-2"><button onClick={() => toggle(`/api/delivery-charges/${delivery.id}`, delivery.active)} className="rounded border px-2 py-1">{delivery.active ? "Disable" : "Enable"}</button><button onClick={() => remove(`/api/delivery-charges/${delivery.id}`)} className="rounded border border-red-200 px-2 py-1 text-red-600">Delete</button></div></div>)}</div>
            </div>
        </section>
    </main>
}
