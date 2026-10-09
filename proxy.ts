import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "orochia_admin_session";

/**
 * Two gates before any page or route:
 * 1. Network — when ADMIN_ALLOWED_IPS is set (comma-separated addresses), every other client gets 403, sign-in page
 *    included. The client address is DigitalOcean's `do-connecting-ip` (set by its edge, not by the client); locally,
 *    the first `x-forwarded-for` hop. In production the list is mandatory: without it the console answers 403 to all.
 * 2. Session — no operator cookie, back to /login (the session itself is checked against the console's database).
 */
function clientIp(req: NextRequest): string | null {
  return req.headers.get("do-connecting-ip")?.trim() || (process.env.NODE_ENV === "production" ? null : req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1");
}

function allowed(ip: string | null): boolean {
  const list = (process.env.ADMIN_ALLOWED_IPS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (list.length === 0) return process.env.NODE_ENV !== "production";
  return ip !== null && list.includes(ip);
}

export function proxy(req: NextRequest) {
  if (!allowed(clientIp(req))) return new NextResponse("Forbidden", { status: 403 });
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/login") || pathname.startsWith("/api/session")) return NextResponse.next();
  if (!req.cookies.get(ADMIN_COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
