"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Network,
  DollarSign,
  TrendingUp,
  List,
  LayoutGrid,
  Share,
} from "lucide-react";
import { InfoCard } from "@/components/custom/infocard";
import { copyToClipboard } from "@/lib/utils";
import TeamCardView from "./cardView";
import TeamTableView from "./tableView";
import { useProfile } from "@/hooks/profile.hook";
import { useTeam } from "@/hooks/team.hook";
import { SkeletalInfoCard } from "@/components/custom/skeleton";

const ITEMS_PER_PAGE = 10;

export function TeamSection() {
  const { profileQuery, isLoading } = useProfile();
  const {
    teamStats: memberStats,
    teamStatsIsLoading,
    downlineMembers,
    downlineIsLoading,
  } = useTeam(profileQuery.data?.marketerCode || ""); //tanstack query

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  const handleInviteMember = async () => {
    const referralLink = `https://yourplatform.com/join/${profileQuery.data?.marketerCode}`;
    await copyToClipboard(referralLink);
  };

  const filteredMembers =
    useMemo(() => {
      const teamMembers = downlineMembers?.members;
      return teamMembers?.filter((member) => {
        const matchesSearch =
          member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ||
          member.status.toLowerCase() === statusFilter.toLowerCase();
        const matchesLevel =
          levelFilter === "all" || member.level?.toString() === levelFilter;

        return matchesSearch && matchesStatus && matchesLevel;
      });
    }, [searchTerm, statusFilter, levelFilter, downlineIsLoading]) || [];

  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(filteredMembers);
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const teamStats = [
    {
      title: "Direct Recruits",
      icon: <UserPlus className="h-5 w-5 text-blue-500" />,
      value: memberStats?.directMembers || 0,
      desc: "Direct Members",
    },
    {
      title: "Total Network",
      icon: <Network className="h-5 w-5 text-green-500" />,
      value: memberStats?.totalDownlines || 0,
      desc: "Including sub-levels",
    },
    {
      title: "Total Revenue",
      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
      value: `₦${memberStats?.totalEarnings?.toLocaleString() || 0}`,
      desc: "All-time revenue",
      isDemo: true,
    },
    {
      title: "Team Earnings",
      icon: <DollarSign className="h-5 w-5 text-orange-500" />,
      value: `₦${memberStats?.totalEarnings?.toLocaleString() || 0}`,
      desc: "Total team commissions",
      isDemo: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">My Team</h2>
          <p className="text-muted-foreground">
            Manage and track your team members performance.
          </p>
        </div>
        <Button
          onClick={handleInviteMember}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Share className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {teamStatsIsLoading &&
          Array(4)
            .fill(0)
            .map((item, index) => <SkeletalInfoCard key={index} />)}
        {!teamStatsIsLoading &&
          teamStats.map((stat) => (
            <InfoCard
              key={stat.title}
              title={stat.title}
              desc={stat.desc}
              value={stat.value}
              icon={stat.icon}
              iconBg="bg-transparent"
              isDemo={stat.isDemo || false}
            />
          ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Team Members</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                Table View
              </Button>
              <Button
                variant={viewMode === "card" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("card")}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                Card View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={levelFilter}
              onValueChange={(value) => {
                setLevelFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="1">Level 1</SelectItem>
                <SelectItem value="2">Level 2</SelectItem>
                <SelectItem value="3">Level 3</SelectItem>
                <SelectItem value="4">Level 4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <div className="rounded-md border border-border min-w-[600px]">
                <TeamTableView data={paginatedMembers} />
              </div>
            </div>
          ) : (
            <TeamCardView data={paginatedMembers} />
          )}

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredMembers.length)} of{" "}
              {filteredMembers.length} results
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
