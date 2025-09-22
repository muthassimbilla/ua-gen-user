import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock security alerts data
const mockAlerts = [
  {
    id: "1",
    type: "failed_login",
    message: "একই IP থেকে ৫ বার ব্যর্থ লগইন চেষ্টা",
    ip_address: "192.168.1.100",
    created_at: new Date().toISOString(),
    severity: "high",
  },
  {
    id: "2",
    type: "suspicious_activity",
    message: "অস্বাভাবিক সময়ে লগইন কার্যকলাপ",
    ip_address: "10.0.0.50",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    severity: "medium",
  },
  {
    id: "3",
    type: "multiple_devices",
    message: "একই অ্যাকাউন্ট একাধিক ডিভাইস থেকে ব্যবহার",
    ip_address: "172.16.0.25",
    created_at: new Date(Date.now() - 7200000).toISOString(),
    severity: "low",
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

    return NextResponse.json({ alerts: mockAlerts })
  } catch (error) {
    return NextResponse.json({ error: "অবৈধ টোকেন" }, { status: 401 })
  }
}
