"use client";

import { useState } from "react";
import { Users, Edit, Ban, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useUsers } from "@/hooks/users.hook";
import { AdminInfoCard } from "@/components/custom/admincard";
import { EmptyState, userColumns } from "./components/columns";
import { DataTable } from "@/components/custom/dataTable";
import { useCursorPagination } from "@/lib/pagination-fn";

export default function UserManagement() {
  const { statsQuery, usersQuery, isUsersLoading } = useUsers({});

  const userStats = statsQuery.data;
  const users = usersQuery.data;

  const stats = [
    {
      title: "Total Users",
      value:
        userStats?.total?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: Users,
      iconBg: "text-blue-600",
    },
    {
      title: "Active Users",
      value:
        userStats?.active?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: CheckCircle,
      iconBg: "text-green-600",
    },
    {
      title: "Suspended / Inactive",
      value:
        userStats?.inactive?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: Ban,
      iconBg: "text-red-600",
    },
  ];

  function FilterSlots({ table }: { table: any }) {
    const statusValue =
      (table.getColumn("status")?.getFilterValue() as string) ?? "";
    const levelValue =
      (table.getColumn("level")?.getFilterValue() as string) ?? "";

    return (
      <div className="flex gap-4">
        <Select
          value={levelValue}
          onValueChange={(val) => table.getColumn("level")?.setFilterValue(val)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="1">Level 1</SelectItem>
            <SelectItem value="2">Level 2</SelectItem>
            <SelectItem value="3">Level 3</SelectItem>
            <SelectItem value="4">Level 4</SelectItem>
            <SelectItem value="5">Level 5</SelectItem>
            <SelectItem value="6">Level 6</SelectItem>
            <SelectItem value="7">Level 7</SelectItem>
            <SelectItem value="8">Level 8</SelectItem>
            <SelectItem value="9">Level 9</SelectItem>
            <SelectItem value="10">Level 10</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={statusValue}
          onValueChange={(val) =>
            table.getColumn("status")?.setFilterValue(val)
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  const pagination = useCursorPagination();

  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* User Management Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <AdminInfoCard
                key={stat.title}
                title={stat.title}
                icon={stat.icon}
                iconBg={stat.iconBg}
                value={stat.value}
              />
            ))}
          </div>

          {/* Users Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                All Users ({users?.count})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isUsersLoading && (
                <DataTable
                  data={[]}
                  columns={userColumns}
                  emptyState={<EmptyState />}
                />
              )}
              {!isUsersLoading && (
                <DataTable
                  data={users?.profiles || []}
                  columns={userColumns}
                  searchPlaceholder="Search users by name or email..."
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
                      Boolean(users?.nextCursor) ?? users?.hasMore ?? false,
                    onNextPage: () => {
                      if (users?.nextCursor) {
                        pagination.goNext(users?.nextCursor!);
                      }
                    },
                    onPrevPage: () => {
                      if (users?.prevCursor) {
                        pagination.goPrev(users?.prevCursor!);
                      }
                    },
                    onFirstPage: pagination.reset,
                    canGoPrev: !!users?.prevCursor,
                    isFirstPage: pagination.cursor === null,
                    isLoading: isUsersLoading,
                    currentPageSize: users?.profiles?.length || 0,
                  }}
                />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
