import { ColumnDef } from "@tanstack/react-table";
import { differenceInCalendarDays } from "date-fns";
import { UserCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { UserCTACells } from "./userCTACells";
import { UserProfile } from "@/lib/stores/profile.store";
import { isDateString } from "@/lib/utils";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <UserCircle2 className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No users found</h3>
    <p className="text-muted-foreground text-center max-w-md">
      Start building your team by inviting members. They'll appear here once
      they join.
    </p>
  </div>
);

export const getLevelBadgeColor = (level: number) => {
  if (level <= 2) return "bg-gray-100 text-gray-800";
  if (level <= 4) return "bg-blue-100 text-blue-800";
  if (level <= 6) return "bg-green-100 text-green-800";
  if (level <= 8) return "bg-orange-100 text-orange-800";
  return "bg-purple-100 text-purple-800";
};

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "inactive":
    case "suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getLevelDesc = (level: number) => {
  switch (level) {
    case 1:
      return "Apprentice/Beginner (Novice)";
    case 2:
      return "Intermediate/Amateur Marketer";
    case 3:
      return "Junior Marketer";
    case 4:
      return "Senior I Marketer";
    case 5:
      return "Senior II Marketer";
    case 6:
      return "Executive Marketer";
    case 7:
      return "Professional Marketer";
    case 8:
      return "Expert Marketer";
    case 9:
      return "Lead Marketer";
    case 10:
      return "Ultimate Marketer";

    default:
      return "Level 0";
  }
};

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
export const userColumns: ColumnDef<UserProfile>[] = [
  {
    accessorKey: "user",

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          User
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      const initials = `${user?.firstName || ""} ${user?.lastName || ""}`;

      return (
        <div className="py-4 px-4">
          <div>
            <p className="font-medium text-slate-900 capitalize">{initials}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Level
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="py-4 px-4">
          <Badge className={`${getLevelBadgeColor(user?.level || 0)} border-0`}>
            Level {user.level}
          </Badge>
          <p className="text-xs text-slate-500 mt-1">
            {getLevelDesc(user?.level || 0)}
          </p>
        </div>
      );
    },
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
      const user = row.original;
      return (
        <div className="py-4 px-4 ">
          <Badge
            className={`${getStatusBadgeColor(
              user.status
            )} border-0 capitalize`}
          >
            {user.status}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "joined",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Joined At
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return formatDate(user.createdAt);
    },
  },
  {
    accessorKey: "last-leveled-up",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Last Leveled Up
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="py-4 px-4">
          <p className="text-sm text-slate-600">
            {user.levelUpdatedAt && isDateString(user.levelUpdatedAt)
              ? formatDate(user.levelUpdatedAt)
              : "Not Leveled Up Yet"}
          </p>
          <p className="text-xs text-slate-400">
            {user.levelUpdatedAt && isDateString(user.levelUpdatedAt)
              ? differenceInCalendarDays(
                  new Date(),
                  new Date(user.levelUpdatedAt)
                )
              : "0"}{" "}
            days
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <div className="text-left py-3 px-4 font-medium text-slate-600">
          Members
        </div>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="py-4 px-4">
          <p className="font-medium text-slate-900">
            {Number(user.totalDownlineCount).toLocaleString()} total
          </p>
          <p className="text-sm text-slate-500">
            {Number(user.directCount).toLocaleString()} direct
          </p>
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
      const user = row.original;
      return <UserCTACells user={user} />;
    },
  },
];
