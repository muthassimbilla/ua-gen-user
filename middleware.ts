import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (record.count >= limit) {
    return true
  }

  record.count++
  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const rateLimitKey = getRateLimitKey(ip, pathname)

    // Different limits for different endpoints
    let limit = 100 // Default: 100 requests per minute
    const windowMs = 60 * 1000 // 1 minute

    if (pathname.includes("/auth/")) {
      limit = 5 // Auth endpoints: 5 requests per minute
    } else if (pathname.includes("/admin/")) {
      limit = 20 // Admin endpoints: 20 requests per minute
    }

    if (isRateLimited(rateLimitKey, limit, windowMs)) {
      return NextResponse.json({ error: "অনেক বেশি অনুরোধ। কিছুক্ষণ পর চেষ্টা করুন।" }, { status: 429 })
    }
  }

  // Security headers
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Log suspicious activity
  if (pathname.includes("/admin/") && !pathname.includes("/admin/login")) {
    console.log(`[v0] Admin access attempt from IP: ${ip}, Path: ${pathname}`)
  }

  return response
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*", "/dashboard/:path*"],
}
