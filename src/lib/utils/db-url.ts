/**
 * Get the database connection URL with fallback chain.
 *
 * Priority: pooler URL (recommended for serverless) > public URL (for build-time) > direct connection
 * DATABASE_PUBLIC_URL is used during Railway builds when internal URLs aren't available.
 *
 * @returns The database connection URL or undefined if none are set
 */
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_POOLER_URL ||
    process.env.DATABASE_PUBLIC_URL ||
    process.env.DATABASE_URL
  );
}
