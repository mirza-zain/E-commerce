import { boolean, index ,integer, numeric, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


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
    trackingId: text("trackingId").notNull().unique(),
    firstName: text("firstName").notNull(),
    lastName: text("lastName").notNull(),
    email: text("email").notNull(),
    phoneNum: text("phoneNum").notNull(),
    address: text("address").notNull(),
    city: text("city").notNull(),
    totalAmount: numeric("totalAmount").notNull(),
    status: text("status").notNull(),
    subTotal: numeric("subTotal").notNull(),
    discountAmount: numeric("discountAmount").notNull(),
    deliveryAmount: numeric("deliveryAmount").notNull(),
    discountCode: text("discountCode"),
    createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull()
})

export const discountCodes = pgTable("discount_code", {
    id: serial("id").primaryKey(),
    code: text("code").notNull().unique(),
    type: text("type").notNull().default("percentage"),
    value: numeric("value").notNull(),
    minAmount: numeric("minAmount").notNull().default("0"),
    maxUses: integer("maxUses"),
    usedCount: integer("usedCount").notNull().default(0),
    expiresAt: timestamp("expiresAt", {withTimezone: true}),
    active: boolean("active").notNull().default(true)
})

export const deliveryCharges = pgTable("delivery_charge", {
    id: serial("id").primaryKey(),
    city: text("city").notNull().unique(),
    amount: numeric("amount").notNull().default("0"),
    active: boolean("active").notNull().default(true)
})

export const orderItems = pgTable('order_items', {
    id: serial("id").primaryKey(),
    orderId: integer("orderId").notNull().references(() => orders.id),
    productId: integer("productId").notNull().references(() => products.id),
    quantity: integer("quantity").notNull(),
    price: numeric("price").notNull()
})

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: text("role").notNull().default("user"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .$onUpdate(() => new Date())
        .notNull(),
})

export const pushSubscriptions = pgTable("push_subscription", {
    id: serial("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    endpoint: text("endpoint").notNull().unique(),
    p256dh: text("p256dh").notNull(),
    auth: text("auth").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("userAgent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [
        index("session_userId_idx").on(table.userId),
    ]
)

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("account_userId_idx").on(table.userId),
    ]
)

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [
        index("verification_identifier_idx").on(table.identifier),
    ]
)