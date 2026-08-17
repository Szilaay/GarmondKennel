import "server-only";

import { Pool, type QueryResultRow } from "pg";

const globalForDatabase = globalThis as typeof globalThis & {
  garmondDatabasePool?: Pool;
};

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  return new Pool({
    connectionString,
    max: 8,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });
}

export function getDatabasePool() {
  if (!globalForDatabase.garmondDatabasePool) {
    globalForDatabase.garmondDatabasePool = createPool();
  }

  return globalForDatabase.garmondDatabasePool;
}

export async function query<T extends QueryResultRow>(text: string, values: unknown[] = []) {
  return getDatabasePool().query<T>(text, values);
}
