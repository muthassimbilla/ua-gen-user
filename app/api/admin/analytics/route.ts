import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      return NextResponse.json({ error: "অবৈধ টোকেন" }, { status: 401 })
    }

    // Mock analytics data - In production, calculate from Supabase
    const analytics = {
      totalUsers: 150,
      activeUsers: 120,
      pendingApprovals: 5,
      expiredKeys: 25,
      todayLogins: 45,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 })
  }
}
