import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "@/app/lib/db";
import * as schema from "@/app/db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    trustedOrigins: [
        "http://localhost:3000",
        "https://zarbofficial.vercel.app"
    ]

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: false,
            }
        }
    },

    emailAndPassword: {
        enabled: true
    }
})