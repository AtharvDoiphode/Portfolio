import { NextResponse, type NextRequest } from "next/server";

/** Quick gate: no admin cookie, no admin pages. The API still verifies the token on every request. */
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.has("admin_token")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
