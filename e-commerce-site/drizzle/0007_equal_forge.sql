ALTER TABLE "orders" ADD COLUMN "paymentMethod" text DEFAULT 'cod' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "paymentStatus" text DEFAULT 'unpaid' NOT NULL;