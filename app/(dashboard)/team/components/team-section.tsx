"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Network,
  Share,
  User,
  UserCircle,
  Mail,
  Phone,
} from "lucide-react";
import { InfoCard } from "@/components/custom/infocard";
import { copyToClipboard } from "@/lib/utils";
import { useProfile } from "@/hooks/profile.hook";
import { useTeam } from "@/hooks/team.hook";
import { SkeletalInfoCard } from "@/components/custom/skeleton";
import { EmptyState, teamColumns } from "./columns";
import { DataTable } from "@/components/custom/dataTable";
import { useState } from "react";
import { useCursorPagination } from "@/lib/pagination-fn";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
];
const levelOptions = [
  { value: "all", label: "All Levels" },
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" },
  { value: "6", label: "Level 6" },
  { value: "7", label: "Level 7" },
  { value: "8", label: "Level 8" },
  { value: "9", label: "Level 9" },
  { value: "10", label: "Level 10" },
];

function FilterSlots({ table }: { table: any }) {
  const statusValue =
    (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const levelValue =
    (table.getColumn("level")?.getFilterValue() as string) ?? "";

  return (
    <>
      <Select
        value={statusValue}
        onValueChange={(val) => table.getColumn("status")?.setFilterValue(val)}
        placeholder="Filter by Status"
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={levelValue}
        onValueChange={(val) => table.getColumn("level")?.setFilterValue(val)}
        placeholder="Filter by Level"
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by Level" />
        </SelectTrigger>
        <SelectContent>
          {levelOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}

export function TeamSection() {
  const url = typeof window !== "undefined" ? window.location.hostname : "";
  const pagination = useCursorPagination();

  const { profileQuery, isLoading } = useProfile();
  const {
    teamStats: memberStats,
    teamStatsIsLoading,
    downlineMembersV2,
    downlineIsLoadingV2,
  } = useTeam(profileQuery.data?.marketerCode || "", {
    limit: 5,
    cursor: pagination.cursor,
  }); //tanstack query

  const [searchQuery, setSearchQuery] = useState("");

  const handleInviteMember = async () => {
    const referralLink = `${url}/join/${profileQuery.data?.marketerCode}`;
    await copyToClipboard(referralLink);
  };

  // Filter data before passing to DataTable

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
  ];

  const upline = profileQuery.data?.upline || null;

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

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        {teamStatsIsLoading &&
          Array(2)
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
            />
          ))}
      </div>

      {upline && (
        <Card className="bg-card border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              Your Upline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Name
                  </p>
                  <p className="text-base font-semibold text-foreground capitalize">
                    {`${upline.firstName || ""} ${upline.lastName || ""}` ||
                      "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-base font-semibold text-foreground break-all">
                    {upline.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-base font-semibold text-foreground">
                    {upline.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-card-foreground">Team Members</CardTitle>
            <div className="flex items-center gap-2"></div>
          </div>
        </CardHeader>
        <CardContent>
          {downlineIsLoadingV2 && (
            <DataTable
              data={[]}
              columns={teamColumns}
              emptyState={<EmptyState />}
            />
          )}
          {!downlineIsLoadingV2 && (
            <DataTable
              data={downlineMembersV2?.members || []}
              columns={teamColumns}
              searchPlaceholder="Search by name"
              searchTerm="name"
              emptyState={<EmptyState />}
              filterSlot={({ table }) => <FilterSlots table={table} />}
              globalSearchColumns={["name", "status", "level"]}
              serverSide={{
                searchQuery,
                onSearchChange: (value) => {
                  setSearchQuery(value);
                  pagination.reset();
                },
                hasMore:
                  Boolean(downlineMembersV2?.nextCursor) ??
                  downlineMembersV2?.hasMore ??
                  false,
                onNextPage: () => {
                  if (downlineMembersV2?.nextCursor) {
                    pagination.goNext(downlineMembersV2?.nextCursor!);
                  }
                },
                onPrevPage: () => {
                  if (downlineMembersV2?.prevCursor) {
                    pagination.goPrev(downlineMembersV2?.prevCursor!);
                  }
                },
                onFirstPage: pagination.reset,
                canGoPrev: !!downlineMembersV2?.prevCursor,
                isFirstPage: pagination.cursor === null,
                isLoading,
                currentPageSize: downlineMembersV2?.members?.length,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
