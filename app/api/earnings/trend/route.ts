import { NextResponse } from "next/server"

export async function GET() {
  try {
    const trend = [
      { month: "Jan", amount: 4200 },
      { month: "Feb", amount: 6800 },
      { month: "Mar", amount: 5600 },
      { month: "Apr", amount: 7200 },
      { month: "May", amount: 8100 },
      { month: "Jun", amount: 6900 },
      { month: "Jul", amount: 9200 },
      { month: "Aug", amount: 8800 },
      { month: "Sep", amount: 7500 },
      { month: "Oct", amount: 9600 },
      { month: "Nov", amount: 8300 },
      { month: "Dec", amount: 10200 },
    ]

    return NextResponse.json(trend)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch earnings trend" }, { status: 500 })
  }
}
