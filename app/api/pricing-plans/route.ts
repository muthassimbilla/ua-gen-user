import { type NextRequest, NextResponse } from "next/server"
import { createBrowserClient } from "@supabase/ssr"

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (supabaseUrl && supabaseAnonKey) {
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "landing"

    const { data: plans, error } = await supabase
      .from("pricing_plans")
      .select("*")
      .eq("plan_type", type)
      .eq("is_active", true)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching pricing plans:", error)
      return NextResponse.json({ error: "Failed to fetch pricing plans" }, { status: 500 })
    }

    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("pricing_plans")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating pricing plan:", error)
      return NextResponse.json({ error: "Failed to update pricing plan" }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const body = await request.json()

    const { data, error } = await supabase.from("pricing_plans").insert(body).select().single()

    if (error) {
      console.error("[v0] Error creating pricing plan:", error)
      return NextResponse.json({ error: "Failed to create pricing plan" }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("pricing_plans").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting pricing plan:", error)
      return NextResponse.json({ error: "Failed to delete pricing plan" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
