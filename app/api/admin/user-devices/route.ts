import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/auth-server"

// Helper functions to extract device information from user agent
function extractDeviceName(userAgent: string): string {
  if (userAgent.includes("iPhone")) return "iPhone"
  if (userAgent.includes("iPad")) return "iPad"
  if (userAgent.includes("Android")) return "Android Device"
  if (userAgent.includes("Windows")) return "Windows PC"
  if (userAgent.includes("Mac")) return "Mac"
  if (userAgent.includes("Linux")) return "Linux PC"
  return "Unknown Device"
}

function extractBrowser(userAgent: string): string {
  if (userAgent.includes("Chrome")) return "Chrome"
  if (userAgent.includes("Firefox")) return "Firefox"
  if (userAgent.includes("Safari")) return "Safari"
  if (userAgent.includes("Edge")) return "Edge"
  if (userAgent.includes("Opera")) return "Opera"
  return "Unknown Browser"
}

function extractOS(userAgent: string): string {
  if (userAgent.includes("Windows NT 10.0")) return "Windows 10"
  if (userAgent.includes("Windows NT 6.3")) return "Windows 8.1"
  if (userAgent.includes("Windows NT 6.1")) return "Windows 7"
  if (userAgent.includes("Mac OS X")) return "macOS"
  if (userAgent.includes("Android")) return "Android"
  if (userAgent.includes("iPhone OS")) return "iOS"
  if (userAgent.includes("Linux")) return "Linux"
  return "Unknown OS"
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user devices
    const { data: devices, error: devicesError } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", userId)
      .order("last_seen", { ascending: false })

    console.log("Devices query result:", { devices, devicesError, userId })

    if (devicesError) {
      console.error("Error fetching user devices:", devicesError)
      return NextResponse.json({ error: "Failed to fetch user devices" }, { status: 500 })
    }

    // If no devices found in user_devices table, try to get from user_sessions
    let processedDevices = []
    
    if (!devices || devices.length === 0) {
      console.log("No devices found in user_devices table, checking user_sessions...")
      
      // Get sessions for this user
      const { data: sessions, error: sessionsError } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (sessionsError) {
        console.error("Error fetching user sessions:", sessionsError)
        return NextResponse.json({ error: "Failed to fetch user sessions" }, { status: 500 })
      }

      if (sessions && sessions.length > 0) {
        // Group sessions by device fingerprint
        const deviceMap = new Map()
        
        sessions.forEach(session => {
          const fingerprint = session.device_fingerprint || "unknown-device"
          
          if (!deviceMap.has(fingerprint)) {
            deviceMap.set(fingerprint, {
              device_fingerprint: fingerprint,
              device_name: session.user_agent ? extractDeviceName(session.user_agent) : "Unknown Device",
              browser_info: session.user_agent ? extractBrowser(session.user_agent) : "Unknown Browser",
              os_info: session.user_agent ? extractOS(session.user_agent) : "Unknown OS",
              screen_resolution: "Unknown",
              timezone: "Unknown",
              language: "Unknown",
              first_seen: session.created_at,
              last_seen: session.last_accessed || session.created_at,
              is_trusted: true,
              is_blocked: false,
              total_logins: 1,
              user_id: userId,
              sessions: [session]
            })
          } else {
            const device = deviceMap.get(fingerprint)
            device.total_logins += 1
            device.sessions.push(session)
            
            // Update last_seen to the most recent session
            if (new Date(session.last_accessed || session.created_at) > new Date(device.last_seen)) {
              device.last_seen = session.last_accessed || session.created_at
            }
          }
        })

        // Convert map to array
        processedDevices = Array.from(deviceMap.values())
        console.log("Created devices from sessions:", processedDevices.length)
      }
    } else {
      // Process existing devices
      processedDevices = await Promise.all(
        devices.map(async (device) => {
          // Get current IP addresses from active sessions
          const { data: activeSessions } = await supabase
            .from("user_sessions")
            .select("ip_address")
            .eq("user_id", userId)
            .eq("is_active", true)
            .eq("device_fingerprint", device.device_fingerprint)

          const currentIPs = activeSessions?.map(session => session.ip_address) || []

          // Get IP history for this device
          const { data: ipHistory } = await supabase
      .from("user_ip_history")
            .select("*")
            .eq("user_id", userId)
      .order("last_seen", { ascending: false })
            .limit(10)

          return {
            ...device,
            current_ips: [...new Set(currentIPs)], // Remove duplicates
            ip_history: ipHistory || []
          }
        })
      )
    }

    // Process devices to include IP information
    const finalProcessedDevices = await Promise.all(
      processedDevices.map(async (device) => {
        // Get current IP addresses from active sessions
        const { data: activeSessions } = await supabase
          .from("user_sessions")
          .select("ip_address")
          .eq("user_id", userId)
          .eq("is_active", true)
          .eq("device_fingerprint", device.device_fingerprint)

        const currentIPs = activeSessions?.map(session => session.ip_address) || []

        // Get IP history for this device
        const { data: ipHistory } = await supabase
          .from("user_ip_history")
          .select("*")
          .eq("user_id", userId)
          .order("last_seen", { ascending: false })
          .limit(10)

        return {
          ...device,
          current_ips: [...new Set(currentIPs)], // Remove duplicates
          ip_history: ipHistory || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: finalProcessedDevices
    })

  } catch (error) {
    console.error("Error in user-devices API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    const { action, user_id, device_fingerprint } = body

    if (!action || !user_id) {
      return NextResponse.json({ error: "Action and user_id are required" }, { status: 400 })
    }

    switch (action) {
      case "block_device":
        if (!device_fingerprint) {
          return NextResponse.json({ error: "Device fingerprint is required" }, { status: 400 })
        }
        
        const { error: blockError } = await supabase
          .from("user_devices")
          .update({ is_blocked: true })
          .eq("user_id", user_id)
          .eq("device_fingerprint", device_fingerprint)

        if (blockError) {
          return NextResponse.json({ error: "Failed to block device" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "Device blocked successfully"
        })

      case "unblock_device":
        if (!device_fingerprint) {
          return NextResponse.json({ error: "Device fingerprint is required" }, { status: 400 })
        }
        
        const { error: unblockError } = await supabase
          .from("user_devices")
          .update({ is_blocked: false })
          .eq("user_id", user_id)
          .eq("device_fingerprint", device_fingerprint)

        if (unblockError) {
          return NextResponse.json({ error: "Failed to unblock device" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "Device unblocked successfully"
        })

      case "logout_user_all_devices":
        const { error: logoutError } = await supabase
          .from("user_sessions")
          .update({ is_active: false, logout_reason: "admin_logout" })
          .eq("user_id", user_id)
          .eq("is_active", true)

        if (logoutError) {
          return NextResponse.json({ error: "Failed to logout user" }, { status: 500 })
        }

        return NextResponse.json({
          success: true,
          message: "User logged out from all devices successfully"
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

  } catch (error) {
    console.error("Error in user-devices POST API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}