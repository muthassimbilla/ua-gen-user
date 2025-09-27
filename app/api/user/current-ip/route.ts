import { type NextRequest, NextResponse } from "next/server"
import { validateServerSession } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "অননুমোদিত অ্যাক্সেস" }, { status: 401 })
    }

    const sessionData = await validateServerSession(sessionToken)
    if (!sessionData) {
      return NextResponse.json({ error: "অবৈধ সেশন" }, { status: 401 })
    }

    // Get IP from headers (considering proxy/load balancer)
    const forwarded = request.headers.get("x-forwarded-for")
    const realIP = request.headers.get("x-real-ip")
    let clientIP = forwarded?.split(",")[0] || realIP || request.ip || "unknown"
    
    // If we get localhost IP, try to get real IP from external service
    if (clientIP === "::1" || clientIP === "127.0.0.1" || clientIP === "unknown") {
      try {
        const response = await fetch("https://api.ipify.org?format=json", {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        if (response.ok) {
          const data = await response.json()
          if (data.ip) {
            clientIP = data.ip
          }
        }
      } catch (error) {
        console.warn("External IP detection failed:", error)
        // Keep the original IP if external detection fails
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ip: clientIP,
        user_id: sessionData.user.id,
      },
    })
  } catch (error) {
    console.error("[v0] Current IP API error:", error)
    return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 })
  }
}
