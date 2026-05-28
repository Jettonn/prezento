import type { Config } from "drizzle-kit";

import env from "./app/lib/env";

const isLocalDb = env.TURSO_DATABASE_URL.startsWith("file:")
  || env.TURSO_DATABASE_URL.includes("127.0.0.1")
  || env.TURSO_DATABASE_URL.includes("localhost");

export default {
  out: "./app/lib/db/migrations",
  schema: "./app/lib/db/schema/index.ts",
  casing: "snake_case",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: isLocalDb ? undefined : env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
