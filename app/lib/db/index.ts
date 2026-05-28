import { drizzle } from "drizzle-orm/libsql";

import env from "../env";

import * as schema from "./schema";

const isLocalDb = env.TURSO_DATABASE_URL.startsWith("file:")
  || env.TURSO_DATABASE_URL.includes("127.0.0.1")
  || env.TURSO_DATABASE_URL.includes("localhost");

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: isLocalDb ? undefined : env.TURSO_AUTH_TOKEN,
  },
  casing: "snake_case",
  schema,
});

export default db;
