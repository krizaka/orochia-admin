import { redirect } from "next/navigation";
import { currentAdmin } from "./account";

/**
 * Server-side client of the Orochia admin API. The console signs its own operator in (lib/account.ts) and calls
 * Orochia as a service: `Authorization: Bearer OROCHIA_ADMIN_API_TOKEN`, the token Orochia accepts on its ADMIN routes
 * only (it acts there as the platform owner). The token never reaches the browser.
 */

export function apiBaseUrl(): string {
  const url = process.env.OROCHIA_API_URL;
  if (url && url.trim()) return url.trim().replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") throw new Error("OROCHIA_API_URL is required in production");
  return "http://localhost:3000";
}

export function serviceToken(): string {
  const token = process.env.OROCHIA_ADMIN_API_TOKEN?.trim();
  if (!token || token.length < 32) throw new Error("OROCHIA_ADMIN_API_TOKEN (32+ characters, shared with Orochia) is required");
  return token;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Calls Orochia for the signed-in operator; without an operator session, back to /login. */
export async function orochia<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!(await currentAdmin())) redirect("/login?expired=1");
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${serviceToken()}`,
    },
  });
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (res.status === 401 || res.status === 503) throw new ApiError(res.status, `Orochia refused the console (${body.error ?? res.status}): check OROCHIA_ADMIN_API_TOKEN and OROCHIA_OWNER_EMAIL on both deployments`);
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Orochia API error ${res.status}`);
  return body;
}

export type { AdminIdentity } from "./account";

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
