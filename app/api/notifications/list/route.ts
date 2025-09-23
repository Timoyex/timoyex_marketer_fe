export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Mock notifications data
    const allNotifications = [
      {
        id: 1,
        title: "Commission Payment Processed",
        message: "Your commission of ₦45,000 has been processed and will be credited within 24 hours.",
        type: "payment",
        priority: "high",
        isRead: false,
        createdAt: "2024-01-15T14:30:00Z",
        actionUrl: "/earnings",
      },
      {
        id: 2,
        title: "New Team Member Joined",
        message: "Sarah Johnson has joined your team using your referral link.",
        type: "team",
        priority: "medium",
        isRead: false,
        createdAt: "2024-01-15T12:15:00Z",
        actionUrl: "/team",
      },
      {
        id: 3,
        title: "Level Up Achievement",
        message: "Congratulations! You've reached Level 6 and unlocked new benefits.",
        type: "achievement",
        priority: "high",
        isRead: true,
        createdAt: "2024-01-14T16:45:00Z",
        actionUrl: "/overview",
      },
      {
        id: 4,
        title: "Weekly Performance Report",
        message: "Your weekly performance report is now available for review.",
        type: "report",
        priority: "low",
        isRead: true,
        createdAt: "2024-01-14T09:00:00Z",
        actionUrl: "/earnings",
      },
      {
        id: 5,
        title: "Profile Update Required",
        message: "Please update your bank details to ensure smooth payment processing.",
        type: "profile",
        priority: "medium",
        isRead: false,
        createdAt: "2024-01-13T11:20:00Z",
        actionUrl: "/profile",
      },
    ]

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedNotifications = allNotifications.slice(startIndex, endIndex)

    return Response.json({
      success: true,
      data: {
        notifications: paginatedNotifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allNotifications.length / limit),
          totalItems: allNotifications.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < allNotifications.length,
          hasPreviousPage: page > 1,
        },
        unreadCount: allNotifications.filter((n) => !n.isRead).length,
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}
