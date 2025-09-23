import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ChartType = "line" | "bar" | "pie" | "area";

export default function ChartCardSkeleton({
  type = "line",
  size = "md",
  rows = 5,
  className = "",
}: {
  type?: ChartType;
  size?: "sm" | "md" | "lg";
  rows?: number;
  className?: string;
}) {
  const dims = {
    sm: { h: 120 },
    md: { h: 200 },
    lg: { h: 320 },
  } as const;

  const { h } = dims[size];
  return (
    <Card
      className={`bg-card border-border shadow-sm hover:scale-[1.02] transition-transform duration-200 cursor-pointer ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-card-foreground">
          <Skeleton className="h-4 w-[100px]" />
        </CardTitle>
        <div className="p-1.5 sm:p-2 rounded-lg">
          <Skeleton className="h-4 w-4 rounded-2xl" />
        </div>
      </CardHeader>

      <CardContent>
        {/* chart skeleton */}
        <div className="flex w-full flex-col gap-2" style={{ height: h }}>
          {type === "bar" && (
            <div className="flex h-full items-end justify-between gap-1">
              {Array.from({ length: rows }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-4 flex-1 rounded-sm"
                  style={{ height: `${40 + ((i * 7) % 40)}%` }}
                />
              ))}
            </div>
          )}

          {type === "line" && (
            <div className="flex flex-col justify-center gap-3 h-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-2 w-full" />
              ))}
            </div>
          )}

          {type === "area" && <Skeleton className="h-full w-full rounded-md" />}

          {type === "pie" && (
            <div className="flex h-full items-center justify-center">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
          )}
        </div>

        {/* footer text placeholder */}
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[180px]" />
        </div>
      </CardContent>
    </Card>
  );
}
