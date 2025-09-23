import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const level = searchParams.get("level") || "all"

    // Mock team members data
    const allMembers = [
      {
        id: "USR-2024-045",
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
      },
      {
        id: "USR-2024-032",
        name: "Michael Chen",
        email: "michael.chen@example.com",
        phone: "+234 803 456 7890",
        joinDate: "2023-11-22",
        level: 4,
        status: "active",
        directRecruits: 6,
        totalNetwork: 24,
        monthlyEarnings: 72000,
        totalEarnings: 380000,
        lastActivity: "2024-01-19",
        avatar: null,
      },
      {
        id: "USR-2024-067",
        name: "Aisha Okafor",
        email: "aisha.okafor@example.com",
        phone: "+234 804 567 8901",
        joinDate: "2024-02-08",
        level: 3,
        status: "active",
        directRecruits: 4,
        totalNetwork: 16,
        monthlyEarnings: 68000,
        totalEarnings: 285000,
        lastActivity: "2024-01-21",
        avatar: null,
      },
      {
        id: "USR-2024-089",
        name: "David Okonkwo",
        email: "david.okonkwo@example.com",
        phone: "+234 805 678 9012",
        joinDate: "2023-12-10",
        level: 6,
        status: "inactive",
        directRecruits: 12,
        totalNetwork: 45,
        monthlyEarnings: 0,
        totalEarnings: 520000,
        lastActivity: "2024-01-05",
        avatar: null,
      },
      {
        id: "USR-2024-123",
        name: "Grace Adebayo",
        email: "grace.adebayo@example.com",
        phone: "+234 806 789 0123",
        joinDate: "2024-01-28",
        level: 2,
        status: "active",
        directRecruits: 2,
        totalNetwork: 8,
        monthlyEarnings: 45000,
        totalEarnings: 125000,
        lastActivity: "2024-01-20",
        avatar: null,
      },
    ]

    // Apply filters
    const filteredMembers = allMembers.filter((member) => {
      const matchesSearch =
        search === "" ||
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())

      const matchesStatus = status === "all" || member.status === status
      const matchesLevel = level === "all" || member.level.toString() === level

      return matchesSearch && matchesStatus && matchesLevel
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMembers = filteredMembers.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        members: paginatedMembers,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredMembers.length / limit),
          totalItems: filteredMembers.length,
          itemsPerPage: limit,
          hasNext: endIndex < filteredMembers.length,
          hasPrev: page > 1,
        },
        filters: {
          search,
          status,
          level,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch team members" }, { status: 500 })
  }
}
