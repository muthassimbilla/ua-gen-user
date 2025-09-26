import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Environment variables not configured"
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get pending users
    const { data: pendingUsers, error } = await supabase
      .from("users")
      .select("id, full_name, telegram_username, account_status, is_approved, created_at")
      .eq("is_approved", false)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({
        success: false,
        error: "Failed to fetch pending users",
        details: error.message
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        users: pendingUsers || [],
        count: pendingUsers?.length || 0
      }
    })

  } catch (error: any) {
    console.error("[v0] Fetch pending users error:", error)
    return NextResponse.json({
      success: false,
      error: "Failed to fetch pending users",
      details: error.message
    })
  }
}
