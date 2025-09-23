import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    const userPayments = [
      { id: "PAY-2024-001", userId, amount: 6720, method: "Bank Transfer", date: "2024-03-15", status: "Completed" },
      { id: "PAY-2024-002", userId, amount: 6280, method: "PayPal", date: "2024-02-15", status: "Completed" },
      { id: "PAY-2024-003", userId, amount: 5890, method: "Bank Transfer", date: "2024-01-15", status: "Completed" },
      { id: "PAY-2024-004", userId, amount: 7150, method: "Crypto", date: "2023-12-15", status: "Completed" },
      { id: "PAY-2024-005", userId, amount: 8500, method: "Bank Transfer", date: "2023-11-15", status: "Processing" },
    ]

    return NextResponse.json({
      userId,
      payments: userPayments,
      totalPayments: userPayments.length,
      totalAmount: userPayments.reduce((sum, payment) => sum + payment.amount, 0),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user payment history" }, { status: 500 })
  }
}
