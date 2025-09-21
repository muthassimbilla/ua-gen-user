import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

interface BlacklistRequest {
  userAgent: string
  reason?: string
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

    // Check if user is admin
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "অ্যাডমিন অনুমতি প্রয়োজন" }, { status: 403 })
    }

    const body: BlacklistRequest = await request.json()
    const { userAgent, reason } = body

    if (!userAgent) {
      return NextResponse.json({ error: "ইউজার এজেন্ট প্রয়োজন" }, { status: 400 })
    }

    // Add to blacklist
    const { error: blacklistError } = await supabase.from("blacklisted_user_agents").insert({
      user_agent: userAgent,
      reason: reason || "অ্যাডমিন দ্বারা ব্ল্যাকলিস্ট করা হয়েছে",
      added_by: user.id,
    })

    if (blacklistError) {
      if (blacklistError.code === "23505") {
        // Unique constraint violation
        return NextResponse.json({ error: "এই ইউজার এজেন্ট ইতিমধ্যে ব্ল্যাকলিস্টে রয়েছে" }, { status: 409 })
      }
      return NextResponse.json({ error: "ব্ল্যাকলিস্ট করতে ব্যর্থ" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "ইউজার এজেন্ট সফলভাবে ব্ল্যাকলিস্ট করা হয়েছে",
    })
  } catch (error) {
    console.error("Blacklist API error:", error)
    return NextResponse.json({ error: "ব্ল্যাকলিস্ট করতে ব্যর্থ" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Get blacklisted user agents
    const { data: blacklist, error: blacklistError } = await supabase
      .from("blacklisted_user_agents")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (blacklistError) {
      return NextResponse.json({ error: "ব্ল্যাকলিস্ট লোড করতে ব্যর্থ" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      blacklist: blacklist || [],
    })
  } catch (error) {
    console.error("Blacklist GET API error:", error)
    return NextResponse.json({ error: "ব্ল্যাকলিস্ট পেতে ব্যর্থ" }, { status: 500 })
  }
}
