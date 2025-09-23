export async function DELETE(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    // Mock clear notifications response
    return Response.json({
      success: true,
      message: `All notifications cleared for user ${userId}`,
      data: {
        userId: userId,
        clearedCount: 12,
        clearedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to clear user notifications" }, { status: 500 })
  }
}
