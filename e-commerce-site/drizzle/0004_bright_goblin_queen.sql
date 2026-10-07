CREATE TABLE "discount_code" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"type" text DEFAULT 'percentage' NOT NULL,
	"value" numeric NOT NULL,
	"minAmount" numeric DEFAULT '0' NOT NULL,
	"maxUses" integer,
	"usedCount" integer DEFAULT 0 NOT NULL,
	"expiresAt" timestamp with time zone,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "discount_code_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "subTotal" numeric;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discountAmount" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "deliveryAmount" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "discountCode" text;

UPDATE "orders"
SET "subTotal" = "totalAmount";

ALTER TABLE "orders" ALTER COLUMN "subTotal" SET NOT NULL;