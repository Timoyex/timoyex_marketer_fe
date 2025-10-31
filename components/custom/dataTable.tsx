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
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  emptyState?: React.ReactNode;
  // Custom filter slot
  filterSlot?: (props: {
    table: ReturnType<typeof useReactTable<TData>>;
  }) => React.ReactNode;
  searchTerm?: string;
  globalSearchColumns?: string[];
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
  filterSlot,
  searchTerm,
  globalSearchColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: (row, columnIds, filterValue) => {
      const searchable: string[] = Array.isArray(globalSearchColumns)
        ? globalSearchColumns
        : Array.isArray(columnIds)
        ? columnIds
        : [columnIds]; // ensure it's always an array
      return searchable.some((colId) => {
        const value = row.getValue(colId);
        if (typeof value === "string" || typeof value === "number") {
          return value
            .toString()
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return false;
      });
    },
  });

  return (
    <div className="w-full space-y-4">
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder || "Search..."}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-10"
          />
        </div>

        {/* Custom Filters Slot */}
        {filterSlot && filterSlot({ table })}
      </div>
      {/* Table */}
      <div className="rounded-md border">
        {!data || data.length === 0 ? (
          emptyState || (
            <div className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">No data available</p>
            </div>
          )
        ) : (
          <>
            <Table className="min-w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-6">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-6">
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
            </Table>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  data.length
                )}{" "}
                of {data.length} results
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

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, table.getPageCount()) },
                    (_, i) => (
                      <Button
                        key={i}
                        variant={
                          table.getState().pagination.pageIndex === i
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => table.setPageIndex(i)}
                        className="w-8 h-8 p-0"
                      >
                        {i + 1}
                      </Button>
                    )
                  )}
                </div>

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
