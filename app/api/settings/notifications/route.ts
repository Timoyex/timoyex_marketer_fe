import { type NextRequest, NextResponse } from "next/server"

// GET /api/settings/notifications - fetch all notification preferences
export async function GET() {
  try {
    const notificationData = {
      email: {
        companyAnnouncements: true,
        teamUpdates: true,
        paymentAlerts: true,
        marketingEmails: false,
      },
      sms: {
        paymentAlerts: true,
        urgentUpdates: true,
      },
      inapp: {
        allNotifications: true,
        notificationSounds: true,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: notificationData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch notification settings" }, { status: 500 })
  }
}

// PUT /api/settings/notifications - update notification preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, sms, inapp } = body

    // Validate structure
    if (!email || !sms || !inapp) {
      return NextResponse.json({ success: false, error: "Invalid notification structure" }, { status: 400 })
    }

    const updatedData = {
      email,
      sms,
      inapp,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
      data: updatedData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update notification preferences" }, { status: 500 })
  }
}
