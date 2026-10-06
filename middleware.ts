import { NextRequest, NextResponse } from "next/server";

const ADMIN_COOKIE = "orochia_admin_session";

/** Every page requires an operator session; the session itself is re-validated by each API call. */
export function middleware(req: NextRequest) {
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
