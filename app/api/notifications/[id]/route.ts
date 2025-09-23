export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Mock single notification data
    const notification = {
      id: id,
      title: "Commission Payment Processed",
      message:
        "Your commission of ₦45,000 has been processed and will be credited within 24 hours. This payment includes your direct sales commission and team bonuses for the period January 1-15, 2024.",
      type: "payment",
      priority: "high",
      isRead: false,
      createdAt: "2024-01-15T14:30:00Z",
      actionUrl: "/earnings",
      metadata: {
        amount: 45000,
        currency: "NGN",
        period: "January 1-15, 2024",
        paymentMethod: "Bank Transfer",
      },
    }

    return Response.json({
      success: true,
      data: notification,
    })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch notification" }, { status: 500 })
  }
}
