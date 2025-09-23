import { NextResponse } from "next/server"

export async function GET() {
  try {
    const commissions = {
      directSales: 45600,
      teamCommission: 32800,
      bonuses: 18400,
      overrides: 29040,
    }

    return NextResponse.json(commissions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch commission breakdown" }, { status: 500 })
  }
}
