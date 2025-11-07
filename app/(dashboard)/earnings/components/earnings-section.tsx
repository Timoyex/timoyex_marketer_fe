"use client";

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
  Calendar,
  CreditCard,
  Wallet,
  BellOff,
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
import { useEarnings } from "@/hooks/earning.hook";
import { snakeToTitleCase } from "@/lib/currency-utils";
import { usePayments } from "@/hooks/payments.hook";
import { useCursorPagination } from "@/lib/pagination-fn";
import { PaginatedTable } from "@/components/custom/dataTable";
import { EarningHistoryEntity, PaymentsEntity } from "@/lib/api";
import { getEarningType } from "@/app/admin/dashboard/page";
import { EarningCard } from "./request-card";
import { DialogContainer } from "@/components/custom/dialog-container";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <BellOff className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No new payments yet.</h3>
    <p className="text-muted-foreground text-center max-w-md">
      You're all caught up! Check back later for new payments requests.
    </p>
  </div>
);

const EarningDialogComp = ({
  earnings,
}: {
  earnings: EarningHistoryEntity[];
}) => (
  <div className="space-y-3">
    {earnings.map((e) => (
      <EarningCard earning={e} key={e.id} />
    ))}
  </div>
);

const chartConfig = {
  team_commission: {
    label: "Salary",
    color: "var(--chart-3)",
  },
  direct_sales: {
    label: "Commission",
    color: "var(--chart-4)",
  },
  total: {
    label: "Total",
    color: "var(--primary)",
  },
};

function transformBreakdownToChart(
  breakdown: Array<{
    type: "direct_sales" | "team_commission";
    amount: number;
    count: number;
    percentage: number;
  }>
) {
  return breakdown.map((item, index) => ({
    source: snakeToTitleCase(item.type),
    amount: item.amount,
    percentage: item.percentage,
    color: chartConfig[item.type].color,
  }));
}

export function EarningsSection() {
  const { earningsOverviewQuery } = useEarnings({
    includeStats: true,
  });
  const { earningsHistoryQuery, isHistoryLoading } = useEarnings({
    limit: 5,
    status: "pending",
  });
  const { paymentHistoryQuery, isPaymentsLoading } = usePayments({});
  const paymentHistoryData = paymentHistoryQuery.data;

  const earnings = earningsHistoryQuery.data?.earnings;

  const monthlyEarnings =
    earningsOverviewQuery.data?.analytics?.earningsTimeSeries || [];

  const commissionBreakdown = transformBreakdownToChart(
    earningsOverviewQuery.data?.breakdown || []
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const renderPayment = (payment: PaymentsEntity) => {
    return (
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
              {Number(payment.amount || 0)?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              }) || 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Requested on{" "}
              {formatDate(new Date(payment.createdAt).toISOString())} •{" "}
              {getEarningType(payment.earningType || "direct_sales")}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getStatusColor(payment.status)}>
            {payment.status}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {" "}
            {payment.processedAt &&
              payment.processedAt !== "" &&
              `Processed on ${formatDate(
                new Date(payment.processedAt).toISOString()
              )}`}
          </p>
        </div>
      </div>
    );
  };

  const pagination = useCursorPagination();

  const summary = [
    {
      title: "Total Earned",
      value:
        "₦" +
          earningsOverviewQuery.data?.summary?.totalEarnings?.toLocaleString() ||
        0,
      icon: <Wallet className="h-4 w-4 text-blue-600" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtitle: "Lifetime earnings",
      desc: "Lifetime earnings",
    },
    {
      title: "Pending Withdrawals",
      value: "₦" + Number(paymentHistoryData?.pending || 0).toLocaleString(),
      icon: <Clock className="h-4 w-4 text-purple-600" />,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      subtitle: "Processing payments",
      desc: "Processing payments",
    },
    {
      title: "Last Payout",
      value: "₦" + Number(paymentHistoryData?.lastPayout || 0).toLocaleString(),
      icon: <CreditCard className="h-4 w-4 text-orange-600" />,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      subtitle: "March 15, 2024",
      desc: "March 15, 2024",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Earnings</h2>
          <p className="text-muted-foreground">
            Track your commission and payment history.
          </p>
        </div>
        <DialogContainer
          title="Request Payment"
          desc="Request payment for approved earnings."
          dialogComp={<EarningDialogComp earnings={earnings || []} />}
        >
          <Button
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isHistoryLoading}
          >
            <DollarSign className="h-4 w-4" />
            Request Payment
          </Button>
        </DialogContainer>
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
          />
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Earnings Trend Chart */}
        <Card className="bg-card border-border shadow-sm relative">
          <CardHeader>
            <CardTitle className="text-card-foreground">
              Earnings Trend
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly commission and bonus breakdown (Approved Earnings)
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
                    dataKey="direct_sales"
                    stroke="var(--chart-4)"
                    strokeWidth={2}
                    dot={{ fill: "var(--chart-4)", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="team_commission"
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
          <PaginatedTable
            data={paymentHistoryData?.payments || []}
            renderItem={renderPayment}
            emptyState={<EmptyState />}
            handleFirst={pagination.reset}
            handleNextPage={pagination.goNext}
            handlePrevPage={pagination.goPrev}
            canGoNext={
              paymentHistoryData?.hasMore ??
              paymentHistoryData?.nextCursor ??
              false
            }
            canGoPrev={!!paymentHistoryData?.prevCursor}
            isFirstPage={pagination.cursor === null}
            isLoading={isPaymentsLoading}
            hasMore={paymentHistoryData?.hasMore ?? false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
