import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";

import db from "./db/index";
import env from "./env";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Normalize unauthenticated /get-session to a stable { session: null, user: null }
      // shape so the client can rely on it. When a session exists, fall through and
      // let better-auth return its default { session, user } payload — that's where
      // user.image lives.
      if (ctx.path === "/get-session" && !ctx.context.session) {
        return ctx.json({
          session: null,
          user: null,
        });
      }
    }),
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.AUTH_GOOGLE_CLIENT_SECRET,
    },
  },
});
