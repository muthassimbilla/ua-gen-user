import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "অনুমতি নেই" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    } catch (error) {
      return NextResponse.json({ error: "অবৈধ টোকেন" }, { status: 401 })
    }

    const { userId, action } = await request.json()

    if (!userId || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "অবৈধ ডেটা" }, { status: 400 })
    }

    // In production, update in Supabase:
    // const { error } = await supabase
    //   .from('users')
    //   .update({
    //     status: action === 'approve' ? 'approved' : 'rejected',
    //     updated_at: new Date().toISOString()
    //   })
    //   .eq('id', userId)

    console.log(`[v0] User ${userId} ${action}d by admin`)

    return NextResponse.json({
      success: true,
      message: action === "approve" ? "ইউজার অনুমোদিত হয়েছে" : "ইউজার প্রত্যাখ্যাত হয়েছে",
    })
  } catch (error) {
    console.error("User action error:", error)
    return NextResponse.json({ error: "সার্ভার এরর" }, { status: 500 })
  }
}
