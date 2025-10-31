"use client";

import { Users, DollarSign, Clock, UserPlus } from "lucide-react";

import { InfoCard } from "@/components/custom/infocard";
import { useProfile } from "@/hooks/profile.hook";
import {
  SkeletalChartCard,
  SkeletalInfoCard,
  SkeletalProgress,
} from "@/components/custom/skeleton";
import LevelProgress from "./level-progress";
import ReferralCodes from "./referral-codes";
import DirectRecruitsChart from "./direct-recruits";
import MonthlyRevenueChart from "./monthly-rev";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/hooks/team.hook";
import { useRevenue } from "@/hooks/revenue.hook";
import { usePayments } from "@/hooks/payments.hook";

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
  recruits: {
    label: "Recruits",
    color: "var(--chart-2)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
};

export function OverviewSection() {
  const { profileQuery, isLoading } = useProfile();
  const { teamStats: memberStats } = useTeam(
    profileQuery.data?.marketerCode || ""
  );
  const { revenueOverviewQuery } = useRevenue();
  const { paymentHistoryQuery } = usePayments({});

  const paymentHistory = paymentHistoryQuery.data;

  const revenueStats = revenueOverviewQuery.data;
  const profile = profileQuery.data;

  const stats = [
    {
      title: "Total Recruits",
      value: memberStats?.totalDownlines || 0,
      desc: "Total Members(Including Sub-Members)",
      icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />,
      iconBg: "bg-blue-100",
      isDemo: false,
    },
    {
      title: "Direct Recruits",
      value: memberStats?.directMembers || 0,
      desc: "Total Direct Members",
      icon: <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />,
      iconBg: "bg-green-100",
      isDemo: false,
    },
    {
      title: "Monthly Revenue",
      value:
        "₦" + Number(revenueStats?.totalMonthlyRevenue || 0).toLocaleString(),
      desc: "For this Month",
      icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />,
      iconBg: "bg-purple-100",
      isDemo: false,
    },
    {
      title: "Pending Payments",
      value: "₦" + Number(paymentHistory?.pending || 0).toLocaleString(),
      desc: "Processing...",
      icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />,
      iconBg: "bg-orange-100",
      isDemo: false,
    },
  ];

  const referralCodes = {
    marketer: profile?.marketerCode || "",
    shopper: profile?.shopperCode || "",
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back,{" "}
          {isLoading ? (
            <Skeleton className="h-6 w-[100px] sm:h-6 sm:w-[100px] inline-block" />
          ) : (
            profile?.firstName || ""
          )}
          !
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Here's your affiliate performance summary.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletalInfoCard key={index} />)}
        {!isLoading &&
          stats.map((stat) => (
            <InfoCard
              title={stat.title}
              value={stat.value}
              desc={stat.desc}
              icon={stat.icon}
              key={stat.title}
              iconBg={stat.iconBg}
              isDemo={stat.isDemo}
            />
          ))}
      </div>

      {/* Level Progress, Referral Links, Task Checklist and Recent Activity*/}

      {isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <SkeletalProgress />
          <SkeletalProgress />
        </div>
      )}
      {!isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <LevelProgress
            userLevel={profileQuery?.data?.level || 0}
            directRecruits={memberStats?.directMembers}
            totalRecruits={memberStats?.totalDownlines}
          />

          <ReferralCodes referralCodes={referralCodes} isLoading={isLoading} />
        </div>
      )}

      {/* Standalone Charts Section */}

      {isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <SkeletalChartCard type="bar" />

          <SkeletalChartCard type="area" />
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <DirectRecruitsChart
            config={chartConfig}
            data={memberStats?.directMembersDist || []}
          />

          <MonthlyRevenueChart
            config={chartConfig}
            data={revenueStats?.revenueDistribution || []}
          />
        </div>
      )}
    </div>
  );
}
