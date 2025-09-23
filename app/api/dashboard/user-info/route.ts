import { NextResponse } from "next/server"

export async function GET() {
  const userInfo = {
    name: "John Doe",
    profilePic: "https://example.com/avatar.jpg",
    level: 2,
    badges: ["⭐ Top Recruiter", "🔥 Active Marketer"],
  }

  return NextResponse.json(userInfo)
}
