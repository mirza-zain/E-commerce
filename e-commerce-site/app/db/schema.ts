import { numeric, pgTable, serial, text } from "drizzle-orm/pg-core";


export const products = pgTable("products", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    price: numeric("price").notNull(),
    stock: numeric("stock").notNull(),
    image: text("image")
})