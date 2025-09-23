import { NextResponse } from "next/server"

export async function GET() {
  try {
    const earningsSummary = {
      totalRevenue: 2850000,
      monthlyRevenue: 450000,
      pendingPayments: 125000,
      commissions: {
        direct: 180000,
        indirect: 95000,
        bonus: 175000,
      },
      growth: {
        monthlyGrowth: 12.5,
        yearlyGrowth: 45.2,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: earningsSummary,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch earnings summary" }, { status: 500 })
  }
}
