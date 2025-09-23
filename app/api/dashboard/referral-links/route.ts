import { NextResponse } from "next/server"

export async function GET() {
  const referralLinks = {
    marketerLink: "https://myapp.com/join/marketer/johndoe123",
    shopperLink: "https://myapp.com/shop/ref/johndoe123",
  }

  return NextResponse.json(referralLinks)
}
