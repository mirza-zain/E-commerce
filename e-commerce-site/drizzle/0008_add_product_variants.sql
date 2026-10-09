ALTER TABLE "products" ADD COLUMN "variants" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "variantLabel" text;
