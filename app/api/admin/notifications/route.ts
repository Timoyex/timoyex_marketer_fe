import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    let query = supabase
      .from("admin_notifications")
      .select(`
        *,
        marketers (name, level, team_revenue, monthly_revenue)
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status !== "all") {
      query = query.eq("status", status)
    }

    const { data: notifications, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
    }

    // Get counts for different notification types
    const { data: counts } = await supabase.from("admin_notifications").select("status, type")

    const notificationCounts = {
      total: counts?.length || 0,
      unread: counts?.filter((n) => n.status === "unread").length || 0,
      payment_qualification: counts?.filter((n) => n.type === "payment_qualification").length || 0,
      level_promotion: counts?.filter((n) => n.type === "level_promotion").length || 0,
    }

    return NextResponse.json({
      notifications,
      counts: notificationCounts,
    })
  } catch (error) {
    console.error("Admin notifications API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { notificationIds, status } = await request.json()

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const { error } = await supabase
      .from("admin_notifications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .in("id", notificationIds)

    if (error) {
      return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin notifications PATCH error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create new notification
export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    const { data: notification, error } = await supabase
      .from("admin_notifications")
      .insert({
        ...notificationData,
        status: "unread",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    return NextResponse.json({ notification })
  } catch (error) {
    console.error("Admin notifications POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
