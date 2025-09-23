import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock user profile data
    const userProfile = {
      id: "USR-2024-001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
      status: "active",
      level: 7,
      joinDate: "2023-06-15",
      avatar: "/professional-headshot.png",
      badges: ["Top Recruiter", "Level 7"],
      earningsSummary: {
        totalEarned: 2850000,
        monthlyRevenue: 450000,
        pendingPayments: 125000,
        lastPayout: 320000,
      },
      preferences: {
        currency: "NGN",
        timezone: "Africa/Lagos",
        language: "en",
      },
    }

    return NextResponse.json({
      success: true,
      data: userProfile,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user profile" }, { status: 500 })
  }
}
