import { NextResponse } from "next/server"

export async function GET() {
  try {
    const summary = {
      totalEarned: 125840,
      pendingWithdrawals: 8500,
      lastPayout: {
        amount: 6720,
        date: "2024-03-15",
        method: "Bank Transfer",
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch earnings summary" }, { status: 500 })
  }
}
