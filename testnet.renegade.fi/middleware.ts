import { NextResponse, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const url = request.nextUrl.clone()
  if (pathname === "/") {
    url.pathname = "/WETH/USDC"
    return NextResponse.redirect(url)
  }
  if (pathname.split("/").length === 2) {
    url.pathname = `${pathname}/USDC`
    return NextResponse.redirect(url)
  }
  const regex = /[a-z]/
  if (regex.test(pathname)) {
    url.pathname = pathname.toUpperCase()
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|deposit|sitemap.xml|robots.txt).*)",
  ],
}
