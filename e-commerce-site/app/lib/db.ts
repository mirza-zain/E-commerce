import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

neonConfig.webSocketConstructor = ws

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const db = drizzle({
    client: pool
});