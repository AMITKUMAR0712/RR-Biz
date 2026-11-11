import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.NODE_ENV !== "production" || !configuredSiteUrl || configuredSiteUrl.includes(".example")) return NextResponse.next();

  const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const requestIsHttps = forwardedProtocol ? forwardedProtocol === "https" : request.nextUrl.protocol === "https:";
  if (requestIsHttps) return NextResponse.next();

  const secureUrl = new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, configuredSiteUrl);
  return NextResponse.redirect(secureUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
