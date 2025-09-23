import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, role = "member", level = 1 } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Name and email are required" }, { status: 400 })
    }

    // Mock user creation
    const newUser = {
      id: `USR-${Date.now()}`,
      name,
      email,
      role,
      level,
      status: "active",
      joinDate: new Date().toISOString(),
      totalEarnings: 0,
      teamSize: 0,
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: newUser,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
