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

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Get user's generation history
    const { data: history, error: historyError } = await supabase
      .from("user_agent_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (historyError) {
      return NextResponse.json({ error: "ইতিহাস লোড করতে ব্যর্থ" }, { status: 500 })
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from("user_agent_history")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (countError) {
      return NextResponse.json({ error: "মোট সংখ্যা গণনা করতে ব্যর্থ" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      history: history || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("History API error:", error)
    return NextResponse.json({ error: "ইতিহাস পেতে ব্যর্থ" }, { status: 500 })
  }
}
