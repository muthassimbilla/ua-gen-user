import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: "Unauthorized",
        status: "inactive",
        message: "User not authenticated"
      }, { status: 401 })
    }

    // Check user status in database
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, is_active, account_status, expiration_date")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ 
        error: "User not found",
        status: "inactive",
        message: "User not found in database"
      }, { status: 404 })
    }

    // Check if user is deactivated
    if (userData.account_status === "inactive") {
      return NextResponse.json({
        is_valid: false,
        status: "deactivated",
        message: "Your account has been deactivated. Please contact support."
      })
    }

    // Check if user is suspended
    if (userData.account_status === "suspended") {
      return NextResponse.json({
        is_valid: false,
        status: "suspended",
        message: "Your account has been suspended. Please contact support."
      })
    }

    // Check if user account is expired
    if (userData.expiration_date && new Date(userData.expiration_date) < new Date()) {
      return NextResponse.json({
        is_valid: false,
        status: "expired",
        message: "Your account has expired.",
        expiration_date: userData.expiration_date
      })
    }

    // User is active
    return NextResponse.json({
      is_valid: true,
      status: "active",
      message: "Your account is active."
    })

  } catch (error) {
    console.error("[v0] User status check error:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      status: "inactive",
      message: "Unable to verify account status"
    }, { status: 500 })
  }
}
