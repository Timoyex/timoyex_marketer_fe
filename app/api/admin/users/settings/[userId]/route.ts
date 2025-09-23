import { type NextRequest, NextResponse } from "next/server"

// GET /api/admin/users/settings/{userId} - fetch a user's settings
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    // Mock user settings data
    const userSettings = {
      userId,
      appearance: {
        theme: "light",
      },
      preferences: {
        language: "en",
        timezone: "Africa/Lagos",
        currency: "NGN",
      },
      notifications: {
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
      },
      dataRetention: {
        activityLogs: "12_months",
        paymentHistory: "7_years",
        teamData: "5_years",
        personalData: "indefinite",
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: userSettings,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch user settings" }, { status: 500 })
  }
}

// PUT /api/admin/users/settings/{userId} - update a user's settings
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params
    const body = await request.json()

    // Mock update response
    const updatedSettings = {
      userId,
      ...body,
      lastUpdated: new Date().toISOString(),
      updatedBy: "admin",
    }

    return NextResponse.json({
      success: true,
      message: `Settings updated for user ${userId}`,
      data: updatedSettings,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update user settings" }, { status: 500 })
  }
}
