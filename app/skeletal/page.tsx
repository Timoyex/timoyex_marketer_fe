import {
  SkeletalCardView,
  SkeletalChartCard,
  SkeletalInfoCard,
  SkeletalProgress,
  SkeletalQuickCTA,
  SkeletalTable,
} from "@/components/custom/skeleton";
import SkeletonInfoCard from "@/components/custom/skeleton/Card";

export const metadata = {
  title: "Skeletal Views - Marketer Dashboard",
  description:
    "Your affiliate marketing dashboard - Track performance, manage your team, and grow your earnings",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      card view
      <SkeletalCardView />
      <br />
      chart card
      <SkeletalChartCard type="line" />
      <SkeletalChartCard type="bar" />
      <SkeletalChartCard type="pie" />
      <SkeletalChartCard type="area" />
      <br />
      info card
      <SkeletalInfoCard />
      <br />
      progress
      <SkeletalProgress />
      <br />
      quickcta
      <SkeletalQuickCTA />
      <br />
      info card
      <SkeletonInfoCard />
      <br />
      table
      <SkeletalTable />
    </div>
  );
}
