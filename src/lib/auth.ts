import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {polar,checkout,portal} from "@polar-sh/better-auth";
import { db } from "@/db"; // your drizzle instance
 import * as schema from "@/db/schema"
import { polarClient } from "./polar";

const isDev = process.env.NODE_ENV === "development";
const baseURL = isDev 
    ? "http://localhost:3000" 
    : (process.env.BETTER_AUTH_URL || "https://agent-chat-ai-mu.vercel.app");

export const auth = betterAuth({
    baseURL,
    trustedOrigins: [
        ...(isDev ? ["http://localhost:3000", "http://192.168.1.33:3000"] : []),
        "https://agent-chat-ai-mu.vercel.app",
        ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : []),
    ],
    plugins:[
        polar({
          client:polarClient,
          createCustomerOnSignUp:true,
          use:[
            checkout({
                authenticatedUsersOnly:true,
                successUrl:"/upgrade",
            }),
            portal(),
          ]
        })
    ],
     socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    },
    emailAndPassword: {  
        enabled: true
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema:{
            ...schema,
        },
    }),
});