import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./src/lib/utils";

const DATABASE_URL = getDatabaseUrl();

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL, DATABASE_POOLER_URL, or DATABASE_PUBLIC_URL environment variable is required. " +
      "Please define one before running drizzle-kit."
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
