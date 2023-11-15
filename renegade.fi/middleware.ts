import { NextResponse, userAgent, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  if (device.type === "mobile") {
    if (request.nextUrl.pathname !== "/mobile") {
      request.nextUrl.pathname = "/mobile"
      return NextResponse.rewrite(request.nextUrl)
    }
    return
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|whitepaper.pdf|robots.txt|manifest.json|sitemap.xml|glyph_dark.svg).*)",
  ],
}
