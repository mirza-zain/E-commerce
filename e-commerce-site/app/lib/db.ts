import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import dns from "node:dns"

dns.setDefaultResultOrder("ipv4first")

const originLookup = dns.lookup

dns.lookup = ((hostname, options, callback) => {
    if(typeof options === "function") {
        callback = options
        options = {}
    } else if (typeof options === "number") {
        options = {family: options}
    } 
    return originLookup(hostname, {...options, family: 4}, callback)
}) as typeof dns.lookup

const sql = neon(process.env.DATABASE_URL!)

export const db = drizzle(sql)