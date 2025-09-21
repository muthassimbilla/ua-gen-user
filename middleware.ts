import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("[v0] Middleware triggered for path:", request.nextUrl.pathname)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Middleware - Supabase environment variables not available, allowing all requests")
    return NextResponse.next({
      request,
    })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
  })

  let user = null
  let authError = null

  try {
    const authResult = await supabase.auth.getUser()
    user = authResult.data.user
    authError = authResult.error
  } catch (error) {
    console.log("[v0] Middleware - Auth fetch failed, retrying once:", error)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay
      const retryResult = await supabase.auth.getUser()
      user = retryResult.data.user
      authError = retryResult.error
    } catch (retryError) {
      console.log("[v0] Middleware - Auth retry failed:", retryError)
      authError = retryError
    }
  }

  console.log("[v0] Middleware - Auth error:", authError)
  console.log("[v0] Middleware - User object:", user ? { id: user.id, email: user.email } : null)

  const publicRoutes = ["/auth", "/pending", "/adminbilla"]
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  const isAdminRoute = request.nextUrl.pathname.startsWith("/adminbilla/")
  const isRootRoute = request.nextUrl.pathname === "/"

  console.log("[v0] Middleware - Is public route:", isPublicRoute)
  console.log("[v0] Middleware - User exists:", !!user)

  // Handle unauthenticated users
  if (!user || authError) {
    console.log("[v0] Middleware - No user found or auth error")
    if (!isPublicRoute) {
      console.log("[v0] Middleware - Redirecting unauthenticated user to auth")
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  let profile = null
  let profileError = null

  try {
    const profileResult = await supabase.from("user_profiles").select("status, role, email").eq("id", user.id).single()

    profile = profileResult.data
    profileError = profileResult.error
  } catch (error) {
    console.log("[v0] Middleware - Profile fetch failed, retrying once:", error)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100)) // Small delay
      const retryResult = await supabase.from("user_profiles").select("status, role, email").eq("id", user.id).single()

      profile = retryResult.data
      profileError = retryResult.error
    } catch (retryError) {
      console.log("[v0] Middleware - Profile retry failed:", retryError)
      profileError = retryError
    }
  }

  console.log("[v0] Middleware - User ID:", user.id)
  console.log("[v0] Middleware - Profile error:", profileError)
  console.log("[v0] Middleware - Profile data:", profile)
  console.log("[v0] Middleware - Current path:", request.nextUrl.pathname)

  if (profileError || !profile) {
    console.log("[v0] Middleware - Profile not found, redirecting to auth")
    if (!isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      url.searchParams.set("message", "profile_not_found")
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  if (isAdminRoute) {
    if (profile.role !== "admin" && profile.role !== "super_admin") {
      console.log("[v0] Middleware - Redirecting non-admin from admin route")
      const url = request.nextUrl.clone()
      url.pathname = "/adminbilla"
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Handle user status for protected routes
  if (!isPublicRoute) {
    console.log("[v0] Middleware - Checking user status:", profile.status)

    if (profile.status === "pending") {
      console.log("[v0] Middleware - Redirecting pending user to pending approval page")
      const url = request.nextUrl.clone()
      url.pathname = "/pending"
      return NextResponse.redirect(url)
    }

    if (profile.status === "rejected" || profile.status === "suspended") {
      console.log("[v0] Middleware - Redirecting restricted user to auth")
      const url = request.nextUrl.clone()
      url.pathname = "/auth"
      url.searchParams.set("message", "account_restricted")
      return NextResponse.redirect(url)
    }

    if (isRootRoute && profile.status === "approved") {
      console.log("[v0] Middleware - Redirecting approved user to pricing page")
      const url = request.nextUrl.clone()
      url.pathname = "/pricing"
      return NextResponse.redirect(url)
    }
  }

  // Handle approved users trying to access pending page
  if (request.nextUrl.pathname === "/pending" && profile?.status === "approved") {
    console.log("[v0] Middleware - Redirecting approved user away from pending page")
    const url = request.nextUrl.clone()
    url.pathname = "/pricing"
    return NextResponse.redirect(url)
  }

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
