import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "./lib/auth-server"

// Routes that require authentication
const protectedRoutes = ["/profile", "/tool"]

// Routes that should redirect to /tool if already authenticated
const authRoutes = ["/login", "/signup"]

async function handleIPChangeWithMigration(request: NextRequest, sessionToken: string) {
  try {
    const supabase = createServerSupabaseClient()
    const currentIP =
      request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Get session with IP info
    const { data: session, error } = await supabase
      .from("user_sessions")
      .select("id, user_id, ip_address, is_active")
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session) {
      return false // Session invalid
    }

    if (session.ip_address && currentIP !== session.ip_address && currentIP !== "unknown") {
      // Skip IP change check for localhost/development environment
      const isLocalhost =
        currentIP === "::1" ||
        currentIP === "127.0.0.1" ||
        currentIP.startsWith("192.168.") ||
        currentIP.startsWith("10.") ||
        currentIP.startsWith("172.")
      const isOldLocalhost =
        session.ip_address === "::1" ||
        session.ip_address === "127.0.0.1" ||
        session.ip_address.startsWith("192.168.") ||
        session.ip_address.startsWith("10.") ||
        session.ip_address.startsWith("172.")

      if (isLocalhost || isOldLocalhost) {
        console.log(`[v0] Skipping IP change check for localhost: ${session.ip_address} -> ${currentIP}`)
        return true // Allow localhost IP changes
      }

      console.log(`[v0] IP address changed for user ${session.user_id}: ${session.ip_address} -> ${currentIP}`)

      // Logout due to IP change - this is the correct behavior
      const { data: logoutResult, error: logoutError } = await supabase.rpc("logout_due_to_ip_change", {
        p_user_id: session.user_id,
        p_old_ip: session.ip_address,
        p_new_ip: currentIP,
      })

      if (logoutError) {
        console.error("[v0] IP logout error:", logoutError)
        return false
      }

      console.log(
        `[v0] Session expired due to IP address change for user ${session.user_id}. User needs to login again.`,
      )
      return false // Session expired due to IP change
    }

    return true // Session still valid
  } catch (error) {
    console.error("[v0] IP check error:", error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/sw.js" ||
    pathname === "/manifest.json"
  ) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get("session_token")?.value
  let isAuthenticated = !!sessionToken

  if (isAuthenticated && sessionToken) {
    const sessionValid = await handleIPChangeWithMigration(request, sessionToken)
    if (!sessionValid) {
      isAuthenticated = false
      // Clear the invalid session cookie (Vercel optimized)
      const response = NextResponse.redirect(new URL("/login?reason=session_invalid", request.url))
      response.cookies.delete("session_token")
      response.cookies.set("session_token", "", {
        path: "/",
        expires: new Date(0),
        domain: request.nextUrl.hostname,
        secure: true,
        sameSite: "strict"
      })
      return response
    }
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Handle auth routes (login, signup)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/tool", request.url))
    }
  }

  // Handle root route
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/tool", request.url))
    } else {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sw.js|manifest.json).*)"],
}
