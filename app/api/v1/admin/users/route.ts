import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"

    // Mock admin users data
    const allUsers = [
      {
        id: "USR-2024-001",
        name: "John Doe",
        email: "john.doe@example.com",
        status: "active",
        level: 7,
        joinDate: "2023-06-15",
        totalEarnings: 2850000,
        teamSize: 156,
        lastLogin: "2024-01-21",
      },
      {
        id: "USR-2024-045",
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        status: "active",
        level: 5,
        joinDate: "2024-01-15",
        totalEarnings: 420000,
        teamSize: 32,
        lastLogin: "2024-01-20",
      },
      // Add more mock users as needed
    ]

    // Apply filters and pagination
    const filteredUsers = allUsers.filter((user) => {
      const matchesSearch =
        search === "" ||
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = status === "all" || user.status === status

      return matchesSearch && matchesStatus
    })

    const startIndex = (page - 1) * limit
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredUsers.length / limit),
          totalItems: filteredUsers.length,
          itemsPerPage: limit,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}
