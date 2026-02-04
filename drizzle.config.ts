import { defineConfig } from "drizzle-kit";

// Use the same fallback chain as src/db/index.ts for consistency
// DATABASE_PUBLIC_URL is used during Railway builds when internal URLs aren't available
const DATABASE_URL =
  process.env.DATABASE_POOLER_URL ||
  process.env.DATABASE_PUBLIC_URL ||
  process.env.DATABASE_URL;

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
