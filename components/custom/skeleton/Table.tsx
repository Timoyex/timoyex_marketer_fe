import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamTableSkeleton() {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and filters skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
          <Skeleton className="h-10 w-full sm:w-40 rounded-md" />
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto">
          <div className="rounded-md border border-border min-w-[600px]">
            <div className="border-b border-border">
              <div className="grid grid-cols-6 gap-4 p-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Table rows skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 p-4 border-b border-border last:border-b-0"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <Skeleton className="h-4 w-48 order-2 sm:order-1" />
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Skeleton className="h-8 w-20" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-8 h-8 rounded" />
              ))}
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
