export type OrderItem = {
    productId: number,
    productName: string,
    variantLabel: string | null,
    quantity: number,
    price: string
}

export type Order = {
    id: number,
    trackingId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNum: string,
    address: string,
    city: string,
    totalAmount: string,
    subTotal: string,
    discountAmount: string,
    deliveryAmount: string,
    discountCode: string | null,
    paymentMethod?: string,
    paymentStatus?: string,
    status: string,
    createdAt: string,
    items: OrderItem[]
}