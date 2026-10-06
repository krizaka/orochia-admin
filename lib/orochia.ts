import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server-side client of the Orochia API. The admin console has no database of its own: every
 * figure and every action goes through Orochia's /api/admin endpoints, authorised by the ADMIN
 * session the operator signed in with (kept in an httpOnly cookie, never exposed to the browser).
 */

export const ADMIN_COOKIE = "orochia_admin_session";

export function apiBaseUrl(): string {
  const url = process.env.OROCHIA_API_URL;
  if (url && url.trim()) return url.trim().replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") throw new Error("OROCHIA_API_URL is required in production");
  return "http://localhost:3000";
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Calls Orochia with the operator's session; an expired or non-admin session goes back to /login. */
export async function orochia<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) redirect("/login");
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Cookie: `orochia_session=${token}`,
    },
  });
  if (res.status === 401 || res.status === 403) redirect("/login?expired=1");
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new ApiError(res.status, body.error ?? `Orochia API error ${res.status}`);
  return body;
}

export interface AdminIdentity {
  username: string;
  email: string;
  displayName: string;
}

/** The signed-in operator, or null (no cookie / session no longer valid / not an admin). */
export async function currentAdmin(): Promise<AdminIdentity | null> {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const res = await fetch(`${apiBaseUrl()}/api/auth/me`, {
      cache: "no-store",
      headers: { Cookie: `orochia_session=${token}` },
    });
    const body = (await res.json()) as { user: (AdminIdentity & { role: string }) | null };
    return body.user && body.user.role === "ADMIN" ? body.user : null;
  } catch {
    return null;
  }
}

export const money = (cents: number) =>
  `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
