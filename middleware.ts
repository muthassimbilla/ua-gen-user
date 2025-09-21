import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const publicRoutes = ["/auth", "/pricing"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isRootRoute = request.nextUrl.pathname === "/"

  // Handle unauthenticated users
  if (!user) {
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Get user profile for authenticated users
  const { data: profile } = await supabase.from("user_profiles").select("status, role").eq("id", user.id).single()

  console.log("[v0] Middleware - User ID:", user.id)
  console.log("[v0] Middleware - Profile:", profile)
  console.log("[v0] Middleware - Current path:", request.nextUrl.pathname)

  // Handle admin routes
  if (isAdminRoute) {
    if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
      console.log("[v0] Middleware - Redirecting non-admin from admin route")
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Handle user status for protected routes
  if (!isPublicRoute) {
    if (profile?.status === "pending") {
      console.log("[v0] Middleware - Redirecting pending user to pricing")
      const url = request.nextUrl.clone()
      url.pathname = "/pricing"
      return NextResponse.redirect(url)
    }

    if (profile?.status === "rejected" || profile?.status === "suspended") {
      console.log("[v0] Middleware - Redirecting restricted user to auth")
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      url.searchParams.set("message", "account_restricted")
      return NextResponse.redirect(url)
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

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
