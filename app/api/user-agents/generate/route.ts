import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

interface GenerateRequest {
  platform: string
  appType: string
  quantity: number
  customOptions?: {
    androidVersion?: string
    iosVersion?: string
    chromeVersion?: string
  }
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

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "অননুমোদিত অ্যাক্সেস" }, { status: 401 })
    }

    // Get user profile and check limits
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "ব্যবহারকারীর প্রোফাইল পাওয়া যায়নি" }, { status: 404 })
    }

    if (profile.status !== "approved") {
      if (profile.status === "pending") {
        return NextResponse.json({ error: "আপনার অ্যাকাউন্ট এখনও অনুমোদনের অপেক্ষায় রয়েছে" }, { status: 403 })
      } else if (profile.status === "rejected") {
        return NextResponse.json({ error: "আপনার অ্যাকাউন্ট প্রত্যাখ্যাত হয়েছে" }, { status: 403 })
      } else if (profile.status === "suspended") {
        return NextResponse.json({ error: "আপনার অ্যাকাউন্ট স্থগিত করা হয়েছে" }, { status: 403 })
      }
      return NextResponse.json({ error: "আপনার অ্যাকাউন্ট অনুমোদিত নয়" }, { status: 403 })
    }

    const body: GenerateRequest = await request.json()
    const { platform, appType, quantity, customOptions } = body

    // Validate input
    if (!platform || !appType || !quantity || quantity < 1 || quantity > 1000) {
      return NextResponse.json({ error: "অবৈধ ইনপুট পরামিতি" }, { status: 400 })
    }

    // Check daily limits
    const today = new Date().toISOString().split("T")[0]
    const { data: todayUsage, error: usageError } = await supabase
      .from("user_agent_history")
      .select("quantity")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lt("created_at", `${today}T23:59:59.999Z`)

    if (usageError) {
      return NextResponse.json({ error: "ব্যবহারের তথ্য পরীক্ষা করতে ব্যর্থ" }, { status: 500 })
    }

    const dailyUsed = todayUsage?.reduce((sum, record) => sum + record.quantity, 0) || 0
    const dailyLimit =
      profile.subscription_type === "premium" ? 10000 : profile.subscription_type === "standard" ? 1000 : 100

    if (dailyUsed + quantity > dailyLimit) {
      return NextResponse.json(
        {
          error: `দৈনিক সীমা অতিক্রম করেছে। আজকের ব্যবহার: ${dailyUsed}/${dailyLimit}`,
        },
        { status: 429 },
      )
    }

    // Generate user agents
    const userAgents = generateUserAgents(platform, appType, quantity, customOptions)

    // Save to history
    const { error: historyError } = await supabase.from("user_agent_history").insert({
      user_id: user.id,
      platform,
      app_type: appType,
      quantity,
      user_agents: userAgents,
      custom_options: customOptions,
    })

    if (historyError) {
      console.error("History save error:", historyError)
      // Don't fail the request if history save fails
    }

    return NextResponse.json({
      success: true,
      userAgents,
      generated: userAgents.length,
      dailyUsed: dailyUsed + quantity,
      dailyLimit,
    })
  } catch (error) {
    console.error("Generate API error:", error)
    return NextResponse.json({ error: "ইউজার এজেন্ট তৈরি করতে ব্যর্থ" }, { status: 500 })
  }
}

function generateUserAgents(platform: string, appType: string, quantity: number, customOptions?: any): string[] {
  const userAgents: string[] = []

  const androidVersions = customOptions?.androidVersion
    ? [customOptions.androidVersion]
    : ["14", "13", "12", "11", "10", "9"]
  const iosVersions = customOptions?.iosVersion ? [customOptions.iosVersion] : ["17.0", "16.6", "16.5", "15.7", "15.6"]
  const chromeVersions = customOptions?.chromeVersion
    ? [customOptions.chromeVersion]
    : ["120.0.0.0", "119.0.0.0", "118.0.0.0", "117.0.0.0"]

  for (let i = 0; i < quantity; i++) {
    let userAgent = ""

    if (platform === "android") {
      const androidVersion = androidVersions[Math.floor(Math.random() * androidVersions.length)]
      const chromeVersion = chromeVersions[Math.floor(Math.random() * chromeVersions.length)]

      if (appType === "mobile") {
        userAgent = `Mozilla/5.0 (Linux; Android ${androidVersion}; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${chromeVersion} Mobile Safari/537.36`
      } else if (appType === "app") {
        userAgent = `Mozilla/5.0 (Linux; Android ${androidVersion}; SM-G973F wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/${chromeVersion} Mobile Safari/537.36`
      }
    } else if (platform === "ios") {
      const iosVersion = iosVersions[Math.floor(Math.random() * iosVersions.length)]

      if (appType === "mobile") {
        userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.replace(".", "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1`
      } else if (appType === "app") {
        userAgent = `Mozilla/5.0 (iPhone; CPU iPhone OS ${iosVersion.replace(".", "_")} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
      }
    }

    if (userAgent) {
      userAgents.push(userAgent)
    }
  }

  return userAgents
}
