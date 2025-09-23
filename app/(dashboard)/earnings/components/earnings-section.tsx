"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Clock,
  Download,
  Calendar,
  CreditCard,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { InfoCard } from "@/components/custom/infocard";
import Demo from "@/components/custom/demo";

// Sample earnings data
const monthlyEarnings = [
  { month: "Jan", commission: 2400, bonus: 200, total: 2600 },
  { month: "Feb", commission: 1398, bonus: 150, total: 1548 },
  { month: "Mar", commission: 9800, bonus: 800, total: 10600 },
  { month: "Apr", commission: 3908, bonus: 300, total: 4208 },
  { month: "May", commission: 4800, bonus: 400, total: 5200 },
  { month: "Jun", commission: 3800, bonus: 350, total: 4150 },
  { month: "Jul", commission: 4300, bonus: 380, total: 4680 },
  { month: "Aug", commission: 5200, bonus: 450, total: 5650 },
  { month: "Sep", commission: 4100, bonus: 320, total: 4420 },
  { month: "Oct", commission: 6200, bonus: 520, total: 6720 },
  { month: "Nov", commission: 5800, bonus: 480, total: 6280 },
  { month: "Dec", commission: 7200, bonus: 600, total: 7800 },
];

const commissionBreakdown = [
  {
    source: "Direct Sales",
    amount: 15420,
    percentage: 34,
    color: "var(--chart-1)",
  },
  {
    source: "Team Commission",
    amount: 18650,
    percentage: 41,
    color: "var(--chart-2)",
  },
  {
    source: "Bonuses",
    amount: 6230,
    percentage: 14,
    color: "var(--chart-3)",
  },
  {
    source: "Overrides",
    amount: 4950,
    percentage: 11,
    color: "var(--chart-4)",
  },
];

const paymentHistory = [
  {
    id: 1,
    date: "2024-03-15",
    amount: 6720,
    status: "Completed",
    method: "Bank Transfer",
    reference: "PAY-2024-001",
  },
  {
    id: 2,
    date: "2024-02-15",
    amount: 6280,
    status: "Completed",
    method: "PayPal",
    reference: "PAY-2024-002",
  },
  {
    id: 3,
    date: "2024-01-15",
    amount: 7800,
    status: "Completed",
    method: "Bank Transfer",
    reference: "PAY-2024-003",
  },
  {
    id: 4,
    date: "2024-04-15",
    amount: 4420,
    status: "Processing",
    method: "Bank Transfer",
    reference: "PAY-2024-004",
  },
  {
    id: 5,
    date: "2024-05-15",
    amount: 5650,
    status: "Pending",
    method: "PayPal",
    reference: "PAY-2024-005",
  },
  {
    id: 6,
    date: "2024-06-15",
    amount: 4150,
    status: "Completed",
    method: "Bank Transfer",
    reference: "PAY-2024-006",
  },
  {
    id: 7,
    date: "2024-07-15",
    amount: 4680,
    status: "Completed",
    method: "PayPal",
    reference: "PAY-2024-007",
  },
  {
    id: 8,
    date: "2024-08-15",
    amount: 5650,
    status: "Processing",
    method: "Bank Transfer",
    reference: "PAY-2024-008",
  },
  {
    id: 9,
    date: "2024-09-15",
    amount: 4420,
    status: "Completed",
    method: "PayPal",
    reference: "PAY-2024-009",
  },
  {
    id: 10,
    date: "2024-10-15",
    amount: 6720,
    status: "Pending",
    method: "Bank Transfer",
    reference: "PAY-2024-010",
  },
];

const chartConfig = {
  commission: {
    label: "Commission",
    color: "var(--chart-1)",
  },
  bonus: {
    label: "Bonus",
    color: "var(--chart-2)",
  },
  total: {
    label: "Total",
    color: "var(--primary)",
  },
};

export function EarningsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const totalEarnings = monthlyEarnings.reduce(
    (sum, month) => sum + month.total,
    0
  );
  const totalCommission = monthlyEarnings.reduce(
    (sum, month) => sum + month.commission,
    0
  );
  const totalBonus = monthlyEarnings.reduce(
    (sum, month) => sum + month.bonus,
    0
  );
  const pendingAmount = paymentHistory
    .filter(
      (payment) =>
        payment.status === "Pending" || payment.status === "Processing"
    )
    .reduce((sum, payment) => sum + payment.amount, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const summary = [
    {
      title: "Total Earned",
      value: totalEarnings.toLocaleString(),
      icon: <Wallet className="h-4 w-4 text-blue-600" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtitle: "Lifetime earnings",
      desc: "Lifetime earnings",
    },
    {
      title: "Pending Withdrawals",
      value: pendingAmount.toLocaleString(),
      icon: <Clock className="h-4 w-4 text-purple-600" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "Processing payments",
      desc: "Processing payments",
    },
    {
      title: "Last Payout",
      value: 6720,
      icon: <CreditCard className="h-4 w-4 text-orange-600" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      subtitle: "March 15, 2024",
      desc: "March 15, 2024",
    },
  ];

  const totalPages = Math.ceil(paymentHistory.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = paymentHistory.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between relative">
        <Demo />
        <div>
          <h2 className="text-3xl font-bold text-foreground">Earnings</h2>
          <p className="text-muted-foreground">
            Track your commission and payment history.
          </p>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Summary Cards */}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {summary.map((item, index) => (
          <InfoCard
            title={item.title}
            icon={item.icon}
            desc={item.desc}
            value={item.value}
            key={index}
            iconBg={item.iconBg}
            isDemo={true}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Earnings Trend Chart */}
        <Card className="bg-card border-border shadow-sm relative">
          <Demo />
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Earnings Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly commission and bonus breakdown
            </p>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="h-80 w-full overflow-hidden"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyEarnings}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: " var(--muted-foreground)" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: " var(--muted-foreground)" }}
                    tickFormatter={(value) => `₦${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />

                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    dot={{ fill: "var(--chart-4)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bonus"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    dot={{ fill: "var(--chart-3)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: "var(--primary)", strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Commission Breakdown */}
        <Card className="bg-card border-border shadow-sm relative">
          <Demo />
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Commission Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue sources distribution
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={commissionBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="amount"
                    >
                      {commissionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border border-border rounded-lg p-3 shadow-md">
                              <p className="font-medium">{data.source}</p>
                              <p className="text-sm text-muted-foreground">
                                ₦{data.amount.toLocaleString()} (
                                {data.percentage}%)
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {commissionBreakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-card-foreground">
                        {item.source}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-card-foreground">
                      ₦{item.amount.toLocaleString()} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="bg-card border-border shadow-sm relative">
        <Demo />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
            </div>
            Payment History
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recent payouts and pending withdrawals
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentRecords.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium text-card-foreground">
                      ₦{payment.amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(payment.date)} • {payment.method}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={getStatusColor(payment.status)}
                  >
                    {payment.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {payment.reference}
                  </div>
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                <div className="text-sm text-muted-foreground order-2 sm:order-1">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, paymentHistory.length)} of{" "}
                  {paymentHistory.length} records
                </div>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
