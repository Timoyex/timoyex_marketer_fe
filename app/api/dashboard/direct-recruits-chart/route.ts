import { NextResponse } from "next/server"

export async function GET() {
  const directRecruitsChart = {
    monthlyData: [
      { month: "Jan", count: 12 },
      { month: "Feb", count: 8 },
      { month: "Mar", count: 24 },
      { month: "Apr", count: 18 },
      { month: "May", count: 20 },
      { month: "Jun", count: 15 },
      { month: "Jul", count: 22 },
      { month: "Aug", count: 25 },
      { month: "Sep", count: 19 },
      { month: "Oct", count: 27 },
      { month: "Nov", count: 26 },
      { month: "Dec", count: 30 },
    ],
  }

  return NextResponse.json(directRecruitsChart)
}
