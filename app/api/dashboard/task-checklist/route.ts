import { NextResponse } from "next/server"

export async function GET() {
  const taskChecklist = [
    { task: "Share your referral link", completed: true },
    { task: "Recruit 3 members this week", completed: false },
    { task: "Update your profile", completed: false },
    { task: "Complete training module", completed: true },
    { task: "Set up payment method", completed: false },
  ]

  return NextResponse.json(taskChecklist)
}
