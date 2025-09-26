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
    const clientIP = forwarded?.split(",")[0] || realIP || request.ip || "unknown"

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
