import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { db } from "@/app/lib/db";
import * as schema from "@/app/db/schema"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),

    baseURL: {
        allowedHosts: [
            "zarb.store",
            "*.zarb.store",
            "zarbofficial.vercel.app",
            "*.vercel.app",
            "localhost:*",
            "127.0.0.1:*",
            "192.168.*:*",
            "10.*:*",
        ],
        protocol: "auto",
        fallback: process.env.BETTER_AUTH_URL || "https://zarb.store",
    },

    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:*",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:*",
        "http://192.168.*:*",
        "http://10.*:*",
        "https://zarb.store",
        "https://www.zarb.store",
        "https://*.zarb.store",
        "https://zarbofficial.vercel.app",
        "https://*.vercel.app",
        ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
        ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS
            ? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",").map((s) => s.trim())
            : []),
    ],

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