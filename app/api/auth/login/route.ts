import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { telegram_username, key } = await request.json()

    // Validate input
    if (!telegram_username || !key) {
      return NextResponse.json({ success: false, message: "Telegram Username এবং Key প্রয়োজন" }, { status: 400 })
    }

    // Clean telegram username
    const cleanUsername = telegram_username.replace("@", "")

    // Here you would typically:
    // 1. Query database for user
    // 2. Verify key
    // 3. Check if user is approved
    // 4. Check key expiry
    // 5. Update last login and IP

    // For demo purposes, we'll simulate the process
    const isValidKey = key === "DEMO_KEY" || key.length >= 6

    if (!isValidKey) {
      return NextResponse.json({ success: false, message: "অবৈধ Key" }, { status: 401 })
    }

    // Simulate user data
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      telegram_username: cleanUsername,
      full_name: "Demo User",
      status: "approved",
      current_ip: request.ip || "127.0.0.1",
      key_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      last_login_at: new Date().toISOString(),
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userData.id,
        username: userData.telegram_username,
        status: userData.status,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      message: "সফলভাবে লগইন হয়েছে",
      token,
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "লগইন ব্যর্থ হয়েছে" }, { status: 500 })
  }
}
