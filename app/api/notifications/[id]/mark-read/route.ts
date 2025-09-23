export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Mock mark as read response
    return Response.json({
      success: true,
      message: `Notification ${id} marked as read`,
      data: {
        id: id,
        isRead: true,
        readAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to mark notification as read" }, { status: 500 })
  }
}
