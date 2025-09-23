import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const allEarnings = [
      { userId: "USR-001", name: "John Doe", totalEarned: 125840, pendingWithdrawals: 8500, lastPayout: "2024-03-15" },
      { userId: "USR-002", name: "Jane Smith", totalEarned: 98650, pendingWithdrawals: 6200, lastPayout: "2024-03-14" },
      {
        userId: "USR-003",
        name: "Mike Johnson",
        totalEarned: 156720,
        pendingWithdrawals: 12800,
        lastPayout: "2024-03-13",
      },
      {
        userId: "USR-004",
        name: "Sarah Wilson",
        totalEarned: 87430,
        pendingWithdrawals: 5600,
        lastPayout: "2024-03-12",
      },
      {
        userId: "USR-005",
        name: "David Brown",
        totalEarned: 203580,
        pendingWithdrawals: 15200,
        lastPayout: "2024-03-11",
      },
    ]

    let filteredEarnings = allEarnings
    if (userId) {
      filteredEarnings = allEarnings.filter((earning) => earning.userId === userId)
    }

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedEarnings = filteredEarnings.slice(startIndex, endIndex)

    const response = {
      data: paginatedEarnings,
      pagination: {
        page,
        limit,
        total: filteredEarnings.length,
        totalPages: Math.ceil(filteredEarnings.length / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch admin earnings data" }, { status: 500 })
  }
}
