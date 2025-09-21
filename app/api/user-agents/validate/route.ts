import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

interface ValidateRequest {
  userAgent: string
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    })

    const body: ValidateRequest = await request.json()
    const { userAgent } = body

    if (!userAgent) {
      return NextResponse.json(
        {
          valid: false,
          error: "ইউজার এজেন্ট প্রয়োজন",
        },
        { status: 400 },
      )
    }

    // Basic format validation
    const isValidFormat = /Mozilla\/\d+\.\d+/.test(userAgent) && userAgent.length > 50

    if (!isValidFormat) {
      return NextResponse.json({
        valid: false,
        error: "অবৈধ ইউজার এজেন্ট ফরম্যাট",
      })
    }

    // Check if blacklisted
    const { data: blacklisted, error: blacklistError } = await supabase
      .from("blacklisted_user_agents")
      .select("id, reason")
      .eq("user_agent", userAgent)
      .single()

    if (blacklistError && blacklistError.code !== "PGRST116") {
      return NextResponse.json(
        {
          valid: false,
          error: "ব্ল্যাকলিস্ট পরীক্ষা করতে ব্যর্থ",
        },
        { status: 500 },
      )
    }

    if (blacklisted) {
      return NextResponse.json({
        valid: false,
        error: `এই ইউজার এজেন্ট ব্ল্যাকলিস্টে রয়েছে: ${blacklisted.reason}`,
      })
    }

    // Extract platform and browser info
    const platformInfo = extractPlatformInfo(userAgent)

    return NextResponse.json({
      valid: true,
      userAgent,
      platformInfo,
      message: "বৈধ ইউজার এজেন্ট",
    })
  } catch (error) {
    console.error("Validate API error:", error)
    return NextResponse.json(
      {
        valid: false,
        error: "যাচাই করতে ব্যর্থ",
      },
      { status: 500 },
    )
  }
}

function extractPlatformInfo(userAgent: string) {
  const info: any = {
    platform: "unknown",
    browser: "unknown",
    version: "unknown",
    mobile: false,
  }

  // Detect platform
  if (userAgent.includes("Android")) {
    info.platform = "Android"
    const androidMatch = userAgent.match(/Android (\d+(?:\.\d+)?)/i)
    if (androidMatch) info.version = androidMatch[1]
  } else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
    info.platform = userAgent.includes("iPhone") ? "iOS" : "iPadOS"
    const iosMatch = userAgent.match(/OS (\d+(?:_\d+)?)/i)
    if (iosMatch) info.version = iosMatch[1].replace("_", ".")
  } else if (userAgent.includes("Windows")) {
    info.platform = "Windows"
  } else if (userAgent.includes("Mac OS")) {
    info.platform = "macOS"
  }

  // Detect browser
  if (userAgent.includes("Chrome")) {
    info.browser = "Chrome"
    const chromeMatch = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/i)
    if (chromeMatch) info.browserVersion = chromeMatch[1]
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    info.browser = "Safari"
  } else if (userAgent.includes("Firefox")) {
    info.browser = "Firefox"
  }

  // Detect mobile
  info.mobile = userAgent.includes("Mobile") || userAgent.includes("iPhone") || userAgent.includes("Android")

  return info
}
