export async function PUT(request: Request) {
  try {
    // Mock mark all as read response
    return Response.json({
      success: true,
      message: "All notifications marked as read",
      data: {
        markedCount: 3,
        markedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to mark all notifications as read" }, { status: 500 })
  }
}
