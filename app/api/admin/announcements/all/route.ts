export async function GET(request: Request) {
  try {
    // Mock admin announcements data
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
        readCount: 1247,
        targetAudience: "all",
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
        readCount: 892,
        targetAudience: "all",
      },
    ]

    return Response.json({
      success: true,
      data: {
        announcements: allAnnouncements,
        totalCount: allAnnouncements.length,
        activeCount: allAnnouncements.filter((a) => a.isActive).length,
        totalReads: allAnnouncements.reduce((sum, a) => sum + a.readCount, 0),
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch admin announcements" }, { status: 500 })
  }
}
