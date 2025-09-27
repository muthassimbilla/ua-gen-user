import { type NextRequest, NextResponse } from "next/server"
import { validateServerSession } from "@/lib/auth-server"
import { createServerSupabaseClient } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session_token")?.value

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 })
    }

    const sessionData = await validateServerSession(sessionToken)
    if (!sessionData) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const supabase = createServerSupabaseClient()

    // Get unique IP count for this user (device count)
    const { data: ipHistory, error: ipError } = await supabase
      .from("user_ip_history")
      .select("ip_address")
      .eq("user_id", sessionData.user.id)
      .eq("is_current", true)

    if (ipError) {
      console.error("Error fetching IP history:", ipError)
      return NextResponse.json({ error: "Failed to fetch device count" }, { status: 500 })
    }

    // Count unique IP addresses
    const uniqueIPs = new Set(ipHistory?.map(ip => ip.ip_address) || [])
    const deviceCount = uniqueIPs.size

    return NextResponse.json({
      success: true,
      data: {
        device_count: deviceCount,
        unique_ips: Array.from(uniqueIPs)
      }
    })

  } catch (error) {
    console.error("Error in device-count API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
