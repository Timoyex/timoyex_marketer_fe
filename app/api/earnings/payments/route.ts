import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const allPayments = [
      { id: "PAY-2024-001", amount: 6720, method: "Bank Transfer", date: "2024-03-15", status: "Completed" },
      { id: "PAY-2024-002", amount: 6280, method: "PayPal", date: "2024-02-15", status: "Completed" },
      { id: "PAY-2024-003", amount: 5890, method: "Bank Transfer", date: "2024-01-15", status: "Completed" },
      { id: "PAY-2024-004", amount: 7150, method: "Crypto", date: "2023-12-15", status: "Completed" },
      { id: "PAY-2024-005", amount: 6420, method: "Bank Transfer", date: "2023-11-15", status: "Completed" },
      { id: "PAY-2024-006", amount: 5980, method: "PayPal", date: "2023-10-15", status: "Completed" },
      { id: "PAY-2024-007", amount: 8200, method: "Bank Transfer", date: "2023-09-15", status: "Completed" },
      { id: "PAY-2024-008", amount: 7680, method: "Crypto", date: "2023-08-15", status: "Completed" },
      { id: "PAY-2024-009", amount: 6890, method: "Bank Transfer", date: "2023-07-15", status: "Completed" },
      { id: "PAY-2024-010", amount: 7320, method: "PayPal", date: "2023-06-15", status: "Completed" },
      { id: "PAY-2024-011", amount: 8500, method: "Bank Transfer", date: "2023-05-15", status: "Processing" },
      { id: "PAY-2024-012", amount: 6150, method: "Crypto", date: "2023-04-15", status: "Completed" },
    ]

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPayments = allPayments.slice(startIndex, endIndex)

    const response = {
      data: paginatedPayments,
      pagination: {
        page,
        limit,
        total: allPayments.length,
        totalPages: Math.ceil(allPayments.length / limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 })
  }
}
