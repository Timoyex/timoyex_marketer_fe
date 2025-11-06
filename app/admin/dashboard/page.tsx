"use client";

import {
  Users,
  CreditCard,
  Megaphone,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useAnnouncements } from "@/hooks/announcememts.hook";
import { useUsers } from "@/hooks/users.hook";
import { AdminInfoCardV2 } from "@/components/custom/admincardV2";
import { useAdminPayments } from "@/hooks/admin-payments.hook";
import { PaymentInfoCard } from "@/components/custom/paymentcard";

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <Megaphone className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No new payment requests.</h3>
    <p className="text-muted-foreground text-center max-w-md">
      You're all caught up! Check back later for new requests.
    </p>
  </div>
);

export const getEarningType = (type: string) => {
  switch (type) {
    case "direct_sales":
      return "Sales Commission";
    case "team_commission":
      return "Monthly Salary";

    default:
      return "commission";
  }
};

export default function AdminDashboard() {
  const { statsQuery } = useUsers({});
  const { announcememtStatsQuery } = useAnnouncements({});

  const { paymentStatsQuery, paymentListQuery } = useAdminPayments({});

  const paymentStats = paymentStatsQuery.data;

  const userStats = statsQuery.data;
  const annStats = announcememtStatsQuery.data;
  const stats = [
    {
      title: "Total Users",
      value: userStats?.total?.toLocaleString() || 0,
      desc: "All Users",
      icon: Users,
      iconBg: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending Payments",
      value: Number(paymentStats?.total || 0).toLocaleString(undefined, {
        notation: "compact",
      }),
      desc: "Payment Requests",
      icon: CreditCard,
      iconBg: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Marketers",
      value: userStats?.active?.toLocaleString() || 0,
      desc: "Active Users",
      icon: TrendingUp,
      iconBg: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Announcements Sent",
      value: annStats?.byStatus?.sent?.toLocaleString() || 0,
      desc: "All TIme Values",
      icon: Megaphone,
      iconBg: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const payments = paymentListQuery.data?.payments || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <AdminInfoCardV2
                key={stat.title}
                title={stat.title}
                icon={stat.icon}
                iconBg={stat.iconBg}
                value={stat.value}
                bgColor={stat.bgColor}
                desc={stat.desc || ""}
              />
            ))}
          </div>

          <div>
            {/* Payment Qualification Alerts */}
            <Card className="p-6 bg-white border border-gray-200 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Payment Qualification Alerts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Marketers ready for monthly payments/sales commission
                  </p>
                </div>
              </div>

              {!payments || (payments.length <= 0 && <EmptyState />)}

              {payments && payments.length > 0 && (
                <div className="space-y-4 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {payments.map((pay) => (
                    <PaymentInfoCard
                      name={`${pay.user?.firstName || ""} ${
                        pay.user?.lastName || ""
                      }`}
                      level={pay.user.level || 0}
                      amount={pay.amount}
                      type={getEarningType(pay.earningType)}
                      key={pay.id}
                    />
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full bg-transparent">
                  <Link href={"/admin/payments"}>
                    View All Payment Qualifications
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link className="flex items-center gap-4" href={"/admin/users"}>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Manage Users
                    </div>
                    <p className="text-sm text-slate-600">
                      View and manage all user accounts
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link
                  className="flex items-center gap-4"
                  href={"/admin/payments"}
                >
                  <div className="p-3 bg-green-100 rounded-full">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Process Payments
                    </div>
                    <p className="text-sm text-slate-600">
                      Handle payment requests and payouts
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <Link
                  className="flex items-center gap-4"
                  href={"/admin/announcements"}
                >
                  <div className="p-3 bg-orange-100 rounded-full">
                    <Megaphone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">
                      Send Announcements
                    </div>
                    <p className="text-sm text-slate-600">
                      Create and broadcast messages
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
