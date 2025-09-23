import { type NextRequest, NextResponse } from "next/server"

// GET /api/settings/data-retention - fetch retention policy
export async function GET() {
  try {
    const retentionData = {
      activityLogs: "12_months",
      paymentHistory: "7_years",
      teamData: "5_years",
      personalData: "indefinite",
      autoDeleteInactive: false,
      inactivityPeriod: "24_months",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: retentionData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch data retention policy" }, { status: 500 })
  }
}

// PUT /api/settings/data-retention - update retention policy
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { activityLogs, paymentHistory, teamData, personalData, autoDeleteInactive, inactivityPeriod } = body

    const updatedData = {
      activityLogs: activityLogs || "12_months",
      paymentHistory: paymentHistory || "7_years",
      teamData: teamData || "5_years",
      personalData: personalData || "indefinite",
      autoDeleteInactive: autoDeleteInactive || false,
      inactivityPeriod: inactivityPeriod || "24_months",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Data retention policy updated successfully",
      data: updatedData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update data retention policy" }, { status: 500 })
  }
}
