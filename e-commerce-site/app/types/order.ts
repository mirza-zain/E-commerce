export type OrderItem = {
    productId: number,
    productName: string,
    quantity: number,
    price: string
}

export type Order = {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phoneNum: string,
    address: string,
    city: string,
    totalAmount: string,
    status: string,
    createdAt: string,
    items: OrderItem[]
}