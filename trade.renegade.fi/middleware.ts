import { NextResponse, userAgent, type NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { device } = userAgent(request)
  if (device.type === "mobile") {
    if (request.nextUrl.pathname !== "/m") {
      request.nextUrl.pathname = "/m"
      return NextResponse.rewrite(request.nextUrl)
    }
    return
  }

  // const pathname = request.nextUrl.pathname
  // const url = request.nextUrl.clone()
  // if (pathname === "/") {
  //   url.pathname = "/WETH/USDC"
  //   return NextResponse.redirect(url)
  // }
  // const [, base, quote] = pathname.split("/")
  // if (base === quote) {
  //   request.nextUrl.pathname = `/${base}`
  //   return NextResponse.redirect(request.nextUrl)
  // }
  // const regex = /[a-z]/
  // if (regex.test(pathname)) {
  //   url.pathname = pathname.toUpperCase()
  //   return NextResponse.redirect(url)
  // }
  return NextResponse.next()
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|deposit).*)"],
}
