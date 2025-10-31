"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Zap, Play } from "lucide-react"
import { useRealtimeSales, useSimulateSale } from "@/hooks/use-real-time-sales"

interface RealtimeRevenueCardProps {
  marketerId?: string
  referralCode?: string
  showSimulator?: boolean
}

export function RealtimeRevenueCard({
  marketerId,
  referralCode = "SHP-IFEADE5KBK",
  showSimulator = true,
}: RealtimeRevenueCardProps) {
  const { monthlyRevenue, todayRevenue, sales, isLoading, refresh } = useRealtimeSales(marketerId)
  const { simulateSale, isSimulating } = useSimulateSale()
  const [lastSaleAmount, setLastSaleAmount] = useState<number | null>(null)
  const [showSaleAnimation, setShowSaleAnimation] = useState(false)

  // Monitor for new sales to trigger animations
  useEffect(() => {
    if (sales.length > 0) {
      const latestSale = sales[0]
      const saleTime = new Date(latestSale.created_at).getTime()
      const now = new Date().getTime()

      // If sale is within last 10 seconds, show animation
      if (now - saleTime < 10000) {
        setLastSaleAmount(latestSale.amount)
        setShowSaleAnimation(true)
        setTimeout(() => setShowSaleAnimation(false), 3000)
      }
    }
  }, [sales])

  const handleSimulateSale = async () => {
    try {
      const result = await simulateSale(referralCode)
      setLastSaleAmount(result.amount)
      setShowSaleAnimation(true)
      setTimeout(() => setShowSaleAnimation(false), 3000)
      // Refresh data after simulation
      setTimeout(() => refresh(), 1000)
    } catch (error) {
      console.error("Failed to simulate sale:", error)
    }
  }

  return (
    <Card className="relative p-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Real-time indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs text-green-600 font-medium">LIVE</span>
      </div>

      {/* Sale animation overlay */}
      {showSaleAnimation && lastSaleAmount && (
        <div className="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center z-10 animate-pulse">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-lg animate-bounce">
            +₦{lastSaleAmount.toLocaleString()} Sale!
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <h3 className="text-gray-700 font-medium">Monthly Revenue (Real-time)</h3>
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            ₦{monthlyRevenue.toLocaleString()}
            {showSaleAnimation && <TrendingUp className="w-6 h-6 text-green-500 animate-bounce" />}
          </div>
          <div className="text-sm text-gray-600">+₦{todayRevenue.toLocaleString()} today</div>
        </div>

        {/* Recent sales indicator */}
        {sales.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Recent Sales
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {sales.slice(0, 3).map((sale, index) => (
                <div key={sale.id} className="text-xs text-gray-600 flex justify-between">
                  <span>₦{sale.amount.toLocaleString()}</span>
                  <span>{new Date(sale.created_at).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo simulator */}
        {showSimulator && (
          <div className="pt-3 border-t border-gray-200">
            <Button
              onClick={handleSimulateSale}
              disabled={isSimulating}
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isSimulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing Sale...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Simulate Sale (Demo)
                </>
              )}
            </Button>
            <div className="text-xs text-gray-500 text-center mt-1">
              Simulates a purchase through your referral link
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
