import { NextResponse } from "next/server"

export async function GET() {
  const levelProgress = {
    currentLevel: 2,
    recruits: 89,
    nextLevelRequirement: 100,
    levels: [
      { level: 1, progress: "25/25", completed: true },
      { level: 2, progress: "50/50", completed: true },
      { level: 3, progress: "89/100", completed: false },
      { level: 4, progress: "0/200", completed: false },
      { level: 5, progress: "0/500", completed: false },
      { level: 6, progress: "0/750", completed: false },
      { level: 7, progress: "0/1000", completed: false },
      { level: 8, progress: "0/1500", completed: false },
      { level: 9, progress: "0/2000", completed: false },
      { level: 10, progress: "0/3000", completed: false },
    ],
  }

  return NextResponse.json(levelProgress)
}
