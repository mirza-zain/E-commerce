CREATE TABLE "site_promo" (
	"id" serial PRIMARY KEY NOT NULL,
	"image_url" text NOT NULL,
	"link_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
