import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock data - In production, fetch from Supabase
const mockUsers = [
  {
    id: "1",
    telegram_username: "user1",
    status: "pending",
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    current_ip: "192.168.1.1",
    last_login: null,
  },
  {
    id: "2",
    telegram_username: "user2",
    status: "approved",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
    current_ip: "192.168.1.2",
    last_login: new Date().toISOString(),
  },
]

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

    // In production, fetch from Supabase:
    // const { data: users, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .order('created_at', { ascending: false })

    return NextResponse.json({
      success: true,
      users: mockUsers,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 })
  }
}
