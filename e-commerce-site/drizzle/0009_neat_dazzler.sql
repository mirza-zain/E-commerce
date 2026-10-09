ALTER TABLE "order_items" ADD COLUMN "variantLabel" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "variants" jsonb DEFAULT '[]'::jsonb NOT NULL;