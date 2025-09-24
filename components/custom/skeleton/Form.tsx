import { Skeleton } from "@/components/ui/skeleton";

export default function FormSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Profile Overview Skeleton */}
      <div className="bg-card border-border shadow-sm rounded-xl p-6 space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-4 w-1/2 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
      </div>

      {/* Right side forms */}
      <div className="lg:col-span-2 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-card border-border shadow-sm rounded-xl p-6 space-y-4"
          >
            <Skeleton className="h-5 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
