import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // In production, use hashed passwords
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json({ error: "ভুল ইউজারনেম বা পাসওয়ার্ড" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign({ username, role: "admin" }, process.env.JWT_SECRET || "fallback-secret", {
      expiresIn: "24h",
    })

    return NextResponse.json({ token, message: "সফলভাবে লগইন হয়েছে" })
  } catch (error) {
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 })
  }
}
