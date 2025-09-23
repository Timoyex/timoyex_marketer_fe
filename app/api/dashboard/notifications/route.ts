import { NextResponse } from "next/server"

export async function GET() {
  const notifications = [
    { title: "New recruit joined your team", timestamp: "Aug 22, 2025", read: false },
    { title: "Payment processed successfully", timestamp: "Aug 21, 2025", read: true },
  ]

  return NextResponse.json(notifications)
}
