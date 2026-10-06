import { pgTable, serial, text, numeric, unique, timestamp, foreignKey, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	category: text().notNull(),
	price: numeric().notNull(),
	stock: numeric().notNull(),
	image: text(),
});

export const orders = pgTable("orders", {
	id: serial().primaryKey().notNull(),
	firstName: text().notNull(),
	lastName: text().notNull(),
	email: text().notNull(),
	address: text().notNull(),
	city: text().notNull(),
	totalAmount: numeric().notNull(),
	status: text().notNull(),
	createdAt: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	phoneNum: text().notNull(),
	trackingId: text(),
}, (table) => [
	unique("orders_trackingId_unique").on(table.trackingId),
]);

export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: integer().notNull(),
	productId: integer().notNull(),
	quantity: integer().notNull(),
	price: numeric().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "order_items_orderId_orders_id_fk"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_productId_products_id_fk"
		}),
]);
