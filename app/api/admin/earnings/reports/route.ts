import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get("dateRange") || "2024-01-01:2024-03-31"
    const [startDate, endDate] = dateRange.split(":")

    const report = {
      dateRange: { startDate, endDate },
      summary: {
        totalCommissions: 892650,
        totalPayouts: 756420,
        pendingPayouts: 136230,
        activeUsers: 1247,
        topEarners: [
          { userId: "USR-005", name: "David Brown", earnings: 203580 },
          { userId: "USR-003", name: "Mike Johnson", earnings: 156720 },
          { userId: "USR-001", name: "John Doe", earnings: 125840 },
        ],
      },
      commissionBreakdown: {
        directSales: 356780,
        teamCommission: 267890,
        bonuses: 145620,
        overrides: 122360,
      },
      payoutMethods: {
        bankTransfer: 456320,
        paypal: 189650,
        crypto: 110450,
      },
      monthlyTrend: [
        { month: "Jan", commissions: 298450, payouts: 245680 },
        { month: "Feb", commissions: 312780, payouts: 267890 },
        { month: "Mar", commissions: 281420, payouts: 242850 },
      ],
    }

    return NextResponse.json(report)
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate earnings report" }, { status: 500 })
  }
}
