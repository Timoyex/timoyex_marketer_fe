"use client";

import { Plus, Send, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DialogContainer } from "@/components/custom/dialog-container";
import { AnnouncementDialog } from "./components/announcements-dialog";
import { useAnnouncements } from "@/hooks/announcememts.hook";
import { AdminInfoCard } from "@/components/custom/admincard";
import { DataTable } from "@/components/custom/dataTable";
import { announcementColumns, EmptyState } from "./components/columns";
import { useState } from "react";
import { useCursorPagination } from "@/lib/pagination-fn";

export default function AnnouncementManagement() {
  const { announcememtListQuery, announcememtStatsQuery, isListLoading } =
    useAnnouncements({});

  const [searchQuery, setSearchQuery] = useState("");

  const pagination = useCursorPagination();

  const annStats = announcememtStatsQuery?.data;

  const stats = [
    {
      title: "Total Sent",
      value:
        annStats?.byStatus?.sent?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: Send,
      iconBg: "text-green-600",
    },
    {
      title: "Drafts",
      value:
        annStats?.byStatus?.draft?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: Edit,
      iconBg: "text-gray-600",
    },
    {
      title: "Scheduled",
      value:
        annStats?.byStatus?.scheduled?.toLocaleString("en-NG", {
          notation: "compact",
        }) ?? 0,
      icon: Edit,
      iconBg: "text-blue-600",
    },
  ];

  function FilterSlots({ table }: { table: any }) {
    const statusValue =
      (table.getColumn("status")?.getFilterValue() as string) ?? "";

    return (
      <Select
        value={statusValue}
        onValueChange={(val) => table.getColumn("status")?.setFilterValue(val)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="sent">Sent</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Announcement Management Content */}
        <main className="p-6">
          <div className="flex justify-end gap-4 mb-4 w-full">
            <DialogContainer
              title="Create New Announcement"
              desc="Notify Your Users"
              dialogComp={<AnnouncementDialog />}
            >
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Announcement
              </Button>
            </DialogContainer>
          </div>
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

          {/* Announcements Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">
                All Announcements ({annStats?.total})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isListLoading && (
                <DataTable
                  data={[]}
                  columns={announcementColumns}
                  emptyState={<EmptyState />}
                />
              )}
              {!isListLoading && (
                <DataTable
                  data={announcememtListQuery.data?.announcements || []}
                  columns={announcementColumns}
                  searchPlaceholder="Search announcements by title, message, or ID..."
                  emptyState={<EmptyState />}
                  filterSlot={({ table }) => <FilterSlots table={table} />}
                  globalSearchColumns={["title"]}
                  serverSide={{
                    searchQuery,
                    onSearchChange: (value) => {
                      setSearchQuery(value);
                      pagination.reset();
                    },
                    hasMore:
                      Boolean(announcememtListQuery.data?.nextCursor) ??
                      announcememtListQuery.data?.hasMore ??
                      false,
                    onNextPage: () => {
                      if (announcememtListQuery.data?.nextCursor) {
                        pagination.goNext(
                          announcememtListQuery.data?.nextCursor!
                        );
                      }
                    },
                    onPrevPage: () => {
                      if (announcememtListQuery.data?.prevCursor) {
                        pagination.goPrev(
                          announcememtListQuery.data?.prevCursor!
                        );
                      }
                    },
                    onFirstPage: pagination.reset,
                    canGoPrev: !!announcememtListQuery.data?.prevCursor,
                    isFirstPage: pagination.cursor === null,
                    isLoading: isListLoading,
                    currentPageSize:
                      announcememtListQuery.data?.announcements?.length,
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
