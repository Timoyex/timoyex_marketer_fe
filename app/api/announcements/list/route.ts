export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Mock announcements data
    const allAnnouncements = [
      {
        id: 1,
        title: "New Commission Structure Update",
        content: "We're excited to announce improved commission rates for all levels starting next month.",
        type: "update",
        priority: "high",
        author: "Admin Team",
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
        isActive: true,
      },
      {
        id: 2,
        title: "Platform Maintenance Scheduled",
        content: "Scheduled maintenance will occur on Sunday from 2 AM to 4 AM UTC.",
        type: "maintenance",
        priority: "medium",
        author: "Technical Team",
        createdAt: "2024-01-14T15:30:00Z",
        updatedAt: "2024-01-14T15:30:00Z",
        isActive: true,
      },
      {
        id: 3,
        title: "Holiday Bonus Program",
        content: "Special holiday bonuses available for top performers this quarter.",
        type: "promotion",
        priority: "high",
        author: "Marketing Team",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        isActive: true,
      },
      {
        id: 4,
        title: "Training Webinar Series",
        content: "Join our weekly training sessions to improve your marketing skills.",
        type: "training",
        priority: "medium",
        author: "Training Team",
        createdAt: "2024-01-12T14:20:00Z",
        updatedAt: "2024-01-12T14:20:00Z",
        isActive: true,
      },
      {
        id: 5,
        title: "New Product Launch",
        content: "Exciting new products added to our catalog with higher commission rates.",
        type: "product",
        priority: "high",
        author: "Product Team",
        createdAt: "2024-01-11T11:45:00Z",
        updatedAt: "2024-01-11T11:45:00Z",
        isActive: true,
      },
    ]

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedAnnouncements = allAnnouncements.slice(startIndex, endIndex)

    return Response.json({
      success: true,
      data: {
        announcements: paginatedAnnouncements,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(allAnnouncements.length / limit),
          totalItems: allAnnouncements.length,
          itemsPerPage: limit,
          hasNextPage: endIndex < allAnnouncements.length,
          hasPreviousPage: page > 1,
        },
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch announcements" }, { status: 500 })
  }
}
