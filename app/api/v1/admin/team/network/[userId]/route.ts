import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Mock network tree data
    const networkTree = {
      root: {
        id: userId,
        name: "John Doe",
        level: 7,
        directRecruits: 24,
        totalNetwork: 156,
        earnings: 2850000,
      },
      children: [
        {
          id: "USR-2024-045",
          name: "Sarah Johnson",
          level: 5,
          directRecruits: 8,
          totalNetwork: 32,
          earnings: 420000,
          children: [
            {
              id: "USR-2024-067",
              name: "Aisha Okafor",
              level: 3,
              directRecruits: 4,
              totalNetwork: 16,
              earnings: 285000,
              children: [],
            },
          ],
        },
        {
          id: "USR-2024-032",
          name: "Michael Chen",
          level: 4,
          directRecruits: 6,
          totalNetwork: 24,
          earnings: 380000,
          children: [],
        },
      ],
      stats: {
        totalLevels: 5,
        totalMembers: 156,
        totalEarnings: 2850000,
        averageLevel: 3.2,
      },
    }

    return NextResponse.json({
      success: true,
      data: networkTree,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch network tree" }, { status: 500 })
  }
}
