import { NextResponse } from "next/server"

export async function GET() {
  try {
    const platformEarnings = {
      totalPlatformEarnings: 45000000,
      monthlyEarnings: 8500000,
      totalUsers: 1250,
      activeUsers: 1180,
      totalPayouts: 38000000,
      pendingPayouts: 2800000,
      topEarners: [
        { id: "USR-2024-001", name: "John Doe", earnings: 2850000 },
        { id: "USR-2024-045", name: "Sarah Johnson", earnings: 2420000 },
        { id: "USR-2024-032", name: "Michael Chen", earnings: 2180000 },
      ],
      monthlyGrowth: {
        earnings: 18.5,
        users: 12.3,
        payouts: 15.7,
      },
    }

    return NextResponse.json({
      success: true,
      data: platformEarnings,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch platform earnings" }, { status: 500 })
  }
}
