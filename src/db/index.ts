import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy database connection - only created when first accessed
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;
let _client: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (_db) return _db;

  // Use pooler URL if available (recommended for serverless), otherwise direct connection
  // DATABASE_PUBLIC_URL is used during Railway builds (internal URLs aren't available at build time)
  const connectionString =
    process.env.DATABASE_POOLER_URL ||
    process.env.DATABASE_PUBLIC_URL ||
    process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL or DATABASE_POOLER_URL environment variable is required. " +
        "Set DATABASE_CONTENT_ENABLED=false to use Velite instead."
    );
  }

  // Connection configuration optimized for serverless environments
  _client = postgres(connectionString, {
    max: 10, // Maximum connections in pool
    idle_timeout: 20, // Close idle connections after 20 seconds
    connect_timeout: 10, // Connection timeout in seconds
  });

  _db = drizzle(_client, { schema });
  return _db;
}

export type Database = ReturnType<typeof drizzle<typeof schema>>;
