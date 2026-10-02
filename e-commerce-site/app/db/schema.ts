import { integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    price: numeric("price").notNull(),
    stock: numeric("stock").notNull(),
    image: text("image")
})

export const orders = pgTable('orders', {
    id: serial("id").primaryKey(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull(),
    phoneNum: text("phoneNum").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    totalAmount: numeric("totalAmount").notNull(),
    status: text("status").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull()
})

export const orderItems = pgTable('order_items', {
    id: serial("id").primaryKey(),
    orderId: integer("orderId").notNull().references(() => orders.id),
    productId: integer("productId").notNull().references(() => products.id),
    quantity: integer("quantity").notNull(),
    price: numeric("price").notNull()
})