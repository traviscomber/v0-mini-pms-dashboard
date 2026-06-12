import postgres, { type Sql, type TransactionSql } from "postgres";

const databaseUrlKeys = ["POSTGRES_URL", "DATABASE_URL", "POSTGRES_URL_NON_POOLING", "SUPABASE_DB_URL", "NEON_DATABASE_URL"] as const;

export type DatabaseUrlKey = (typeof databaseUrlKeys)[number];
export type PostgresClient = ReturnType<typeof postgres>;
export type PostgresTransactionClient = TransactionSql<Record<string, never>>;
export type PostgresRootClient = Sql<Record<string, never>>;
export type PostgresExecutor = PostgresClient | PostgresTransactionClient;

let sqlClient: PostgresClient | null = null;

function getDatabaseUrl() {
  for (const key of databaseUrlKeys) {
    const value = process.env[key];

    if (value) {
      return {
        key,
        value,
      };
    }
  }

  return null;
}

export function hasPostgresStore() {
  return getDatabaseUrl() !== null;
}

export function getPostgresConfigSource(): DatabaseUrlKey | null {
  return getDatabaseUrl()?.key ?? null;
}

export function getSql() {
  const connection = getDatabaseUrl();

  if (!connection) {
    throw new Error("Postgres is not configured");
  }

  if (!sqlClient) {
    sqlClient = postgres(connection.value, {
      max: 1,
      prepare: false,
    });
  }

  return sqlClient;
}
