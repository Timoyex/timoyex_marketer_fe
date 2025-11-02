import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle referral links: /join/mkt-code
  if (pathname.startsWith("/join/")) {
    const code = pathname.split("/")[2] || "";

    const url = new URL("/register", request.url);
    url.searchParams.set("ref", code);

    return NextResponse.redirect(url);
  }

  // Auth checks
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const role = request.cookies.get("role")?.value;

  const authPages = [
    "/login",
    "/register",
    "/verify",
    "/verify-email",
    "/newAuth",
    "/forgot-password",
    "/reset-password",
  ];

  // Check if it's the admin LOGIN page (not dashboard or other admin routes)
  const isAdminLoginPage = pathname === "/admin";
  const isAuthPage =
    authPages.some((page) => pathname.startsWith(page)) || isAdminLoginPage;

  const isPublicPage = pathname === "/";
  const isProtectedPage = !isPublicPage && !isAuthPage;

  // Redirect authenticated users away from auth pages
  if (isAuthPage && (accessToken || refreshToken)) {
    if (role && role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  // Redirect unauthenticated users to login
  if (isProtectedPage && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Optional: Add admin role check for admin routes
  if (pathname.startsWith("/admin/") && role !== "admin") {
    return NextResponse.redirect(new URL("/overview", request.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico, sitemap.xml, robots.txt
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
//   ],
// };

export const config = {
  matcher: [
    // Only match app routes, not static files
    "/((?!_next|api|favicon.ico|sitemap.xml|robots.txt|[^/]+\\.[^/]+$).*)",
  ],
};
