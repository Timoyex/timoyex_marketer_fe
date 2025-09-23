import { type NextRequest, NextResponse } from "next/server"

// GET /api/settings/preferences - fetch language, timezone, currency
export async function GET() {
  try {
    const preferencesData = {
      language: "en",
      timezone: "Africa/Lagos",
      currency: "NGN",
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: preferencesData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch preferences" }, { status: 500 })
  }
}

// PUT /api/settings/preferences - update language, timezone, and currency
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { language, timezone, currency } = body

    // Basic validation
    if (!language || !timezone || !currency) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const updatedData = {
      language,
      timezone,
      currency,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Preferences updated successfully",
      data: updatedData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 })
  }
}
