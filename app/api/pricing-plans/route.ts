import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Pricing plans GET request")
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "landing"
    
    console.log("[v0] Fetching plans for type:", type)

    // For admin panel, we need to fetch all plans (including inactive)
    // For public pages, we only fetch active plans
    const isAdminRequest = request.headers.get("referer")?.includes("/adminbilla")
    
    let query = supabase
      .from("pricing_plans")
      .select("*")
      .eq("plan_type", type)
      .order("display_order", { ascending: true })

    if (!isAdminRequest) {
      query = query.eq("is_active", true)
    }

    const { data: plans, error } = await query

    if (error) {
      console.error("[v0] Error fetching pricing plans:", error)
      return NextResponse.json({ 
        error: "Failed to fetch pricing plans", 
        details: error.message 
      }, { status: 500 })
    }

    console.log("[v0] Plans fetched successfully:", plans?.length || 0)
    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()

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
    const supabase = await createClient()

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
    const supabase = await createClient()

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
