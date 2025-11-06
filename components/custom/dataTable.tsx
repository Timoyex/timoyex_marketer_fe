// DataTable.tsx
import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  type Table,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import {
  Table as UiTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ServerSideConfig {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;

  filterQuery?: Record<string, any>;
  onFilterChange?: (value: Record<string, any>) => void;

  cursor?: string | null;
  nextCursor?: string | null;
  prevCursor?: string | null;

  hasMore: boolean;
  canGoPrev: boolean;
  isFirstPage: boolean;

  onNextPage: () => void;
  onPrevPage: () => void;
  onFirstPage: () => void;

  currentPageSize?: number;
  isLoading?: boolean;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyState?: React.ReactNode;
  globalSearchColumns?: string[];
  filterSlot?: (props: { table: Table<TData> }) => React.ReactNode;

  // optional server mode
  serverSide?: ServerSideConfig;
}

interface PaginatedTableProps<TData, TValue> {
  data: TData[];
  renderItem: (item: TData) => React.ReactNode;
  itemsPerPage?: number;
  emptyState?: React.ReactNode;
  handleNextPage: any;
  handlePrevPage: any;
  handleFirst: any;
  canGoNext: any;
  canGoPrev: any;
  isFirstPage: any;
  isLoading: any;
  hasMore: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
  emptyState,
  globalSearchColumns,
  filterSlot,
  serverSide,
}: DataTableProps<TData, TValue>) {
  const isServer = !!serverSide;

  // States (client mode only)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // -------------------------------------------------
  // React Table
  // -------------------------------------------------

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: !isServer ? getPaginationRowModel() : undefined,
    getFilteredRowModel: !isServer ? getFilteredRowModel() : undefined,

    state: {
      sorting: isServer ? [] : sorting,
      columnFilters: isServer ? [] : columnFilters,
      globalFilter: isServer ? "" : globalFilter,
    },

    manualPagination: isServer,
    manualFiltering: isServer,

    onSortingChange: isServer ? undefined : setSorting,
    onColumnFiltersChange: isServer ? undefined : setColumnFilters,
    onGlobalFilterChange: isServer ? undefined : setGlobalFilter,

    globalFilterFn: isServer
      ? undefined
      : (row, columnIds, filterValue) => {
          const targets: string[] = Array.isArray(globalSearchColumns)
            ? globalSearchColumns
            : Array.isArray(columnIds)
            ? columnIds
            : [columnIds];

          return targets.some((col) => {
            const val = row.getValue(col);
            return typeof val === "string" || typeof val === "number"
              ? val.toString().toLowerCase().includes(filterValue.toLowerCase())
              : false;
          });
        },

    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // -------------------------------------------------
  // Search input
  // -------------------------------------------------

  const handleSearchChange = (value: string) => {
    if (isServer) {
      serverSide?.onSearchChange?.(value);
    } else {
      setGlobalFilter(value);
    }
  };

  const searchValue = isServer ? serverSide?.searchQuery ?? "" : globalFilter;

  // -------------------------------------------------
  // Render UI
  // -------------------------------------------------

  return (
    <div className="w-full space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            disabled={serverSide?.isLoading}
            className="pl-10"
          />
        </div>

        {filterSlot && filterSlot({ table })}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        {!data || data.length === 0 ? (
          emptyState ?? (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">
                {serverSide?.isLoading ? "Loading..." : "No data available"}
              </p>
            </div>
          )
        ) : (
          <>
            <UiTable>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </UiTable>

            {/* Pagination */}
            {isServer ? (
              <ServerPagination server={serverSide} data={data} />
            ) : (
              <ClientPagination table={table} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const PaginatedTable = <TData, TValue>({
  data,
  renderItem,
  emptyState,
  handleFirst,
  handleNextPage,
  handlePrevPage,
  canGoNext,
  canGoPrev,
  isFirstPage,
  isLoading,
  hasMore,
}: PaginatedTableProps<TData, TValue>) => {
  if (!data || data.length === 0) {
    return (
      emptyState ?? (
        <div className="text-center py-8 text-muted-foreground">
          No items to display
        </div>
      )
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">{data.map(renderItem)}</div>

      {(hasMore || canGoPrev) && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {data?.length || 0} items
            {hasMore && " • More available"}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleFirst}
              disabled={isFirstPage || isLoading}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={!canGoPrev || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!canGoNext || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

function ServerPagination({
  server,
  data,
}: {
  server: ServerSideConfig;
  data: any[];
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing {server.currentPageSize ?? data.length} items
        {server.hasMore && " • More available"}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={server.onFirstPage}
          disabled={server.isFirstPage || server.isLoading}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={server.onPrevPage}
          disabled={!server.canGoPrev || server.isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={server.onNextPage}
          disabled={!server.hasMore || server.isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function ClientPagination<T>({ table }: { table: Table<T> }) {
  const page = table.getState().pagination;

  const start = page.pageIndex * page.pageSize + 1;
  const end = Math.min(
    (page.pageIndex + 1) * page.pageSize,
    table.getRowCount()
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Showing {start} to {end} of {table.getRowCount()} results
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
