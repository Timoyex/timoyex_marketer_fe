import { ColumnDef } from "@tanstack/react-table";
import { BellOff, Send, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Announcement } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnnCTACells } from "./actioncells";

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800";
    case "scheduled":
      return "bg-blue-100 text-blue-800";
    case "sent":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "critical":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-blue-100 text-blue-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <BellOff className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No Anouncements Found</h3>
    <p className="text-muted-foreground text-center max-w-md">
      Notify users of any changes.
    </p>
  </div>
);

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Column definitions
export const announcementColumns: ColumnDef<Announcement>[] = [
  {
    accessorKey: "title",

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Title
        </div>
      );
    },
    cell: ({ row }) => {
      const announcement = row.original;

      return (
        <div className="pl-4">
          <p className="font-medium text-slate-900">{announcement.title}</p>
          <p className="text-sm text-slate-500 line-clamp-2">
            {announcement.content}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <Badge
              className={`${getPriorityBadgeColor(
                announcement.priority
              )} border-0 text-xs`}
            >
              {announcement.priority}
            </Badge>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const announcement = row.original;
      return (
        <div className="pl-4">
          <Badge
            className={`${getStatusBadgeColor(
              announcement.status
            )} border-0 capitalize`}
          >
            {announcement.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Date
        </div>
      );
    },
    cell: ({ row }) => {
      const announcement = row.original;
      return (
        <div className="pl-4">
          <p className="text-sm text-slate-600">
            {announcement.status === "sent"
              ? `Sent ${formatDate(
                  (announcement?.sentAt as string) || new Date().toISOString()
                )}`
              : `Created ${formatDate(
                  (announcement?.createdAt as string) ||
                    new Date().toISOString()
                )}`}
          </p>
          {announcement.status === "scheduled" && (
            <p className="text-xs text-blue-600">
              Scheduled:{" "}
              {formatDate(
                (announcement?.scheduledAt as string) ||
                  new Date().toISOString()
              )}
            </p>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Actions
        </div>
      );
    },
    cell: ({ row }) => {
      const announcement = row.original;
      return <AnnCTACells announcement={announcement} />;
    },
  },
];
