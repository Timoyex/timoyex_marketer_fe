// TeamDataTable.tsx
import { ColumnDef, Row } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  Layers,
  Activity,
  UserCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Member } from "@/lib/api/team";

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
      <UserCircle2 className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">No team members found</h3>
    <p className="text-muted-foreground text-center max-w-md">
      Start building your team by inviting members. They'll appear here once
      they join.
    </p>
  </div>
);

// Utility functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "active":
      return "default";
    case "inactive":
      return "secondary";
    case "pending":
      return "outline";
    default:
      return "secondary";
  }
};

const filterSelect = <TData,>(
  row: Row<TData>,
  columnId: string,
  filterValue: string
) => {
  if (filterValue === "all" || !filterValue) return true;
  const value = row.getValue(columnId);
  return value === filterValue;
};

// Column definitions
export const teamColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    accessorFn: (row) => {
      const fullName = `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
      // if no name, fall back to email for sorting/filtering
      return fullName || row.email || "";
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold -ml-4"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const member = row.original;
      const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(
        0
      )}`;

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{member.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold -ml-4"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Join Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },
  {
    accessorKey: "level",
    accessorFn: (row) => String(row.level), // always return string for filtering/search
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold -ml-4"
        >
          <Layers className="mr-2 h-4 w-4" />
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <Badge variant="secondary">Level {row.getValue("level")}</Badge>
    ),
    filterFn: filterSelect,
  },
  {
    accessorKey: "status",
    accessorFn: (row) => String(row.status), // ensures filters use plain text
    filterFn: filterSelect,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-transparent p-0 h-auto font-semibold -ml-4"
        >
          <Activity className="mr-2 h-4 w-4" />
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={getStatusVariant(status)} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "members",
    enableSorting: false,

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 h-auto font-semibold -ml-4"
        >
          <Users className="mr-2 h-4 w-4" />
          Members
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      return (
        <>
          <p className="font-medium text-slate-900">
            {Number(user.totalDownlineCount).toLocaleString()} total
          </p>
          <p className="text-sm text-slate-500">
            {Number(user.directCount).toLocaleString()} direct
          </p>
        </>
      );
    },
  },
];
