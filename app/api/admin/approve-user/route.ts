import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { user_id, action } = await request.json()

    console.log("[v0] Admin action:", { user_id, action })

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Environment variables not configured"
      })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    if (action === "approve") {
      // Approve user
      const { data, error } = await supabase
        .from("users")
        .update({
          is_approved: true,
          account_status: "active",
          approved_at: new Date().toISOString()
        })
        .eq("id", user_id)
        .select()

      if (error) {
        return NextResponse.json({
          success: false,
          error: "Failed to approve user",
          details: error.message
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "User approved successfully",
          user: data[0]
        }
      })
    } else if (action === "reject") {
      // Reject user
      const { data, error } = await supabase
        .from("users")
        .update({
          is_approved: false,
          account_status: "suspended"
        })
        .eq("id", user_id)
        .select()

      if (error) {
        return NextResponse.json({
          success: false,
          error: "Failed to reject user",
          details: error.message
        })
      }

      return NextResponse.json({
        success: true,
        data: {
          message: "User rejected successfully",
          user: data[0]
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid action. Use 'approve' or 'reject'"
      })
    }

  } catch (error: any) {
    console.error("[v0] Admin action error:", error)
    return NextResponse.json({
      success: false,
      error: "Admin action failed",
      details: error.message
    })
  }
}
