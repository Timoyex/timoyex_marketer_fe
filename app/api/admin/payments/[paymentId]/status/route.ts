import { NextResponse } from "next/server"

export async function PUT(request: Request, { params }: { params: { paymentId: string } }) {
  try {
    const { paymentId } = params
    const body = await request.json()
    const { status } = body

    if (!["Approved", "Rejected", "Processing", "Completed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 })
    }

    // Mock updated payment object
    const updatedPayment = {
      id: paymentId,
      amount: 6720,
      method: "Bank Transfer",
      date: "2024-03-15",
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: "admin-001",
    }

    return NextResponse.json({
      message: `Payment ${paymentId} status updated to ${status}`,
      payment: updatedPayment,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 })
  }
}
