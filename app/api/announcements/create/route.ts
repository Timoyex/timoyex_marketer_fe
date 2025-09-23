export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Mock create response
    const newAnnouncement = {
      id: Math.floor(Math.random() * 10000),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      readCount: 0,
    }

    return Response.json(
      {
        success: true,
        message: "Announcement created successfully",
        data: newAnnouncement,
      },
      { status: 201 },
    )
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create announcement" }, { status: 500 })
  }
}
