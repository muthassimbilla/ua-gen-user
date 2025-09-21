import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

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

    // Check if user is admin
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("user_id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "অ্যাডমিন অনুমতি প্রয়োজন" }, { status: 403 })
    }

    // Get various statistics
    const today = new Date().toISOString().split("T")[0]
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    // Total generations today
    const { data: todayStats } = await supabase
      .from("user_agent_history")
      .select("quantity")
      .gte("created_at", `${today}T00:00:00.000Z`)

    // Total generations this week
    const { data: weekStats } = await supabase
      .from("user_agent_history")
      .select("quantity")
      .gte("created_at", `${lastWeek}T00:00:00.000Z`)

    // Total generations this month
    const { data: monthStats } = await supabase
      .from("user_agent_history")
      .select("quantity")
      .gte("created_at", `${lastMonth}T00:00:00.000Z`)

    // Platform distribution
    const { data: platformStats } = await supabase
      .from("user_agent_history")
      .select("platform, quantity")
      .gte("created_at", `${lastMonth}T00:00:00.000Z`)

    // App type distribution
    const { data: appTypeStats } = await supabase
      .from("user_agent_history")
      .select("app_type, quantity")
      .gte("created_at", `${lastMonth}T00:00:00.000Z`)

    // Active users
    const { data: activeUsers } = await supabase
      .from("user_agent_history")
      .select("user_id")
      .gte("created_at", `${today}T00:00:00.000Z`)

    // Blacklisted count
    const { count: blacklistedCount } = await supabase
      .from("blacklisted_user_agents")
      .select("*", { count: "exact", head: true })

    // Calculate totals
    const todayTotal = todayStats?.reduce((sum, record) => sum + record.quantity, 0) || 0
    const weekTotal = weekStats?.reduce((sum, record) => sum + record.quantity, 0) || 0
    const monthTotal = monthStats?.reduce((sum, record) => sum + record.quantity, 0) || 0

    // Platform distribution
    const platformDistribution =
      platformStats?.reduce((acc: any, record) => {
        acc[record.platform] = (acc[record.platform] || 0) + record.quantity
        return acc
      }, {}) || {}

    // App type distribution
    const appTypeDistribution =
      appTypeStats?.reduce((acc: any, record) => {
        acc[record.app_type] = (acc[record.app_type] || 0) + record.quantity
        return acc
      }, {}) || {}

    // Unique active users today
    const uniqueActiveUsers = new Set(activeUsers?.map((record) => record.user_id)).size

    return NextResponse.json({
      success: true,
      stats: {
        generations: {
          today: todayTotal,
          week: weekTotal,
          month: monthTotal,
        },
        users: {
          activeToday: uniqueActiveUsers,
        },
        distribution: {
          platform: platformDistribution,
          appType: appTypeDistribution,
        },
        blacklisted: blacklistedCount || 0,
      },
    })
  } catch (error) {
    console.error("Admin stats API error:", error)
    return NextResponse.json({ error: "পরিসংখ্যান পেতে ব্যর্থ" }, { status: 500 })
  }
}
