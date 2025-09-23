import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle referral links: /join/mkt-code
  if (pathname.startsWith("/join/")) {
    const code = pathname.split("/")[2] || "";

    const url = new URL("/auth/register", request.url);
    url.searchParams.set("ref", code);

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: "/join/:path*",
};
