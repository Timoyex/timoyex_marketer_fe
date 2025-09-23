"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  Clock,
  Award,
  CreditCard,
  UserPlus,
} from "lucide-react";

import { InfoCard } from "@/components/custom/infocard";
import { useProfile } from "@/hooks/profile.hook";
import {
  SkeletalChartCard,
  SkeletalInfoCard,
  SkeletalProgress,
} from "@/components/custom/skeleton";
import LevelProgress from "./level-progress";
import ReferralCodes from "./referral-codes";
import TaskChecklist from "./task-checklist";
import RecentActivity from "./recent-activity";
import DirectRecruitsChart from "./direct-recruits";
import MonthlyRevenueChart from "./monthly-rev";
import { Skeleton } from "@/components/ui/skeleton";

const monthlyRevenueData = [
  { month: "Jan", revenue: 3200 },
  { month: "Feb", revenue: 2800 },
  { month: "Mar", revenue: 4100 },
  { month: "Apr", revenue: 3600 },
  { month: "May", revenue: 4800 },
  { month: "Jun", revenue: 5200 },
];

const earningsData = [
  { month: "Jan", earnings: 2400, recruits: 12 },
  { month: "Feb", earnings: 1398, recruits: 8 },
  { month: "Mar", earnings: 9800, recruits: 25 },
  { month: "Apr", earnings: 3908, recruits: 18 },
  { month: "May", earnings: 4800, recruits: 22 },
  { month: "Jun", earnings: 3800, recruits: 15 },
  { month: "Jul", earnings: 4300, recruits: 19 },
  { month: "Aug", earnings: 5200, recruits: 24 },
  { month: "Sep", earnings: 4100, recruits: 17 },
  { month: "Oct", earnings: 6200, recruits: 28 },
  { month: "Nov", earnings: 5800, recruits: 26 },
  { month: "Dec", earnings: 7200, recruits: 32 },
];

const initialTasks = [
  { id: 1, text: "Share your referral link", completed: true },
  { id: 2, text: "Recruit 3 members this week", completed: false },
  { id: 3, text: "Update your profile", completed: false },
  { id: 4, text: "Complete training module", completed: true },
  { id: 5, text: "Set up payment method", completed: false },
];

const recentActivity = [
  {
    id: 1,
    text: "John Doe joined your team",
    date: "Aug 20, 2025",
    icon: UserPlus,
  },
  {
    id: 2,
    text: "Commission payout requested",
    date: "Aug 21, 2025",
    icon: CreditCard,
  },
  {
    id: 3,
    text: "Level 2 achievement unlocked",
    date: "Aug 19, 2025",
    icon: Award,
  },
  {
    id: 4,
    text: "Sarah Smith made a purchase",
    date: "Aug 18, 2025",
    icon: DollarSign,
  },
  {
    id: 5,
    text: "New team member activated",
    date: "Aug 17, 2025",
    icon: Users,
  },
];

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
  const { profileQuery, isLoading, getError } = useProfile();
  const profile = profileQuery.data;

  const [tasks, setTasks] = useState(initialTasks);

  const stats = [
    {
      title: "Total Recruits",
      value: "1,234",
      desc: "+12% from last month",
      icon: <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />,
      iconBg: "bg-blue-100",
    },
    {
      title: "Direct Recruits",
      value: "24",
      desc: "+5% from last month",
      icon: <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />,
      iconBg: "bg-green-100",
    },
    {
      title: "Monthly Revenue",
      value: "₦52,400",
      desc: "+18% from last year",
      icon: <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />,
      iconBg: "bg-purple-100",
    },
    {
      title: "Pending Payments",
      value: "₦2,847",
      desc: "Processing...",
      icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />,
      iconBg: "bg-orange-100",
    },
  ];

  const toggleTask = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

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
              isDemo={true}
            />
          ))}
      </div>

      {/* Level Progress, Referral Links, Task Checklist and Recent Activity*/}

      {isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <SkeletalProgress />
          <SkeletalProgress />
          <SkeletalProgress />
          <SkeletalProgress />
        </div>
      )}
      {!isLoading && (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <LevelProgress />

          <ReferralCodes referralCodes={referralCodes} isLoading={isLoading} />

          <TaskChecklist tasks={tasks} toggleTask={toggleTask} />

          <RecentActivity recent={recentActivity} />
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
          <DirectRecruitsChart config={chartConfig} data={earningsData} />

          <MonthlyRevenueChart config={chartConfig} data={monthlyRevenueData} />
        </div>
      )}
    </div>
  );
}
