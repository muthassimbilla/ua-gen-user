import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

async function verifyAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Check if user is admin
  const { data: adminData } = await supabase.from("admins").select("*").eq("email", user.email).single()

  return adminData
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { data: plans, error } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("display_order", { ascending: true })

    if (error) {
      console.error("[v0] Database error fetching pricing plans:", error)
      return NextResponse.json(
        {
          error: "Failed to fetch pricing plans",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error("[v0] Unexpected error in pricing-plans admin API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("pricing_plans")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating pricing plan:", error)
      return NextResponse.json({ error: "Failed to update pricing plan", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    const { id, ...planData } = body
    const newPlan = {
      ...planData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("pricing_plans").insert(newPlan).select().single()

    if (error) {
      console.error("[v0] Error creating pricing plan:", error)
      return NextResponse.json({ error: "Failed to create pricing plan", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ plan: data })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const { error } = await supabase.from("pricing_plans").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting pricing plan:", error)
      return NextResponse.json({ error: "Failed to delete pricing plan", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Unexpected error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
