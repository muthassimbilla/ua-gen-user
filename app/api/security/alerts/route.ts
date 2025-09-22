import { type NextRequest, NextResponse } from "next/server"
import { SecurityUtils } from "@/lib/security"

export async function POST(request: NextRequest) {
  try {
    const { event, details } = await request.json()
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Log security event
    SecurityUtils.logSecurityEvent(event, details, ip)

    // In production, you might want to:
    // 1. Store in database
    // 2. Send notifications to admins
    // 3. Trigger automated responses

    return NextResponse.json({
      success: true,
      message: "Security alert logged",
    })
  } catch (error) {
    console.error("Security alert error:", error)
    return NextResponse.json({ error: "Failed to log security alert" }, { status: 500 })
  }
}
