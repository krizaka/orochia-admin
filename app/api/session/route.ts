import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, apiBaseUrl } from "@/lib/orochia";

export const dynamic = "force-dynamic";

const SESSION_SECONDS = 8 * 60 * 60;

/**
 * Operator sign-in: the credentials are checked by Orochia, and the session it returns is kept
 * only if the account is an administrator. Members and creators are refused here.
 */
export async function POST(req: NextRequest) {
  const { identifier, password } = (await req.json().catch(() => ({}))) as { identifier?: string; password?: string };
  if (!identifier || !password) {
    return NextResponse.json({ error: "Identifier and password are required" }, { status: 400 });
  }

  const login = await fetch(`${apiBaseUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    cache: "no-store",
  });
  if (!login.ok) {
    const status = login.status === 429 ? 429 : 401;
    return NextResponse.json({ error: status === 429 ? "Too many attempts" : "Invalid credentials" }, { status });
  }
  const token = (login.headers.get("set-cookie") ?? "").match(/orochia_session=([^;]+)/)?.[1];
  if (!token) return NextResponse.json({ error: "Sign-in failed" }, { status: 502 });

  const me = await fetch(`${apiBaseUrl()}/api/auth/me`, {
    headers: { Cookie: `orochia_session=${token}` },
    cache: "no-store",
  });
  const body = (await me.json().catch(() => ({ user: null }))) as { user: { role: string } | null };
  if (body.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "This console is restricted to administrators" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return response;
}

/** Sign-out. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
