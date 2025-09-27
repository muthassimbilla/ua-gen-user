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

    // Get session with IP info
    const { data: session, error } = await supabase
      .from("user_sessions")
      .select("id, user_id, ip_address, user_agent, is_active")
      .eq("session_token", sessionToken)
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (error || !session) {
      return false // Session invalid
    }

    // Track IP and User Agent changes for analytics (no logout enforcement)
    const userAgent = request.headers.get("user-agent") || "Unknown"
    const needsUpdate = (session.ip_address && currentIP !== session.ip_address && currentIP !== "unknown") ||
                       (session.user_agent && session.user_agent !== userAgent)
    
    if (needsUpdate) {
      console.log(`[v0] Session data changed for user ${session.user_id}:`)
      if (session.ip_address && currentIP !== session.ip_address) {
        console.log(`  IP: ${session.ip_address} -> ${currentIP}`)
      }
      if (session.user_agent && session.user_agent !== userAgent) {
        console.log(`  User Agent: ${session.user_agent} -> ${userAgent}`)
      }
      
      // Update session data for tracking purposes
      try {
        const updateData: any = {
          last_accessed: new Date().toISOString()
        }
        
        if (currentIP !== "unknown") {
          updateData.ip_address = currentIP
        }
        if (userAgent !== "Unknown") {
          updateData.user_agent = userAgent
        }
        
        await supabase
          .from("user_sessions")
          .update(updateData)
          .eq("id", session.id)
        console.log(`[v0] Updated session data for tracking`)
      } catch (updateError) {
        console.warn("[v0] Failed to update session data:", updateError)
      }
    }

    return true // Session still valid
  } catch (error) {
    console.error("[v0] IP check error:", error)
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
          domain: request.nextUrl.hostname,
          secure: true,
          sameSite: "strict"
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

  // Handle root route
  if (pathname === "/") {
    if (isAuthenticated) {
      const response = NextResponse.redirect(new URL("/tool", request.url))
      response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
      return response
    } else {
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.headers.set("x-redirect-count", (parseInt(redirectCount) + 1).toString())
      return response
    }
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
