import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isAdminRoute = createRouteMatcher(["/admin(.*)"])
const isAdminLoginRoute = createRouteMatcher(["/admin/login(.*)", "/admin/accept-invite(.*)"])

export const proxy = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const pathname = request.nextUrl.pathname

  if (!userId && isAdminRoute(request) && !isAdminLoginRoute(request)) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  if (userId && (pathname === "/admin" || pathname === "/admin/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {

  matcher: [

    /*

     * Match all request paths except for the ones starting with:

     * - _next/static (static files)

     * - _next/image (image optimization files)

     * - favicon.ico (favicon file)

     * Feel free to modify this pattern to include more paths.

     */

    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",

  ],

}
