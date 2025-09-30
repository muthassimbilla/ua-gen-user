import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "./lib/auth-server"

// Routes that require authentication
const protectedRoutes = ["/profile", "/tool"]

// Routes that should redirect to /tool if already authenticated
const authRoutes = ["/login", "/signup"]

async function handleSessionValidation(request: NextRequest, sessionToken: string) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get current IP for tracking (no security enforcement)
    const forwardedFor = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    const clientIP = request.ip
    
    let currentIP = "unknown"
    if (forwardedFor) {
      // x-forwarded-for can contain multiple IPs, take the first one
      currentIP = forwardedFor.split(",")[0].trim()
    } else if (realIP) {
      currentIP = realIP
    } else if (clientIP) {
      currentIP = clientIP
    }

    // Get session with IP info - allow multiple concurrent sessions
    const { data: session, error } = await supabase
      .from("user_sessions")
      .select("id, user_id, ip_address, user_agent, is_active, last_accessed")
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session) {
      return false // Session invalid
    }

    // Update last accessed time without IP/UA enforcement for multi-tab support
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const now = new Date().toISOString()
    
    // Only update if last access was more than 30 seconds ago to avoid excessive DB calls
    const lastAccess = new Date(session.last_accessed || 0)
    const timeDiff = Date.now() - lastAccess.getTime()
    
    if (timeDiff > 30000) { // 30 seconds
      try {
        const updateData: any = {
          last_accessed: now
        }
        
        // Only update IP/UA if they're significantly different (for analytics)
        if (currentIP !== "unknown" && (!session.ip_address || currentIP !== session.ip_address)) {
          updateData.ip_address = currentIP
        }
        if (userAgent !== "Unknown" && (!session.user_agent || session.user_agent !== userAgent)) {
          updateData.user_agent = userAgent
        }
        
        await supabase
          .from("user_sessions")
          .update(updateData)
          .eq("id", session.id)
        console.log(`[v0] Updated session access time`)
      } catch (updateError) {
        console.warn("[v0] Failed to update session data:", updateError)
      }
    }

    return true // Session still valid
  } catch (error) {
    console.error("[v0] Session validation error:", error)
    return false
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
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

  // Prevent infinite redirects by checking redirect count
  const redirectCount = request.headers.get("x-redirect-count") || "0"
  if (parseInt(redirectCount) > 3) {
    console.error("[v0] Too many redirects detected, stopping middleware")
    return NextResponse.next()
  }

  // Early return for login page with session_invalid to prevent loops
  if (pathname === "/login" && request.nextUrl.searchParams.get("reason") === "session_invalid") {
    console.log("[v0] Early return for login page with session_invalid")
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get("session_token")?.value
  let isAuthenticated = !!sessionToken

  if (isAuthenticated && sessionToken) {
    try {
      const sessionValid = await handleSessionValidation(request, sessionToken)
      if (!sessionValid) {
        isAuthenticated = false
        console.log("[v0] Session invalid, redirecting to login")
        // Clear the invalid session cookie (Vercel optimized)
        const response = NextResponse.redirect(new URL("/login?reason=session_invalid", request.url))
        response.cookies.delete("session_token")
        response.cookies.set("session_token", "", {
          path: "/",
          expires: new Date(0),
          domain: request.nextUrl.hostname === 'localhost' ? 'localhost' : `.${request.nextUrl.hostname}`,
          secure: process.env.NODE_ENV === 'production',
          sameSite: "lax"
        })
        // Add redirect count header
        response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
        return response
      }
    } catch (error) {
      console.error("[v0] Session validation error:", error)
      // If session validation fails, treat as unauthenticated
      isAuthenticated = false
    }
  }


  // Additional safety: if we're on login page and no session token, just proceed
  if (pathname === "/login" && !sessionToken) {
    console.log("[v0] On login page without session token, proceeding")
    return NextResponse.next()
  }

  // Skip middleware for login page if already authenticated (to prevent loops)
  if (pathname === "/login" && isAuthenticated) {
    console.log("[v0] On login page with valid session, redirecting to tool")
    const response = NextResponse.redirect(new URL("/tool", request.url))
    response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
    return response
  }

  // Handle protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Redirect to login page
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      const response = NextResponse.redirect(loginUrl)
      response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
      return response
    }
  }

  // Handle auth routes (login, signup)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      const response = NextResponse.redirect(new URL("/tool", request.url))
      response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
      return response
    }
  }

  // Handle root route - always redirect to landing page
  if (pathname === "/") {
    const response = NextResponse.redirect(new URL("/landing", request.url))
    response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - sw.js (service worker)
     * - manifest.json (web app manifest)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|sw.js|manifest.json).*)",
  ],
}
