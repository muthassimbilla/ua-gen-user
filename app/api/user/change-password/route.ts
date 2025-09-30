import { NextRequest, NextResponse } from "next/server"
import { supabase, isSupabaseAvailable } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Change password API called")

    if (!isSupabaseAvailable()) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      )
    }

    // Get session token from request
    const sessionToken = request.headers.get("authorization")?.replace("Bearer ", "")
    
    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 401 }
      )
    }

    // Get user from session token
    const { data: sessionData, error: sessionError } = await supabase
      .from("user_sessions")
      .select("user_id")
      .eq("session_token", sessionToken)
      .single()

    if (sessionError || !sessionData) {
      console.error("[v0] Session not found:", sessionError)
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    const userId = sessionData.user_id

    // Get user data
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, password_hash, account_status, is_approved")
      .eq("id", userId)
      .single()

    if (userError || !user) {
      console.error("[v0] User not found:", userError)
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if account is active
    if (user.account_status !== "active") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 }
      )
    }

    if (!user.is_approved) {
      return NextResponse.json(
        { error: "Account is not approved" },
        { status: 403 }
      )
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash)
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Hash new password
    const saltRounds = 12
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

    // Update password in database
    const { error: updateError } = await supabase
      .from("users")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)

    if (updateError) {
      console.error("[v0] Password update error:", updateError)
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }

    console.log("[v0] Password updated successfully for user:", userId)

    return NextResponse.json({
      success: true,
      message: "Password changed successfully"
    })

  } catch (error: any) {
    console.error("[v0] Change password error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
