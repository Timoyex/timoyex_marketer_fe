import { NextResponse } from "next/server"

export async function GET() {
  const summaryStats = {
    totalRecruits: { count: 1234, growth: "+12%" },
    directRecruits: { count: 24, growth: "+5%" },
    monthlyRevenue: { amount: 52400, growth: "+18%" },
    pendingPayments: { amount: 2847, status: "Processing" },
  }

  return NextResponse.json(summaryStats)
}
