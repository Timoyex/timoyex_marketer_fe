import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "pdf"

    // Mock file export response
    const exportData = {
      message: `Earnings report exported successfully as ${format.toUpperCase()}`,
      filename: `earnings-report-${new Date().toISOString().split("T")[0]}.${format}`,
      downloadUrl: `/downloads/earnings-report-${Date.now()}.${format}`,
      generatedAt: new Date().toISOString(),
      format: format.toUpperCase(),
      recordCount: 156,
    }

    return NextResponse.json(exportData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to export earnings report" }, { status: 500 })
  }
}
