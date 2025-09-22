import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock device monitoring data
const mockDevices = [
  {
    user_id: "1",
    telegram_username: "user1",
    ip_addresses: ["192.168.1.100", "10.0.0.50"],
    device_count: 2,
    last_login: new Date().toISOString(),
  },
  {
    user_id: "2",
    telegram_username: "user2",
    ip_addresses: ["172.16.0.25"],
    device_count: 1,
    last_login: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    user_id: "3",
    telegram_username: "user3",
    ip_addresses: ["203.0.113.10", "198.51.100.20", "192.0.2.30"],
    device_count: 3,
    last_login: new Date(Date.now() - 7200000).toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")

    return NextResponse.json({ devices: mockDevices })
  } catch (error) {
    return NextResponse.json({ error: "অবৈধ টোকেন" }, { status: 401 })
  }
}
