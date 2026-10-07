type DiscountRule = {
    type: string
    value: string
    minAmount: string
    maxUses: number | null
    usedCount: number
    expiresAt: Date | null
    active: boolean
}

export function calculateDiscount(subtotal: number, discount: DiscountRule | null) {
    if (!discount || !discount.active) return 0
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) return 0
    if (discount.expiresAt && discount.expiresAt.getTime() <= Date.now()) return 0
    if (subtotal < Number(discount.minAmount)) return 0

    const rawAmount = discount.type === "fixed"
        ? Number(discount.value)
        : subtotal * Number(discount.value) / 100

    return Math.min(Math.max(rawAmount, 0), subtotal)
}
