import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { full_name, telegram_username, key } = await request.json()

    // Validate input
    if (!full_name || !telegram_username || !key) {
      return NextResponse.json({ success: false, message: "সব ফিল্ড পূরণ করুন" }, { status: 400 })
    }

    // Clean telegram username
    const cleanUsername = telegram_username.replace("@", "")

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Validate the key
    // 3. Insert into database
    // 4. Check if key should be auto-approved

    // For demo purposes, we'll simulate the process
    const isAutoApproved = key === "DEMO_KEY" // Demo key for testing

    // Simulate database insertion
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      telegram_username: cleanUsername,
      full_name,
      key_value: key,
      status: isAutoApproved ? "approved" : "pending",
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: isAutoApproved ? "অ্যাকাউন্ট সফলভাবে তৈরি এবং অনুমোদিত হয়েছে" : "অ্যাকাউন্ট তৈরি হয়েছে, অনুমোদনের অপেক্ষায়",
      approved: isAutoApproved,
      user: userData,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, message: "সার্ভার ত্রুটি ঘটেছে" }, { status: 500 })
  }
}
