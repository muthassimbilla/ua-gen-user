import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Here you would typically query the database to get fresh user data
      // For demo purposes, we'll return mock data
      const userData = {
        id: decoded.userId,
        telegram_username: decoded.username,
        full_name: "Demo User",
        status: decoded.status,
        current_ip: request.ip || "127.0.0.1",
        key_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_login_at: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        user: userData,
      })
    } catch (jwtError) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
