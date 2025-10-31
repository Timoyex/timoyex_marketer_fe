import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const { referralCode, amount, productId, customerId } = await request.json()

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    // Find the marketer by referral code
    const { data: marketer, error: marketerError } = await supabase
      .from("marketers")
      .select("id, name, level")
      .eq("shopper_referral_code", referralCode)
      .single()

    if (marketerError || !marketer) {
      return NextResponse.json({ error: "Invalid referral code" }, { status: 400 })
    }

    // Record the sale
    const { data: sale, error: saleError } = await supabase
      .from("sales")
      .insert({
        marketer_id: marketer.id,
        referral_code: referralCode,
        amount: amount,
        product_id: productId,
        customer_id: customerId,
        status: "completed",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (saleError) {
      return NextResponse.json({ error: "Failed to record sale" }, { status: 500 })
    }

    // Update marketer's monthly revenue
    const { error: updateError } = await supabase
      .from("marketers")
      .update({
        monthly_revenue: supabase.raw("monthly_revenue + ?", [amount]),
        team_revenue: supabase.raw("team_revenue + ?", [amount]),
        updated_at: new Date().toISOString(),
      })
      .eq("id", marketer.id)

    if (updateError) {
      console.error("Failed to update marketer revenue:", updateError)
    }

    // Check if marketer now qualifies for payment
    const { data: updatedMarketer } = await supabase.from("marketers").select("*").eq("id", marketer.id).single()

    if (updatedMarketer) {
      const levelRequirements = [
        { level: 1, teamRevenue: 5000000, salary: 10000 },
        { level: 2, teamRevenue: 10000000, salary: 50000 },
        { level: 3, teamRevenue: 20000000, salary: 80000 },
        { level: 4, teamRevenue: 40000000, salary: 120000 },
        { level: 5, teamRevenue: 75000000, salary: 200000 },
        { level: 6, teamRevenue: 90000000, salary: 250000 },
        { level: 7, teamRevenue: 125000000, salary: 480000 },
        { level: 8, teamRevenue: 170000000, salary: 700000 },
        { level: 9, teamRevenue: 230000000, salary: 1000000 },
        { level: 10, teamRevenue: 380000000, salary: 1200000 },
      ]

      const currentLevelReq = levelRequirements[updatedMarketer.level - 1]
      const qualifiesForPayment = updatedMarketer.team_revenue >= currentLevelReq.teamRevenue

      if (qualifiesForPayment) {
        // Create admin notification
        await supabase.from("admin_notifications").insert({
          type: "payment_qualification",
          title: "Marketer Qualifies for Monthly Payment",
          message: `${updatedMarketer.name} (Level ${updatedMarketer.level}) now qualifies for ₦${currentLevelReq.salary.toLocaleString()} monthly payment with ₦${(updatedMarketer.team_revenue / 1000000).toFixed(1)}M team revenue.`,
          marketer_id: marketer.id,
          data: {
            marketer_name: updatedMarketer.name,
            level: updatedMarketer.level,
            team_revenue: updatedMarketer.team_revenue,
            salary_amount: currentLevelReq.salary,
            qualification_type: "monthly_payment",
          },
          status: "unread",
          created_at: new Date().toISOString(),
        })
      }
    }

    return NextResponse.json({
      success: true,
      sale: sale,
      marketer: marketer.name,
      amount: amount,
    })
  } catch (error) {
    console.error("Sales API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get real-time sales data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const marketerId = searchParams.get("marketerId")

    const cookieStore = cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    })

    if (marketerId) {
      // Get sales for specific marketer
      const { data: sales, error } = await supabase
        .from("sales")
        .select("*")
        .eq("marketer_id", marketerId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) {
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
      }

      return NextResponse.json({ sales })
    } else {
      // Get all recent sales for admin
      const { data: sales, error } = await supabase
        .from("sales")
        .select(`
          *,
          marketers (name, level)
        `)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
      }

      return NextResponse.json({ sales })
    }
  } catch (error) {
    console.error("Sales GET API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
