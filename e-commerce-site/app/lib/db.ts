import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);