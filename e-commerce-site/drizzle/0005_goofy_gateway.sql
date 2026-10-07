CREATE TABLE "delivery_charge" (
	"id" serial PRIMARY KEY NOT NULL,
	"city" text NOT NULL,
	"amount" numeric DEFAULT '0' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "delivery_charge_city_unique" UNIQUE("city")
);
