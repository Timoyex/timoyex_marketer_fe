import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Mock detailed user data for admin
    const user = {
      id: id,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+234 801 234 5678",
      status: "active",
      level: 7,
      joinDate: "2023-06-15",
      lastLogin: "2024-01-21",
      totalEarnings: 2850000,
      monthlyEarnings: 450000,
      teamStats: {
        directRecruits: 24,
        totalNetwork: 156,
        teamEarnings: 1250000,
      },
      recentActivities: [
        {
          id: "ACT-001",
          type: "recruitment",
          description: "Recruited new member",
          date: "2024-01-20",
        },
      ],
      paymentHistory: [
        {
          id: "PAY-2024-001",
          amount: 320000,
          status: "completed",
          date: "2024-01-15",
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: user,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user details" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    // Mock user update
    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: { id, ...body },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user" }, { status: 500 })
  }
}
