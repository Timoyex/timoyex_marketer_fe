import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status || !["active", "inactive", "suspended"].includes(status)) {
      return NextResponse.json({ success: false, error: "Valid status is required" }, { status: 400 })
    }

    // Mock status update
    return NextResponse.json({
      success: true,
      message: `User status updated to ${status}`,
      data: { id, status, updatedAt: new Date().toISOString() },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user status" }, { status: 500 })
  }
}
