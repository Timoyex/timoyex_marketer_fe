import { NextResponse } from "next/server"

export async function GET() {
  try {
    const teamStats = {
      directRecruits: 24,
      totalNetwork: 156,
      teamEarnings: 1250000,
      totalRevenue: 2850000,
      activeMembers: 142,
      inactiveMembers: 14,
      monthlyGrowth: {
        recruits: 8.5,
        earnings: 15.2,
      },
      topPerformers: [
        { id: "USR-2024-045", name: "Sarah Johnson", earnings: 85000 },
        { id: "USR-2024-032", name: "Michael Chen", earnings: 72000 },
        { id: "USR-2024-067", name: "Aisha Okafor", earnings: 68000 },
      ],
    }

    return NextResponse.json({
      success: true,
      data: teamStats,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch team stats" }, { status: 500 })
  }
}
