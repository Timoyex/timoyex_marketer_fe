import { type NextRequest, NextResponse } from "next/server"

// GET /api/settings/appearance - fetch current theme
export async function GET() {
  try {
    // Mock current theme data
    const appearanceData = {
      theme: "light", // light, dark, system
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: appearanceData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch appearance settings" }, { status: 500 })
  }
}

// PUT /api/settings/appearance - update theme preference
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { theme } = body

    if (!theme || !["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ success: false, error: "Invalid theme value" }, { status: 400 })
    }

    // Mock update response
    const updatedData = {
      theme,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Theme updated successfully",
      data: updatedData,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update theme" }, { status: 500 })
  }
}
