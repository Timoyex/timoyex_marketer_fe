import { NextResponse } from "next/server"

export async function GET() {
  const monthlyRevenueChart = {
    monthlyData: [
      { month: "Jan", amount: 3000 },
      { month: "Feb", amount: 2800 },
      { month: "Mar", amount: 4500 },
      { month: "Apr", amount: 4200 },
      { month: "May", amount: 4100 },
      { month: "Jun", amount: 5000 },
      { month: "Jul", amount: 5300 },
      { month: "Aug", amount: 5500 },
      { month: "Sep", amount: 5800 },
      { month: "Oct", amount: 6000 },
      { month: "Nov", amount: 6200 },
      { month: "Dec", amount: 6400 },
    ],
  }

  return NextResponse.json(monthlyRevenueChart)
}
