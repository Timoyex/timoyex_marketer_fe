import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock single member data
    const member = {
      id: id,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      phone: "+234 802 345 6789",
      joinDate: "2024-01-15",
      level: 5,
      status: "active",
      directRecruits: 8,
      totalNetwork: 32,
      monthlyEarnings: 85000,
      totalEarnings: 420000,
      lastActivity: "2024-01-20",
      avatar: null,
      address: {
        street: "123 Victoria Island",
        city: "Lagos",
        state: "Lagos State",
        country: "Nigeria",
      },
      bankDetails: {
        bankName: "First Bank of Nigeria",
        accountNumber: "1234567890",
        accountName: "Sarah Johnson",
      },
      performance: {
        monthlyTarget: 100000,
        achievement: 85,
        rank: 3,
        badges: ["Top Performer", "Level 5"],
      },
      recentActivity: [
        {
          id: "ACT-001",
          type: "recruitment",
          description: "Recruited new member: John Smith",
          date: "2024-01-20",
          amount: 15000,
        },
        {
          id: "ACT-002",
          type: "earning",
          description: "Commission earned from team sales",
          date: "2024-01-19",
          amount: 25000,
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: member,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch member details" }, { status: 500 })
  }
}
