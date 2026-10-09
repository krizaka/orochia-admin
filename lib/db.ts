import { Pool, type PoolConfig } from "pg";

/**
 * The console's own database (DATABASE_URL) — never Orochia's: the single operator account, its sessions, and the log
 * of every decision taken here. Orochia's data is reached through its admin API only (lib/orochia.ts).
 * The schema is created on first use (idempotent), so a fresh database needs no migration step.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS admin_account (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email text NOT NULL,
  name text NOT NULL,
  password_hash text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  ip text,
  user_agent text
);
CREATE INDEX IF NOT EXISTS admin_sessions_expires_idx ON admin_sessions (expires_at);
CREATE TABLE IF NOT EXISTS admin_audit (
  id bigserial PRIMARY KEY,
  at timestamptz NOT NULL DEFAULT now(),
  action text NOT NULL,
  target text,
  ok boolean NOT NULL,
  detail text
);
CREATE INDEX IF NOT EXISTS admin_audit_at_idx ON admin_audit (at DESC);
`;

/** Managed PostgreSQL signs with its own CA (DATABASE_CA_CERT): verify against it, as Orochia does. */
function config(url: string): PoolConfig {
  const ca = process.env.DATABASE_CA_CERT?.trim();
  if (!ca) return { connectionString: url };
  const u = new URL(url);
  for (const key of ["sslmode", "sslrootcert", "sslcert", "sslkey", "uselibpqcompat"]) u.searchParams.delete(key);
  return { connectionString: u.toString(), ssl: { ca, rejectUnauthorized: true } };
}

const holder = globalThis as unknown as { __adminPool?: Pool; __adminReady?: Promise<void> };

function pool(): Pool {
  if (!holder.__adminPool) {
    const url = process.env.DATABASE_URL?.trim();
    if (!url && process.env.NODE_ENV === "production") throw new Error("DATABASE_URL is required in production");
    holder.__adminPool = new Pool({ ...config(url || "postgresql://orochia_user:orochia_secret@localhost:5432/orochia_admin?sslmode=disable"), max: 5 });
  }
  return holder.__adminPool;
}

/** A query on the console's database, its schema created first (once per process). */
export async function sql<T extends Record<string, unknown> = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  holder.__adminReady ??= pool()
    .query(SCHEMA)
    .then(() => undefined)
    .catch((error: unknown) => {
      holder.__adminReady = undefined;
      throw error;
    });
  await holder.__adminReady;
  return (await pool().query<T>(text, params)).rows;
}
