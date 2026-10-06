import { relations } from "drizzle-orm/relations";
import { orders, orderItems, products } from "./schema";

export const orderItemsRelations = relations(orderItems, ({one}) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
}));

export const ordersRelations = relations(orders, ({many}) => ({
	orderItems: many(orderItems),
}));

export const productsRelations = relations(products, ({many}) => ({
	orderItems: many(orderItems),
}));