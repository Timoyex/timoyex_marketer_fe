import { NextResponse } from "next/server"

export async function GET() {
  const recentActivity = [
    { message: "John Doe joined your team", date: "Aug 20, 2025", type: "recruit" },
    { message: "Commission payout requested", date: "Aug 21, 2025", type: "payment" },
    { message: "Level 2 achievement unlocked", date: "Aug 19, 2025", type: "achievement" },
    { message: "Sarah Smith made a purchase", date: "Aug 18, 2025", type: "purchase" },
    { message: "New team member activated", date: "Aug 17, 2025", type: "recruit" },
  ]

  return NextResponse.json(recentActivity)
}
